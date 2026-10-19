import { z } from 'astro/zod';
import { defineSection, mediaSchema } from '../../lib/section-base';

/**
 * Reads the locations collection rather than repeating town names, so adding a
 * location file updates every placement of this section at once.
 */
export const serviceAreasSchema = defineSection('service_areas', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4']).default('3'),
	/** Also list the neighbourhoods each location covers. */
	showServed: z.boolean().default(true),
	/** Also list each location's postal codes. Off for a cleaner, less technical band. */
	showPostalCodes: z.boolean().default(true),
	/** Usually a map embed, shown beside the heading above the town list. */
	map: mediaSchema.nullish(),
	footnote: z.string().optional(),
});

export type ServiceAreas = z.infer<typeof serviceAreasSchema>;
