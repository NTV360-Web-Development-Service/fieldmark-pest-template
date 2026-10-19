import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';

export const teamSchema = defineSection('team', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4']).default('3'),
	members: z
		.array(
			z.object({
				photo: imageSchema.optional(),
				name: z.string(),
				/** Job title, shown in accent mono caps between name and bio. */
				role: z.string().optional(),
				bio: z.string().optional(),
			})
		)
		.default([]),
	/** Optional button under the grid, e.g. an overview linking to the full team page. */
	cta: linkSchema.optional(),
});

export type Team = z.infer<typeof teamSchema>;
