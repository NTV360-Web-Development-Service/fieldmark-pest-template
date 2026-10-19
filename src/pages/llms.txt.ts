import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../lib/site';
import { entrySlug } from '../lib/collections';

/**
 * llms.txt: a plain-text map of the site for language models, which otherwise
 * have to infer structure from navigation markup.
 *
 * Generated from the same collections that build the pages, so it cannot fall
 * out of date the way a hand-written one would.
 */
export const GET: APIRoute = async ({ site: astroSite }) => {
	const base = astroSite ?? new URL('https://example.com');
	const url = (path: string) => new URL(path, base).href;

	const [services, locations, projects] = await Promise.all([
		getCollection('services', ({ data }) => !data.draft),
		getCollection('locations', ({ data }) => !data.draft),
		getCollection('projects', ({ data }) => !data.draft),
	]);

	const bySortOrder = (a: any, b: any) =>
		a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

	const lines: string[] = [
		`# ${site.name}`,
		'',
		`> ${site.tagline ?? ''}`.trim(),
		'',
		site.contact.address
			? `Based in ${site.contact.address.city}, ${site.contact.address.region}. Phone ${site.contact.phone}.`
			: `Phone ${site.contact.phone}.`,
		'',
		'## Pages',
		'',
		`- [Home](${url('/')}): what the business does and who it is for.`,
		`- [About](${url('/about')}): how the work is done and what is guaranteed.`,
		`- [Contact](${url('/contact')}): booking a consultation, hours, address.`,
		'',
		'## Services',
		'',
		...services
			.sort(bySortOrder)
			.map((s) => `- [${s.data.title}](${url(`/services/${entrySlug(s.id)}`)}): ${s.data.summary}`),
		'',
		'## Service areas',
		'',
		...locations
			.sort(bySortOrder)
			.map(
				(l) =>
					`- [${l.data.city}, ${l.data.region}](${url(`/locations/${l.id}`)}): ${l.data.summary}`
			),
		'',
		'## Projects',
		'',
		...projects
			.sort(bySortOrder)
			.map((p) => `- [${p.data.title}](${url(`/projects/${p.id}`)}): ${p.data.summary}`),
		'',
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
