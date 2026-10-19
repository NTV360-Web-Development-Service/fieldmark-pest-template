import { z } from 'astro/zod';
import { linkSchema } from './site';
import popupData from '../content/popup.json';

/**
 * The site-wide promotional popup, edited as its own CMS singleton
 * (`src/content/popup.json`). Kept separate from Site Settings so an editor
 * finds it as a distinct, focused entry rather than buried in the larger site
 * config.
 */
const popupSchema = z.object({
	enabled: z.boolean().default(false),
	trigger: z.enum(['delay', 'scroll', 'exit']).default('delay'),
	delaySeconds: z.number().min(0).max(120).default(8),
	scrollPercent: z.number().min(1).max(100).default(50),
	/** `session` shows again next visit; `once` remembers for good. */
	frequency: z.enum(['session', 'once']).default('session'),
	eyebrow: z.string().optional(),
	heading: z.string(),
	body: z.string().optional(),
	/** Optional side image. When set, the dialog becomes a two-panel card. */
	image: z.object({ src: z.string(), alt: z.string().default('') }).optional(),
	cta: linkSchema.optional(),
	dismissLabel: z.string().default('No thanks'),
});

/** Parsed once at build time; an invalid file fails the build here. */
export const popup = popupSchema.parse(popupData);

export type Popup = typeof popup;
