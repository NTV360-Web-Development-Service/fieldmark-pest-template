import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/** Like card_grid but without card chrome: for short, scannable points. */
export const featureListSchema = defineSection('feature_list', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4']).default('3'),
	items: z
		.array(
			z.object({
				title: z.string(),
				body: z.string().optional(),
			})
		)
		.default([]),
});

export type FeatureList = z.infer<typeof featureListSchema>;
