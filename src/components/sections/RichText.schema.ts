import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

export const richTextSchema = defineSection('rich_text', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	/** rich-text in the CMS. The whole point of this section. */
	body: z.string(),
	align: z.enum(['left', 'center']).default('left'),
});

export type RichText = z.infer<typeof richTextSchema>;
