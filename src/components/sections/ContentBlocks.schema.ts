import { z } from 'astro/zod';
import { defineSection, mediaSchema, linkSchema } from '../../lib/section-base';

/**
 * A freeform section: an ordered list of small blocks laid out in a grid.
 *
 * The named sections exist because a repeated pattern should be restyleable
 * everywhere at once, and because code that knows it is rendering an FAQ can
 * emit FAQPage schema. This is the escape hatch for the arrangements that do
 * not repeat, so a one-off page does not need a developer.
 *
 * Reach for a named section when the shape recurs. Reach for this when it does
 * not.
 */
export const contentBlockSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('text'),
		body: z.string(),
		align: z.enum(['left', 'center']).default('left'),
		/** Spans every column rather than sitting in one. */
		full: z.boolean().default(false),
	}),
	z.object({
		kind: z.literal('media'),
		media: mediaSchema,
		caption: z.string().optional(),
		/** `auto` keeps the file's own proportions. */
		ratio: z.enum(['auto', '16/9', '4/3', '1/1']).default('4/3'),
		full: z.boolean().default(false),
	}),
	z.object({
		kind: z.literal('buttons'),
		items: z.array(linkSchema).min(1),
		align: z.enum(['left', 'center']).default('left'),
		full: z.boolean().default(true),
	}),
	z.object({
		kind: z.literal('divider'),
		/** A dimension line when labelled, a plain rule when not. */
		label: z.string().optional(),
	}),
	z.object({
		kind: z.literal('spacer'),
		size: z.enum(['sm', 'md', 'lg']).default('md'),
	}),
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const contentBlocksSchema = defineSection('content_blocks', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	/** Blocks fill these columns in order. Two columns gives image beside text. */
	columns: z.enum(['1', '2', '3']).default('2'),
	/** How columns line up when blocks differ in height. */
	align: z.enum(['start', 'center']).default('start'),
	blocks: z.array(contentBlockSchema).default([]),
});

export type ContentBlocks = z.infer<typeof contentBlocksSchema>;
