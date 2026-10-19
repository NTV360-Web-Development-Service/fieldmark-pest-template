import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/**
 * Postcode or town lookup against the locations collection.
 *
 * Filters a list that is already rendered, so with no JavaScript a visitor
 * still sees every location and every postcode. The input only narrows it.
 */
export const searchBlockSchema = defineSection('search_block', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	label: z.string().default('Town or postcode'),
	placeholder: z.string().default('e.g. 85251 or Scottsdale'),
	/** Shown when nothing matches, alongside the phone number. */
	emptyNote: z.string().default('We may still cover you. Call the shop and ask.'),
});

export type SearchBlock = z.infer<typeof searchBlockSchema>;
