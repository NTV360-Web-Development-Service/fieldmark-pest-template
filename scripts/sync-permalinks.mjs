/**
 * Writes each page's live URL into its JSON as a read-only `permalink`.
 *
 * The CMS shows `permalink` as a read-only "Live Page URL" field so an editor
 * can see and open where a page publishes. It never drives routing -- the real
 * route is still `slug` or the file path (see src/pages/[...slug].astro). This
 * keeps the field honest: it is recomputed here, so renaming a file or setting
 * a Custom URL updates it rather than leaving a stale address behind.
 *
 * The derivation mirrors the route exactly:
 *   slug set        -> <site>/<slug>
 *   _home.json      -> <site>/
 *   anything else   -> <site>/<file path without .json>
 *
 * Run with `npm run sync:permalinks` (part of `npm run build`). The permalink
 * is inserted or replaced as a single line, leaving the rest of the file byte
 * for byte untouched, so the diff is only ever the permalink itself.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'src', 'content', 'pages');

// Read the deploy URL straight from astro.config so the two never disagree.
const configSrc = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
const siteMatch = configSrc.match(/site:\s*['"]([^'"]+)['"]/);
if (!siteMatch) {
	console.error('sync:permalinks -- could not find `site:` in astro.config.mjs.');
	process.exit(1);
}
const base = siteMatch[1].replace(/\/$/, '');

function jsonFiles(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...jsonFiles(full));
		else if (entry.endsWith('.json')) out.push(full);
	}
	return out;
}

let changed = 0;
const files = jsonFiles(pagesDir);

for (const file of files) {
	const raw = readFileSync(file, 'utf8');
	const data = JSON.parse(raw);

	// Page id = path under pages/ without the .json, forward-slashed.
	const id = relative(pagesDir, file)
		.replace(/\\/g, '/')
		.replace(/\.json$/, '');
	const path = data.slug ?? (id === '_home' ? '' : id);
	const permalink = `${base}/${path}`;

	if (data.permalink === permalink) continue;

	// Match the file's own indentation so the inserted line sits flush.
	const indent = raw.match(/\n([ \t]+)"/)?.[1] ?? '  ';
	const line = `${indent}"permalink": ${JSON.stringify(permalink)}`;

	let next;
	if (data.permalink !== undefined) {
		// Replace the existing permalink value in place.
		next = raw.replace(/^[ \t]*"permalink":\s*"[^"]*",?/m, `${line},`);
	} else {
		// Insert straight after the opening "title" line, matching CMS field order.
		next = raw.replace(/^([ \t]*"title":\s*.*?,)\s*$/m, `$1\n${line},`);
		if (next === raw) {
			// No title line to anchor to: insert right after the opening brace.
			next = raw.replace(/^(\s*\{\s*\n)/, `$1${line},\n`);
		}
	}

	writeFileSync(file, next);
	changed++;
}

console.log(
	changed === 0
		? `Permalinks already in sync - ${files.length} pages.`
		: `Permalinks synced - updated ${changed} of ${files.length} pages.`
);
