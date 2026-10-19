import { z } from 'astro/zod';
import { defineSection, linkSchema } from '../../lib/section-base';

export const ctaBannerSchema = defineSection('cta_banner', {
	eyebrow: z.string().optional(),
	heading: z.string(),
	body: z.string().optional(),
	ctas: z.array(linkSchema).default([]),
});

export type CtaBanner = z.infer<typeof ctaBannerSchema>;
