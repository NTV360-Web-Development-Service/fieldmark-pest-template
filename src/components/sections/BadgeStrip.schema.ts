import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';
import { iconNames } from '../../lib/icons';

/**
 * A thin band of icon + label pairs: the trust row that sits just under a hero
 * (24/7, Licensed, Free estimates…). Not `feature_list` — that block carries a
 * heading, card borders and body copy; this one is a single compact line with
 * no section heading of its own. Icons come from the shared set in `lib/icons`.
 */
export const badgeStripSchema = defineSection('badge_strip', {
	/**
	 * Admin-only name for this section. The strip has no heading of its own, so
	 * without this its collapsed row in the CMS would show only its number. Not
	 * rendered on the page.
	 */
	label: z.string().optional(),
	items: z
		.array(
			z.object({
				icon: z.enum(iconNames).default('check'),
				title: z.string(),
				/** The quieter second line, e.g. "Bonded & Insured". */
				subtitle: z.string().optional(),
			})
		)
		.default([]),
});

export type BadgeStrip = z.infer<typeof badgeStripSchema>;
