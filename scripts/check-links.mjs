/**
 * Verifies every internal link resolves to a page that was actually built.
 *
 * Navigation lives in site.json and pages come from content files, so nothing
 * connects the two. A renamed route or a nav item typed by an editor produces
 * a 404 that no type system can see, and that nobody notices until a customer
 * clicks it.
 *
 * Run with `npm run check:links` (part of `npm run build`).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

/** Every path this build can actually serve. */
const served = new Set();
for (const file of files) {
	const rel = '/' + relative(dist, file).replace(/\\/g, '/');
	served.add(rel);
	if (rel.endsWith('/index.html')) {
		const dir = rel.slice(0, -'index.html'.length);
		served.add(dir);
		served.add(dir.replace(/\/$/, '') || '/');
	}
}

const broken = new Map();

for (const file of htmlFiles) {
	const from =
		'/' +
		relative(dist, file)
			.replace(/\\/g, '/')
			.replace(/index\.html$/, '');
	const html = readFileSync(file, 'utf8');

	for (const match of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
		const href = match[1];

		// External links, anchors and non-http schemes are somebody else's problem.
		if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
		// A relative href is resolved against the page rather than skipped. An
		// editor writing `example.com` instead of `https://example.com` produces
		// exactly this, and it silently becomes a link to a page on this site.
		const dir = from.endsWith('/') ? from : from.replace(/[^/]*$/, '');
		const resolved = href.startsWith('/') ? href : dir + href;

		const path = resolved.split('#')[0].split('?')[0];
		if (path === '') continue;

		const candidates = [
			path,
			path.endsWith('/') ? path.slice(0, -1) : path + '/',
			join(path, 'index.html').replace(/\\/g, '/'),
			path + '.html',
		];

		if (candidates.some((c) => served.has(c) || existsSync(join(dist, c)))) continue;

		if (!broken.has(path)) broken.set(path, new Set());
		broken.get(path).add(from);
	}
}

if (broken.size > 0) {
	console.error(`\nBroken internal links:\n`);
	for (const [path, sources] of [...broken].sort()) {
		const list = [...sources].sort();
		const shown = list.slice(0, 3).join(', ');
		const more = list.length > 3 ? ` and ${list.length - 3} more` : '';
		console.error(`  - ${path}  <-  ${shown}${more}`);
	}
	console.error('');
	process.exit(1);
}

console.log(`Link check OK - every internal link in ${htmlFiles.length} pages resolves.`);
