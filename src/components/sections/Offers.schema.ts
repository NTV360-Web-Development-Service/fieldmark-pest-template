import { z } from 'astro/zod';
import { defineSection, linkSchema } from '../../lib/section-base';

export const offersSchema = defineSection('offers', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3']).default('3'),
	items: z
		.array(
			z.object({
				title: z.string(),
				/** The saving itself, e.g. "$100 off" or "Free consultation". */
				value: z.string().optional(),
				body: z.string().optional(),
				/** Shown as a copyable code when set. */
				code: z.string().optional(),
				/** ISO date. The offer disappears by itself the day after. */
				expires: z.string().optional(),
				terms: z.string().optional(),
				cta: linkSchema.optional(),
			})
		)
		.default([]),
});

export type Offers = z.infer<typeof offersSchema>;
