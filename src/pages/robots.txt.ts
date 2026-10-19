import type { APIRoute } from 'astro';

/**
 * Generated rather than static so the sitemap URL always matches the deployed
 * domain. A robots.txt pointing at the wrong host is worse than none.
 */
export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL('https://example.com');

	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		'# Internal reference, deliberately not indexed.',
		'Disallow: /theme',
		'',
		`Sitemap: ${new URL('sitemap-index.xml', base).href}`,
		'',
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
