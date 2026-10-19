import { z } from 'astro/zod';
import { defineSection, imageSchema } from '../../lib/section-base';

export const mediaCompareSchema = defineSection('media_compare', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	/** `slider` overlays the two; `split` shows them side by side. */
	display: z.enum(['slider', 'split']).default('slider'),
	items: z
		.array(
			z.object({
				before: imageSchema,
				after: imageSchema,
				caption: z.string().optional(),
			})
		)
		.default([]),
	beforeLabel: z.string().default('Before'),
	afterLabel: z.string().default('After'),
});

export type MediaCompare = z.infer<typeof mediaCompareSchema>;
