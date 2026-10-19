/**
 * Shared button appearance, so anything that must render as a real `<button>`
 * (e.g. a form submit, which cannot be the `<a>`-based Button component) still
 * looks identical to Button and stays in sync when the styling changes here.
 *
 * Button.astro is the primary consumer; keep visual tweaks in this file rather
 * than inlining button classes elsewhere.
 */

export type ButtonStyle = 'primary' | 'accent' | 'secondary' | 'ghost';

/**
 * Button scale. Each token is a self-contained set of size utilities (font-size,
 * weight, padding, min-height, tracking) so a button only ever carries ONE of
 * each -- sizes are chosen here, never layered via overriding classes at the call
 * site. That keeps sizing immune to Tailwind's source-order cascade, which bites
 * whenever two conflicting utilities (e.g. `text-sm` over `text-[0.8125rem]`)
 * fight and the wrong one happens to be emitted later.
 *
 * - `sm`  nav chrome: compact, sits beside 11-12px nav links.
 * - `md`  site-wide default: deliberately heavier than body copy (prose is
 *         14-18px regular lower-case; this is 13px bold uppercase + tracking, so
 *         it reads as the stronger element wherever a CTA sits next to a
 *         description -- the QA ask).
 * - `lg`  hero / CTA banner: the page's primary action, one step up again.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

// Everything that is NOT size-related. Size comes from buttonSize() so the two
// never collide.
export const buttonBase =
	'group inline-flex items-center justify-center gap-2.5 rounded-(--radius-media) whitespace-nowrap font-mono uppercase transition-colors duration-300';

/** Size utilities for a given scale token. One font-size/padding/min-height each. */
export function buttonSize(size: ButtonSize): string {
	switch (size) {
		case 'sm':
			return 'min-h-10 px-6 text-[0.6875rem] font-medium tracking-[0.14em]';
		case 'lg':
			return 'min-h-[3.5rem] px-9 text-sm font-semibold tracking-[0.16em]';
		default:
			return 'min-h-[3.25rem] px-8 text-[0.8125rem] font-semibold tracking-[0.15em]';
	}
}

/** Variant classes. `onDark` inverts the outline variants for dark surfaces. */
export function buttonVariant(style: ButtonStyle, onDark = false): string {
	switch (style) {
		// The brass accent reads as a true call-to-action on any surface -- crucially
		// on the brand-green banner, where a `primary` (green-on-green) button all but
		// vanishes. Same treatment on light or dark, so the CTA always pops.
		case 'accent':
			return 'bg-cta text-cta-fg shadow-[0_12px_28px_-8px_rgba(224,168,62,0.45)] hover:bg-cta-hover';
		case 'secondary':
			return onDark
				? 'border border-current/30 text-current hover:border-current/60'
				: 'border border-line text-ink hover:border-ink';
		case 'ghost':
			return onDark
				? 'px-0 text-current hover:text-accent'
				: 'px-0 text-brand hover:text-accent';
		default:
			return 'bg-brand text-brand-fg hover:bg-brand-hover';
	}
}
