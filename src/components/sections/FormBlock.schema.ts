import { z } from 'astro/zod';
import { defineSection } from '../../lib/section-base';

const widthOpt = z.enum(['full', 'half']).default('full');

/**
 * Form fields as a block union.
 *
 * A single field type with a "kind" select would have to show `rows`,
 * `options` and `value` on every field regardless of relevance. As blocks,
 * choosing Email shows only what an email field needs.
 */
export const formFieldSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('text'),
		name: z.string().min(1),
		label: z.string().min(1),
		placeholder: z.string().optional(),
		required: z.boolean().default(false),
		width: widthOpt,
		/** Maps to the autocomplete attribute, e.g. given-name, postal-code. */
		autocomplete: z.string().optional(),
	}),
	z.object({
		kind: z.literal('email'),
		name: z.string().min(1).default('email'),
		label: z.string().min(1),
		placeholder: z.string().optional(),
		required: z.boolean().default(true),
		width: widthOpt,
	}),
	z.object({
		kind: z.literal('tel'),
		name: z.string().min(1).default('phone'),
		label: z.string().min(1),
		placeholder: z.string().optional(),
		required: z.boolean().default(false),
		width: widthOpt,
	}),
	z.object({
		kind: z.literal('textarea'),
		name: z.string().min(1),
		label: z.string().min(1),
		placeholder: z.string().optional(),
		required: z.boolean().default(false),
		rows: z.number().int().min(2).max(20).default(5),
	}),
	z.object({
		kind: z.literal('select'),
		name: z.string().min(1),
		label: z.string().min(1),
		required: z.boolean().default(false),
		width: widthOpt,
		choices: z.array(z.string()).min(1),
	}),
	z.object({
		kind: z.literal('checkbox'),
		name: z.string().min(1),
		/** rich-text so consent wording can carry a link to the policy. */
		label: z.string().min(1),
		required: z.boolean().default(false),
	}),
	z.object({
		kind: z.literal('hidden'),
		name: z.string().min(1),
		value: z.string(),
	}),
]);

export type FormField = z.infer<typeof formFieldSchema>;

export const formBlockSchema = defineSection('form_block', {
	eyebrow: z.string().optional(),
	heading: z.string().optional(),
	intro: z.string().optional(),
	/**
	 * Where the form posts. Deliberately not a baked-in provider: each client
	 * site points at its own Formspree, Web3Forms or serverless endpoint.
	 */
	endpoint: z.string().min(1),
	submitLabel: z.string().default('Send'),
	/** Shown by the provider or the redirect target, not rendered here. */
	successNote: z.string().optional(),
	fields: z.array(formFieldSchema).default([]),
	footnote: z.string().optional(),
});

export type FormBlock = z.infer<typeof formBlockSchema>;
