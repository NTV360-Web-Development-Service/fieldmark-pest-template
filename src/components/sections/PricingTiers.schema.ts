import { z } from 'astro/zod';
import { defineSection, linkSchema } from '../../lib/section-base';

/**
 * A row of pricing / financing tiers: two to four cards, one optionally
 * highlighted as the recommended choice, each carrying a price, a term note, a
 * checklist of what it covers, and a CTA. An optional billing toggle flips every
 * card between two labelled price sets (e.g. monthly vs. total, or two term
 * lengths) on the client with no reload.
 *
 * Not `promo_cards` -- that block is image-led and each card is a standalone
 * pitch. This is the side-by-side comparison band where the cards share one
 * shape so a reader can scan across them. Not `offers` either, which is a coupon
 * grid keyed to codes and expiry dates.
 */
export const pricingTiersSchema = defineSection('pricing_tiers', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4']).default('3'),
	/**
	 * Optional two-way billing switch. When present, each tier reads its price
	 * from `price` (the first mode) or `priceAlt` (the second). Leave it off for
	 * static cards, in which case only `price` is shown.
	 */
	toggle: z
		.object({
			primaryLabel: z.string(),
			altLabel: z.string(),
			/** Small note beside the switch, e.g. "Longer terms, lower monthly". */
			note: z.string().optional(),
		})
		.optional(),
	tiers: z
		.array(
			z.object({
				name: z.string(),
				/** Small tag on the highlighted card, e.g. "Most chosen". */
				badge: z.string().optional(),
				/** Draws the recommended treatment on this card. One per row reads best. */
				featured: z.boolean().default(false),
				/** Small label above the price, e.g. "From". */
				priceLabel: z.string().optional(),
				/** The headline figure, e.g. "$149". Kept a string so "Custom" works too. */
				price: z.string(),
				/** Small label after the price, e.g. "/mo". */
				priceUnit: z.string().optional(),
				/** The figure shown in the toggle's second mode. Falls back to `price`. */
				priceAlt: z.string().optional(),
				priceAltUnit: z.string().optional(),
				/** A line under the price, e.g. "On jobs from $2,000". */
				note: z.string().optional(),
				/** What this tier covers, one line each, shown with a tick. */
				features: z.array(z.string()).default([]),
				cta: linkSchema.optional(),
			})
		)
		.default([]),
	/** Small print under the row, e.g. the representative-example line. */
	footnote: z.string().optional(),
});

export type PricingTiers = z.infer<typeof pricingTiersSchema>;
