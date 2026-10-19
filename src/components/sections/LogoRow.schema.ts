import { z } from 'astro/zod';
import { defineSection, imageSchema } from '../../lib/section-base';

export const logoRowSchema = defineSection('logo_row', {
	heading: z.string().optional(),
	/** `marquee` slides continuously; `grid` stays put. Same fields either way. */
	layout: z.enum(['grid', 'marquee']).default('grid'),
	/** Mutes the logos so a wall of brand colours does not fight the page. */
	muted: z.boolean().default(true),
	logos: z
		.array(
			z.object({
				image: imageSchema.optional(),
				/** Used as the label when no image is supplied, and as the link title. */
				name: z.string(),
				href: z.string().optional(),
			})
		)
		.default([]),
});

export type LogoRow = z.infer<typeof logoRowSchema>;
