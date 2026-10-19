/**
 * WCAG relative luminance and contrast ratio.
 *
 * Used by the theme preview page so a palette change shows immediately
 * whether it still clears AA, rather than shipping an unreadable site and
 * finding out from a client.
 */

function channel(value: number): number {
	const v = value / 255;
	return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function hexToRgb(hex: string): [number, number, number] {
	const clean = hex.replace('#', '');
	const full =
		clean.length === 3
			? clean
					.split('')
					.map((c) => c + c)
					.join('')
			: clean;
	return [
		parseInt(full.slice(0, 2), 16),
		parseInt(full.slice(2, 4), 16),
		parseInt(full.slice(4, 6), 16),
	];
}

export function luminance(hex: string): number {
	const [r, g, b] = hexToRgb(hex);
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
	const la = luminance(a);
	const lb = luminance(b);
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export type ContrastVerdict = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** `large` means 24px+, or 18.66px+ bold, where AA drops to 3:1. */
export function verdict(ratio: number): ContrastVerdict {
	if (ratio >= 7) return 'AAA';
	if (ratio >= 4.5) return 'AA';
	if (ratio >= 3) return 'AA Large';
	return 'Fail';
}

/**
 * Pick a readable foreground for `bg` from the supplied candidates.
 *
 * This is what makes the palette self-correcting: an editor can set any
 * section background in the CMS and the text colour is derived from it at
 * build time, rather than a hand-paired token that silently goes unreadable.
 *
 * Preference order, not "highest contrast wins": the first brand candidate
 * that clears `min` is used, so the intended soft-grey body colour is kept
 * whenever it is already legible. Only when no brand candidate passes does it
 * fall back to black or white — whichever contrasts more — so a background the
 * palette never anticipated is still readable rather than pretty.
 */
export function readableOn(bg: string, candidates: string[], min = 4.5): string {
	for (const fg of candidates) {
		if (contrast(fg, bg) >= min) return fg;
	}
	return contrast('#ffffff', bg) >= contrast('#000000', bg) ? '#ffffff' : '#000000';
}
