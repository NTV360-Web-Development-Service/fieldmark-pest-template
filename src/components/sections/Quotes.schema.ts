import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

export const quotesSchema = defineSection('quotes', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	items: z
		.array(
			z.object({
				quote: z.string(),
				name: z.string(),
				/** City or neighbourhood. Local proof outperforms a bare first name. */
				location: z.string().optional(),
				rating: z.number().min(0).max(5).optional(),
			})
		)
		.default([]),
});

export type Quotes = z.infer<typeof quotesSchema>;
