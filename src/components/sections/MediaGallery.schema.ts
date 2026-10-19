import { z } from 'astro/zod';
import { defineSection, mediaSchema } from '../../lib/section-base';

export const mediaGallerySchema = defineSection('media_gallery', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	columns: z.enum(['2', '3', '4']).default('3'),
	/** `masonry` lets tall and wide shots keep their own proportions. */
	layout: z.enum(['grid', 'masonry']).default('grid'),
	items: z
		.array(
			z.object({
				media: mediaSchema,
				caption: z.string().optional(),
				/** Free text, used to build the filter bar. Leave empty for no filter. */
				category: z.string().optional(),
			})
		)
		.default([]),
});

export type MediaGallery = z.infer<typeof mediaGallerySchema>;
