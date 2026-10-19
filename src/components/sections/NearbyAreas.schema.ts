import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

/**
 * Links a location page to the other towns covered.
 *
 * Generated location pages are otherwise orphans: reachable from the index and
 * nowhere else. Cross-linking gives crawlers a path between them and gives a
 * visitor in the wrong town somewhere to go.
 *
 * Which town it sits on is inferred from the URL, so one entry in the template
 * covers every generated page.
 */
export const nearbyAreasSchema = defineSection('nearby_areas', {
	eyebrow: z.string().optional(),
	heading: z.string().default('Also serving'),
	/** 0 shows every other town. */
	limit: z.number().int().min(0).max(24).default(8),
	columns: z.enum(['2', '3', '4']).default('4'),
});

export type NearbyAreas = z.infer<typeof nearbyAreasSchema>;
