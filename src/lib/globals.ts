import { z } from 'astro/zod';
import { linkSchema } from './section-base';
import bookingData from '../content/booking.json';
import mapData from '../content/map.json';

/**
 * Global sections: content edited once and pulled into any page through the
 * `global_block` section. Keeping a single source for the booking process and
 * the shop map means an editor changes them in one place rather than re-typing
 * the same block on every page that shows it.
 *
 * Each global mirrors the fields of the section component that renders it
 * (Steps, Accordion, ContactDetails), so the `global_block` renderer can hand
 * the parsed data straight to that component.
 */

const bookingSchema = z.object({
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	steps: z
		.array(
			z.object({
				title: z.string(),
				body: z.string().optional(),
			})
		)
		.default([]),
	cta: linkSchema.optional(),
});

const mapSchema = z.object({
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	/** A Google Maps (or any) embed URL. Rendered as a responsive iframe. */
	embedUrl: z.string(),
	/** Announced by screen readers in place of the map. */
	embedTitle: z.string(),
	/** Optional plain-text address shown beside the map. */
	addressLine: z.string().optional(),
});

/** Parsed once at build time; an invalid global fails the build here. */
export const booking = bookingSchema.parse(bookingData);
export const map = mapSchema.parse(mapData);

export type BookingGlobal = typeof booking;
export type MapGlobal = typeof map;

/** Which global a `global_block` section pulls in. */
export const globalKeys = ['booking', 'map'] as const;
export type GlobalKey = (typeof globalKeys)[number];
