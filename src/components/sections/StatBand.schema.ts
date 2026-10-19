import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

export const statBandSchema = defineSection('stat_band', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	stats: z
		.array(
			z.object({
				/** The number itself, as text, so "1M+" and "4.8" both work. */
				value: z.string(),
				label: z.string(),
			})
		)
		.default([]),
});

export type StatBand = z.infer<typeof statBandSchema>;
