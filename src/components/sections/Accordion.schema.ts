import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

export const accordionSchema = defineSection('accordion', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	items: z
		.array(
			z.object({
				question: z.string(),
				/** rich-text in the CMS, so answers can carry links and lists. */
				answer: z.string(),
			})
		)
		.default([]),
});

export type Accordion = z.infer<typeof accordionSchema>;
