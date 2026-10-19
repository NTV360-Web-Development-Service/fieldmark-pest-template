import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';

/**
 * The hero background is a discriminated union, not a select plus three sets of
 * sibling fields. Pages CMS has no conditional field visibility, but a `block`
 * field without `list` gives exactly that: the editor picks one kind and only
 * that kind's fields render.
 *
 * `kind` must match `blockKey: kind` in `.pages.yml`.
 */
export const heroBackgroundSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('image'),
		image: imageSchema,
	}),
	z.object({
		kind: z.literal('video'),
		/** Uploaded file or hosted URL; the CMS records which, rendering does not care. */
		file: z.object({
			source: z.enum(['upload', 'url']).optional(),
			src: z.string().min(1),
		}),
		/** Shown until the video can play, and all a data-saving browser gets. */
		poster: z.string().optional(),
	}),
	z.object({
		kind: z.literal('carousel'),
		slides: z.array(imageSchema).min(2, 'A carousel needs at least two slides'),
		/** Seconds each slide holds before crossfading. */
		interval: z.number().min(2).max(30).default(6),
	}),
]);

export type HeroBackground = z.infer<typeof heroBackgroundSchema>;

export const heroSchema = defineSection('hero', {
	/** How the text sits: beside the media, centered, or over a full-bleed background. */
	layout: z.enum(['split', 'centered', 'full']).default('split'),

	/** Omit entirely for a hero with no media. */
	background: heroBackgroundSchema.nullish(),

	eyebrow: z.string().optional(),
	heading: z.string(),
	/** rich-text in the CMS: renders as HTML so editors can bold and link. */
	body: z.string().optional(),

	/**
	 * Caption pinned to the bottom edge of the image on the split layout.
	 * Not used full-bleed: floating it over a photograph annotates nothing.
	 */
	mediaNote: z.string().optional(),

	ctas: z.array(linkSchema).default([]),
	/** Short trust proofs rendered under the CTAs, e.g. "Licensed and insured". */
	badges: z.array(z.string()).default([]),
	rating: z
		.object({
			value: z.number().min(0).max(5),
			count: z.number().int().nonnegative().optional(),
			label: z.string().default('verified reviews'),
		})
		.optional(),
});

export type Hero = z.infer<typeof heroSchema>;
