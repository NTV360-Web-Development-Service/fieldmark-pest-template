import { z } from 'astro/zod';
import { defineSection, mediaSchema } from '../../lib/section-base';

/**
 * Reads the business details from site.json rather than repeating them, so a
 * changed phone number changes everywhere at once. Each line can be hidden
 * per placement, and extra lines added.
 */
export const contactDetailsSchema = defineSection('contact_details', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	showPhone: z.boolean().default(true),
	showEmail: z.boolean().default(true),
	showAddress: z.boolean().default(true),
	showHours: z.boolean().default(true),
	/** Anything the global settings do not cover, e.g. an emergency line. */
	extra: z
		.array(z.object({ label: z.string(), value: z.string(), href: z.string().optional() }))
		.default([]),
	/** Usually a map embed. */
	media: mediaSchema.nullish(),
});

export type ContactDetails = z.infer<typeof contactDetailsSchema>;
