import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/** Fine print. Small, quiet, and never competing with the page. */
export const legalTextSchema = defineSection('legal_text', {
	heading: z.string().optional(),
	body: z.string(),
});

export type LegalText = z.infer<typeof legalTextSchema>;
