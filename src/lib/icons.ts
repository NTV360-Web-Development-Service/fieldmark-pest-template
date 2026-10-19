/**
 * The one line-icon set shared across sections.
 *
 * Kept as a closed enum plus a path map, not free SVG, so a section can never
 * render broken markup and every icon on the page shares one visual weight.
 * Each path is drawn on a 24 grid with a ~20px optical body, meant for
 * `currentColor` at a ~1.75 stroke so the marks read as shop-drawing lines
 * rather than filled app glyphs. Add an icon by adding it in both places here.
 */
export const iconNames = [
	'shield',
	'phone',
	'clock',
	'check',
	'star',
	'wrench',
	'badge',
	'dollar',
	'truck',
	'user',
] as const;

export type IconName = (typeof iconNames)[number];

export const iconPaths: Record<IconName, string> = {
	shield:
		'M12 2.5l7.5 3v5.2c0 4.9-3.2 8.9-7.5 10-4.3-1.1-7.5-5.1-7.5-10V5.5l7.5-3z M8.75 11.9l2.2 2.2 4.3-4.5',
	phone:
		'M15.4 13.3l-1.5 1.5a12 12 0 01-4.7-4.7l1.5-1.5a1 1 0 00.2-1.1L9.6 4.7A1 1 0 008.6 4H5.4A1.1 1.1 0 004.3 5.2C4.8 13.4 10.6 19.2 18.8 19.7a1.1 1.1 0 001.2-1.1v-3.2a1 1 0 00-.6-1l-2.9-1.3a1 1 0 00-1.1.2z',
	clock: 'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z M12 7.5V12l3 1.8',
	check: 'M4.5 12.5l4.8 4.8L19.5 6.6',
	star: 'M12 3l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 16.9 6.5 19.6l1.4-6.1L3.2 9.3l6.2-.6z',
	wrench:
		'M20 6.3a4.6 4.6 0 01-6 4.4L6.4 18.3a1.8 1.8 0 01-2.7-2.7l7.6-7.6a4.6 4.6 0 014.4-6l-2.6 2.6.6 2.6 2.6.6z',
	badge:
		'M12 2.5l2 1.7 2.6-.4 1 2.4 2.4 1-.4 2.6 1.7 2-1.7 2 .4 2.6-2.4 1-1 2.4-2.6-.4-2 1.7-2-1.7-2.6.4-1-2.4-2.4-1 .4-2.6-1.7-2 1.7-2-.4-2.6 2.4-1 1-2.4 2.6.4z M9.6 12l1.7 1.7 3.1-3.4',
	dollar:
		'M12 3.5v17 M15.5 7.6c-.6-1.3-2-1.9-3.6-1.9-1.9 0-3.4 1-3.4 2.8 0 3.7 7.3 1.8 7.3 5.7 0 1.9-1.7 2.9-3.8 2.9-1.7 0-3.3-.7-4-2',
	truck:
		'M3 6.5h10.5v8.5H3z M13.5 9.5h3.7l2.8 2.9v2.6h-2.5 M5.9 15a1.8 1.8 0 103.6 0 1.8 1.8 0 00-3.6 0z M15 15a1.8 1.8 0 103.6 0 1.8 1.8 0 00-3.6 0z M9.5 15h5.5',
	user: 'M12 12.5a3.7 3.7 0 100-7.4 3.7 3.7 0 000 7.4z M5 20c0-3.6 3.1-5.8 7-5.8s7 2.2 7 5.8',
};
