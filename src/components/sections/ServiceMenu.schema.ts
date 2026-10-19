import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';
import { iconNames } from '../../lib/icons';

/**
 * A tabbed service explorer: a row of category tabs, each swapping a "now
 * viewing" banner and a grid of numbered service cards.
 *
 * Not `card_grid` -- that block is one flat list with no tabs. This one groups
 * cards under tabs and reveals one group at a time. It degrades to the first
 * tab's cards with no JavaScript, so the content is always present and
 * crawlable; the tabs only make the rest reachable without scrolling.
 *
 * Numbering (01, 02, …) is rendered from card order, so reordering renumbers.
 * Icons come from the shared set in `lib/icons`.
 */
export const serviceMenuSchema = defineSection('service_menu', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	/** Prefixes each tab's banner label, e.g. "Now viewing". */
	nowViewingLabel: z.string().default('Now viewing'),
	columns: z.enum(['2', '3', '4']).default('4'),
	tabs: z
		.array(
			z.object({
				label: z.string(),
				/** Shown large across the banner. Defaults to the tab label. */
				bannerTitle: z.string().optional(),
				image: imageSchema.optional(),
				cards: z
					.array(
						z.object({
							icon: z.enum(iconNames).optional(),
							title: z.string(),
							body: z.string().optional(),
							link: linkSchema.optional(),
						})
					)
					.default([]),
			})
		)
		/**
		 * Capped at six. The no-JavaScript fallback reveals panels with a fixed set
		 * of `:nth-of-type` CSS rules, one per tab, so a seventh tab would have no
		 * rule and its panel would never show without script. The cap keeps the
		 * contract honest with the CSS in ServiceMenu.astro; raise both together.
		 */
		.max(6)
		.default([]),
});

export type ServiceMenu = z.infer<typeof serviceMenuSchema>;
