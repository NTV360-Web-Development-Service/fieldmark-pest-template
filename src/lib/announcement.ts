import { z } from 'astro/zod';
import announcementData from '../content/announcement.json';

/**
 * The site-wide announcement bar, edited as its own CMS singleton
 * (`src/content/announcement.json`). Kept separate from Site Settings so an
 * editor finds it as a distinct, focused entry rather than buried in the
 * larger site config.
 */
const announcementSchema = z.object({
	enabled: z.boolean().default(false),
	text: z.string(),
	link: z.object({ label: z.string(), href: z.string() }).optional(),
	dismissible: z.boolean().default(true),
});

/** Parsed once at build time; an invalid file fails the build here. */
export const announcement = announcementSchema.parse(announcementData);

export type Announcement = typeof announcement;
