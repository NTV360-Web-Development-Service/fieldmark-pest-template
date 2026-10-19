import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';

export const cardGridSchema = defineSection('card_grid', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4', '5']).default('3'),
	cards: z
		.array(
			z.object({
				image: imageSchema.optional(),
				title: z.string(),
				body: z.string().optional(),
				link: linkSchema.optional(),
			})
		)
		.default([]),
});

export type CardGrid = z.infer<typeof cardGridSchema>;
