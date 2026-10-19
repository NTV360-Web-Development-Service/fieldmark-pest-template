import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/**
 * Pulls entries from a collection instead of hand-typed cards.
 *
 * This is what stops an index page needing maintenance: add a service file and
 * it appears on the services page, in the footer feed, and anywhere else this
 * section points at that collection.
 */
export const collectionFeedSchema = defineSection('collection_feed', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	source: z.enum(['services', 'projects', 'locations']),
	layout: z.enum(['grid', 'list']).default('grid'),
	columns: z.enum(['2', '3', '4', '5']).default('3'),
	/** 0 means every entry. */
	limit: z.number().int().min(0).max(60).default(0),
	/**
	 * Services only: show just the top-level categories, hiding sub-services that
	 * carry a `parent`. Keeps the services index to the main rooms rather than
	 * flattening every child page into one long grid.
	 */
	topLevelOnly: z.boolean().default(false),
	showImage: z.boolean().default(true),
	showSummary: z.boolean().default(true),
	/** Services carry a priceNote; set false to hide it in a placement that is not about price. */
	showPrice: z.boolean().default(true),
	/** Optional link to the full index, for a teaser placement. */
	moreLabel: z.string().optional(),
	moreHref: z.string().optional(),
	/** How the more-link renders. Ghost is the quiet teaser default. */
	moreStyle: z.enum(['primary', 'secondary', 'ghost']).default('ghost'),
});

export type CollectionFeed = z.infer<typeof collectionFeedSchema>;
