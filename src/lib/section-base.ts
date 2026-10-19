import { z } from 'astro/zod';

/**
 * Presentation controls every section shares. Kept deliberately small: these are
 * the knobs an editor can turn without being able to break the page. Anything
 * section-specific belongs in that section's own schema.
 *
 * Mirrored in `.pages.yml` as the `section_base` component.
 */
export const sectionBase = {
	/**
	 * Semantic level only. Visual size is a separate decision made by each
	 * section, so a page can keep a correct h1 -> h2 -> h3 outline without
	 * every heading having to look the same size as its rank.
	 *
	 * One h1 per page. A page that opens with `page_header` already has it.
	 *
	 * Deliberately optional rather than defaulted: a Zod default would always
	 * populate the prop, making each component's own default unreachable, and
	 * sections that open a page need h1 while the rest need h2.
	 */
	headingLevel: z.enum(['h1', 'h2', 'h3', 'h4']).optional(),
	/** Anchor target, so a CTA elsewhere can link to `#free-estimate`. */
	anchor: z.string().optional(),
	surface: z.enum(['light', 'muted', 'dark', 'brand']).default('light'),
	spacing: z.enum(['none', 'sm', 'md', 'lg']).default('md'),
	width: z.enum(['narrow', 'default', 'wide', 'full']).default('default'),
};

export type Surface = 'light' | 'muted' | 'dark' | 'brand';
export type Spacing = 'none' | 'sm' | 'md' | 'lg';
export type Width = 'narrow' | 'default' | 'wide' | 'full';

/** Shared shapes reused across section schemas. */
/**
 * Both CMS variants -- upload and link -- write the same flat shape, so this
 * stays a plain object rather than a discriminated union. `source` records
 * which input the editor used; rendering does not care. It is optional so
 * content written before the choice existed still validates.
 */
export const imageSchema = z.object({
	source: z.enum(['upload', 'url']).optional(),
	src: z.string().min(1),
	alt: z.string().default(''),
});

/**
 * Anything that can fill a media slot.
 *
 * A discriminated union rather than an image plus optional video plus optional
 * embed, so there is no state where two are filled and the section has to guess.
 * Mirrors the `media` block in `.pages.yml`.
 */
export const mediaSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('image'),
		source: z.enum(['upload', 'url']).optional(),
		src: z.string().min(1),
		alt: z.string().default(''),
	}),
	z.object({
		kind: z.literal('video'),
		source: z.enum(['upload', 'url']).optional(),
		src: z.string().min(1),
		poster: z.string().optional(),
		/** Off by default: an autoplaying video is a decision, not a default. */
		autoplay: z.boolean().default(false),
	}),
	z.object({
		kind: z.literal('embed'),
		/** YouTube and Vimeo watch URLs are converted to embed URLs on render. */
		url: z.string().min(1),
		/** Required: an unlabelled iframe is unusable with a screen reader. */
		title: z.string().min(1),
		ratio: z.enum(['16/9', '4/3', '1/1', '21/9']).default('16/9'),
	}),
]);

export type Media = z.infer<typeof mediaSchema>;

export const linkSchema = z.object({
	label: z.string(),
	href: z.string(),
	style: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
	newTab: z.boolean().default(false),
});

/**
 * Builds a section schema with a literal `type` discriminator plus the shared
 * base. The literal is what makes `z.discriminatedUnion` work and must match
 * both the registry key in `src/lib/sections.ts` and the block name in
 * `.pages.yml`. Those three strings are the contract.
 */
export function defineSection<T extends string, F extends z.ZodRawShape>(type: T, fields: F) {
	return z.object({
		type: z.literal(type),
		...sectionBase,
		...fields,
	});
}

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

/**
 * The rank one step below a section heading, for the titles inside it.
 *
 * A section set to h2 gives its cards h3. Without this each section would
 * hardcode h3 and a section placed at h3 would produce h3 inside h3, which
 * flattens the outline screen readers navigate by.
 */
export function subLevel(level: HeadingLevel = 'h2'): HeadingLevel {
	const order: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4'];
	const i = order.indexOf(level);
	return order[Math.min(i + 1, order.length - 1)];
}

/**
 * The rank for titles inside a section, given whether the section itself
 * rendered a heading.
 *
 * A section with no heading of its own contributes no level, so its children
 * must sit at the section level rather than below it. Dropping a rank anyway
 * leaves a hole in the outline: h1 followed by h3.
 */
export function childLevel(level: HeadingLevel = 'h2', hasHeading: boolean = true): HeadingLevel {
	return hasHeading ? subLevel(level) : level;
}

/** `h3` -> 3, for handing a heading rank to something that counts. */
export function levelNumber(level: HeadingLevel = 'h2'): number {
	return Number(level.slice(1));
}
