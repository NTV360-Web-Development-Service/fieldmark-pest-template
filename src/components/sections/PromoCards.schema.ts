import { z } from 'astro/zod';
import { defineSection, imageSchema, linkSchema } from '../../lib/section-base';
import { iconNames } from '../../lib/icons';

/**
 * A row of promotional cards: a photo with an icon chip and a corner badge, over
 * a filled lower panel carrying a title, an accent subtitle, then either a price
 * chip or body copy, and a CTA beside a phone number.
 *
 * Not `offers` -- that block is a coupon grid keyed to codes and expiry dates.
 * This is the image-led "maintenance / financing / current offer" band, where
 * each card is a standalone pitch with its own artwork and call to action.
 *
 * Each card shows a price chip when `price` is set, otherwise its `body`. Icons
 * and the panel accent come from the shared set in `lib/icons`.
 */
export const promoCardsSchema = defineSection('promo_cards', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3']).default('3'),
	cards: z
		.array(
			z.object({
				image: imageSchema.optional(),
				icon: z.enum(iconNames).optional(),
				/** Small tag in the top corner, e.g. "Members only", "Limited time". */
				badge: z.string().optional(),
				title: z.string(),
				/** The accent line under the title, e.g. "For as low as". */
				subtitle: z.string().optional(),
				/**
				 * A price callout shown in place of body copy. When present it wins;
				 * leave it off for a text-only card.
				 */
				price: z
					.object({
						label: z.string().optional(),
						value: z.string(),
						unit: z.string().optional(),
					})
					.optional(),
				body: z.string().optional(),
				cta: linkSchema.optional(),
				/** Display phone, e.g. "(555) 014-2200". */
				phone: z.string().optional(),
				/** Dialable form, e.g. "tel:+15550142200". */
				phoneHref: z.string().optional(),
			})
		)
		.default([]),
});

export type PromoCards = z.infer<typeof promoCardsSchema>;
