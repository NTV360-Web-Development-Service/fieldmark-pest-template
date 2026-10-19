/**
 * Post-build audit of the rendered HTML.
 *
 * The section contract check proves the plumbing is wired. This checks the
 * output an editor actually produced: heading ranks are assembled from CMS
 * choices, so a page can be perfectly valid at the code level and still ship a
 * broken outline.
 *
 * Run with `npm run check:pages` (part of `npm run build`).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function htmlFiles(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
		else if (entry.endsWith('.html')) out.push(full);
	}
	return out;
}

const problems = [];
const warnings = [];

for (const file of htmlFiles(dist)) {
	const url =
		'/' +
		relative(dist, file)
			.replace(/\\/g, '/')
			.replace(/index\.html$/, '');
	const html = readFileSync(file, 'utf8');

	// Only the page body matters; header and footer chrome is shared and fixed.
	const main = html.split('<main')[1]?.split('</main>')[0] ?? '';

	const headings = [...main.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => ({
		level: Number(m[1][1]),
		text: m[2].replace(/<[^>]+>/g, '').trim(),
	}));

	const h1s = headings.filter((h) => h.level === 1);
	if (h1s.length === 0) problems.push(`${url} has no h1.`);
	if (h1s.length > 1) {
		problems.push(
			`${url} has ${h1s.length} h1 headings: ${h1s.map((h) => `"${h.text}"`).join(', ')}`
		);
	}

	// A jump from h2 straight to h4 leaves a hole in the outline.
	headings.forEach((h, i) => {
		if (i === 0) return;
		const prev = headings[i - 1].level;
		if (h.level > prev + 1) {
			problems.push(
				`${url} jumps ${headings[i - 1].level ? `h${prev}` : ''} -> h${h.level} at "${h.text}".`
			);
		}
	});

	const emptyHeading = headings.find((h) => h.text === '');
	if (emptyHeading) problems.push(`${url} has an empty h${emptyHeading.level}.`);

	// Missing alt is a warning: a decorative image legitimately has alt="".
	const imgs = [...main.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
	const noAlt = imgs.filter((tag) => !/\balt=/.test(tag));
	if (noAlt.length > 0)
		warnings.push(`${url} has ${noAlt.length} img tag(s) with no alt attribute.`);

	// Placeholders are legitimate while a site is being built, so this warns
	// rather than failing. The point is that none ship unnoticed.
	const placeholders = [...main.matchAll(/data-placeholder/g)].length;
	if (placeholders > 0) {
		warnings.push(`${url} has ${placeholders} unfinished placeholder section(s).`);
	}

	const iframes = [...main.matchAll(/<iframe\b[^>]*>/g)].map((m) => m[0]);
	const noTitle = iframes.filter((tag) => !/\btitle=/.test(tag));
	if (noTitle.length > 0) problems.push(`${url} has ${noTitle.length} iframe(s) with no title.`);
}

for (const w of warnings) console.warn(`  warning: ${w}`);

if (problems.length > 0) {
	console.error(`\nPage audit failed:\n`);
	for (const p of problems) console.error(`  - ${p}`);
	console.error('');
	process.exit(1);
}

console.log(`Page audit OK - ${htmlFiles(dist).length} pages, one h1 each, no skipped levels.`);
