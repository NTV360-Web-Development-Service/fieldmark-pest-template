import { z } from 'astro/zod';
import { defineSection, imageSchema } from '../../lib/section-base';

/**
 * Compact opener for interior pages.
 *
 * The breadcrumb trail is not part of the header: it is derived from the route
 * (see `lib/breadcrumbs.ts`) and rendered as its own band above the page by
 * `Breadcrumbs`, so a header never carries wayfinding an editor could misplace
 * or let drift from the page.
 */
export const pageHeaderSchema = defineSection('page_header', {
	/**
	 * Which of the two header layouts to render.
	 *
	 * `split` is the compact opener for interior/detail pages: text on the left,
	 * a 4:3 photo on the right. `feature` is the louder treatment for the main
	 * category pages that sit one level up (Services, a room landing) -- an
	 * oversized display heading stacked over a full-width banner photo carrying
	 * the dimension note. Same content shape; the only difference is presentation,
	 * so a page can be re-cast between them by flipping this one field.
	 */
	variant: z.enum(['split', 'feature']).default('split'),
	eyebrow: z.string().optional(),
	heading: z.string(),
	body: z.string().optional(),
	image: imageSchema.optional(),
	/**
	 * Dimension-line caption pinned to the photo, the same shop-drawing device
	 * the hero uses. Split headers only show it when set; the feature variant
	 * falls back to the eyebrow so a banner gets the annotation for free.
	 */
	mediaNote: z.string().optional(),
	/**
	 * Optional price spec row under the body on the split variant, anchoring the
	 * copy column against a tall photo. Passed from the collection entry's own
	 * `priceNote` rather than authored on the header, so a generated
	 * service/location opener fills its lower edge for free.
	 */
	priceNote: z.string().optional(),
});

export type PageHeader = z.infer<typeof pageHeaderSchema>;
