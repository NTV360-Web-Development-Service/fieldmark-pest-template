import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';
import { iconNames } from '../../lib/icons';

/**
 * A bullet is either a plain string (the common case, rendered with the default
 * tick) or an object that swaps in a specific icon from the shared set and can
 * add a second description line. The union keeps every existing string bullet
 * valid while letting a bullet opt into a meaningful mark -- a shield for
 * "insured", a wrench for "our own team" -- and a "title + explanation" shape.
 */
export const bulletSchema = z.union([
	z.string(),
	z.object({
		text: z.string(),
		/** Optional second line under the bullet, for a "title + explanation" bullet. */
		desc: z.string().optional(),
		/**
		 * Optional. The CMS writes an empty string for "default tick", which
		 * `''` -> undefined turns back into no icon so the enum still validates.
		 */
		icon: z
			.enum(iconNames)
			.or(z.literal(''))
			.optional()
			.transform((v) => (v === '' ? undefined : v)),
	}),
]);

export const mediaSplitSchema = defineSection('media_split', {
	eyebrow: z.string().optional(),
	heading: z.string(),
	body: z.string().optional(),
	image: imageSchema.optional(),
	/** Which side the image sits on at desktop width. */
	imageSide: z.enum(['left', 'right']).default('right'),
	bullets: z.array(bulletSchema).default([]),
	ctas: z.array(linkSchema).default([]),
});

export type MediaSplit = z.infer<typeof mediaSplitSchema>;
