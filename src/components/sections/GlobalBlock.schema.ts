import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';
import { globalKeys } from '../../lib/globals';

/**
 * Pulls a global section into the page.
 *
 * The content lives once in its own CMS singleton (Book a Consultation, FAQ or
 * Map); this block just says "show that here". Editing the
 * global updates every page that references it. The presentation knobs from the
 * section base (surface, spacing, width, anchor) still apply per placement, so
 * the same global can sit on a muted band on one page and a plain one on
 * another.
 */
export const globalBlockSchema = defineSection('global_block', {
	which: z.enum(globalKeys),
});

export type GlobalBlock = z.infer<typeof globalBlockSchema>;
