import { Marked } from 'marked';

/**
 * The markdown renderer used for every CMS rich-text field.
 *
 * Beyond plain markdown it does two things: repairs link targets, and keeps
 * the anchor it builds safe.
 *
 * Overriding the link renderer means marked's own escaping no longer applies,
 * so escaping and scheme checking have to be reinstated here. Editors are
 * trusted, but this template is deployed for many clients and a CMS account is
 * exactly the kind of thing that gets shared or phished.
 */

/** `example.com`, `www.example.co.uk/path` -- a host, not a path. */
const DOMAIN_LIKE = /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#]|$)/i;

/** Already absolute, protocol-relative, root-relative, or an anchor. */
const ALREADY_RESOLVED = /^([a-z][a-z0-9+.-]*:|\/\/|\/|#)/i;

/**
 * Schemes a link may use. An allowlist rather than a denylist: `javascript:`
 * and `data:` are the obvious dangers, but so are `vbscript:` and whatever
 * the next one turns out to be.
 */
const ALLOWED_SCHEME = /^(https?|mailto|tel):/i;

const ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'"': '&quot;',
	"'": '&#39;',
	'<': '&lt;',
	'>': '&gt;',
};

/** Escapes a value for use inside a double-quoted HTML attribute. */
function escapeAttr(value: string): string {
	return value.replace(/[&"'<>]/g, (char) => ESCAPES[char]);
}

export function normaliseHref(href: string): string {
	const trimmed = href.trim();
	if (trimmed === '') return '';

	// A bare word like `about` is a genuine relative link and is left alone;
	// only something shaped like a host gets a scheme.
	if (!ALREADY_RESOLVED.test(trimmed)) {
		return DOMAIN_LIKE.test(trimmed) ? `https://${trimmed}` : trimmed;
	}

	// Anchors, root-relative and protocol-relative targets carry no scheme to
	// check and cannot execute.
	if (/^(#|\/)/.test(trimmed)) return trimmed;

	return ALLOWED_SCHEME.test(trimmed) ? trimmed : '';
}

export const markdown = new Marked({
	renderer: {
		link(token) {
			const href = normaliseHref(token.href);
			const text = this.parser.parseInline(token.tokens);

			// A rejected scheme renders as plain text. Emitting an inert `#` would
			// leave something that looks clickable and silently does nothing.
			if (href === '') return text;

			const title = token.title ? ` title="${escapeAttr(token.title)}"` : '';

			// Links leaving the site open in a new tab, with rel guarding against
			// the opener being reachable from the new document.
			const external = /^(https?:)?\/\//i.test(href);
			const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';

			return `<a href="${escapeAttr(href)}"${title}${attrs}>${text}</a>`;
		},
	},
});

/**
 * Re-levels the headings in rendered prose so they sit below a given rank.
 *
 * Editors write `#` or `##` without knowing what surrounds their text, and the
 * right answer depends on the section: prose under a section heading belongs at
 * h3, prose in a section with no heading of its own belongs at h2. Applied
 * after parsing rather than in the renderer, because a single shared renderer
 * cannot know the context of each call.
 *
 * Relative, not absolute: the shallowest heading present becomes `startLevel`
 * and the rest keep their spacing, so `##` then `###` stays a step rather than
 * becoming a hole.
 */
export function shiftHeadings(html: string, startLevel: number): string {
	const levels = [...html.matchAll(/<h([1-6])/g)].map((m) => Number(m[1]));
	if (levels.length === 0) return html;

	const offset = startLevel - Math.min(...levels);
	if (offset === 0) return html;

	return html.replace(/<(\/?)h([1-6])/g, (_, slash: string, depth: string) => {
		const shifted = Math.min(6, Math.max(1, Number(depth) + offset));
		return `<${slash}h${shifted}`;
	});
}
