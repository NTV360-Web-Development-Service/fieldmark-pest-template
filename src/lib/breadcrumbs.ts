/**
 * Where breadcrumb trails come from.
 *
 * A trail is derivable, not authored: it is Home, then the section a page sits
 * under, then the page itself. Storing that in content would duplicate what the
 * route and the title already say, and let the crumb drift out of sync with the
 * page. So every trail is computed here, in one place, and no content file
 * carries breadcrumb data.
 */

export interface Crumb {
	label: string;
	/** Omitted on the last item. The current page is not a link. */
	href?: string;
}

/**
 * Trail for a hand-authored page: Home / Title.
 *
 * Every top-level page sits one level under the root, so the trail is always
 * two crumbs. The label is the page's own title; nothing deeper exists to
 * derive, and nothing shallower is worth authoring.
 */
export function pageTrail(title: string): Crumb[] {
	return [{ label: 'Home', href: '/' }, { label: title }];
}

/**
 * Trail for a collection entry: Home / Section / [Parent /] Title.
 *
 * `indexLabel`/`indexHref` name the collection's own index (Services,
 * /services). A sub-category entry inserts its parent between the index and
 * itself; a top-level entry does not.
 *
 * `indexHref` is optional: a collection whose index page has been removed still
 * shows its section label in the trail, just not as a link.
 */
export function entryTrail(
	title: string,
	indexLabel: string,
	indexHref: string | undefined,
	parent?: { label: string; href: string }
): Crumb[] {
	return [
		{ label: 'Home', href: '/' },
		{ label: indexLabel, ...(indexHref ? { href: indexHref } : {}) },
		...(parent ? [{ label: parent.label, href: parent.href }] : []),
		{ label: title },
	];
}
