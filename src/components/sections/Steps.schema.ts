import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/**
 * Numbered because the content genuinely is a sequence. Numbering a set of
 * unordered features would be decoration; here the order is the information.
 */
export const stepsSchema = defineSection('steps', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	steps: z
		.array(
			z.object({
				title: z.string(),
				body: z.string().optional(),
			})
		)
		.default([]),
});

export type Steps = z.infer<typeof stepsSchema>;
