import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/**
 * A reserved slot the client fills in later.
 *
 * Deliberately visible rather than hidden: an invisible placeholder is one
 * nobody remembers, and it ships as a gap in the page. This renders as an
 * obviously unfinished block, and `npm run build` lists every page still
 * carrying one.
 */
export const placeholderSchema = defineSection('placeholder', {
	/** What belongs here, written for whoever has to fill it. */
	label: z.string().default('Content to be added'),
	note: z.string().optional(),
	/** Rough height hint, so the layout resembles the finished page. */
	size: z.enum(['sm', 'md', 'lg']).default('md'),
});

export type Placeholder = z.infer<typeof placeholderSchema>;
