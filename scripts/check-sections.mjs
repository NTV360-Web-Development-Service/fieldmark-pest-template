/**
 * Verifies the three-way section contract.
 *
 * A section type has to exist in three places, all keyed by the same string:
 *   1. src/lib/section-schemas.ts  (validation)
 *   2. src/lib/sections.ts         (rendering)
 *   3. .pages.yml                  (editing)
 *
 * TypeScript already couples 1 and 2. Nothing couples .pages.yml, so a block
 * can be added to the CMS that renders nothing, or a section can be built that
 * no editor can insert. Both fail silently. This catches them.
 *
 * Run with `npm run check:sections`.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { load as parseYaml } from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const read = (p) => readFileSync(join(root, p), 'utf8');

// Parsed rather than imported: these are TypeScript modules, and importing
// sections.ts would pull in .astro files that cannot run outside Astro.
const registryKeys = [...read('src/lib/sections.ts').matchAll(/^\t(\w+):\s/gm)].map((m) => m[1]);

const schemaNames = [...read('src/lib/section-schemas.ts').matchAll(/^\t(\w+Schema),$/gm)].map(
	(m) => m[1]
);

const config = parseYaml(read('.pages.yml'));
const pages = config.content.find((c) => c.name === 'pages');
const sectionsRef = pages.fields.find((f) => f.name === 'sections');

// The sections block is defined once as the `page_sections` component and
// referenced from every collection that renders page sections, so resolve the
// reference to reach the actual block definition.
const sectionsField = sectionsRef.component
	? config.components[sectionsRef.component]
	: sectionsRef;

if (!sectionsField?.blocks) {
	console.error(
		`\nSection contract broken:\n\n  - The "sections" field in the pages collection has no blocks. ` +
			`Expected an inline block or a "component:" reference resolving to one.\n`
	);
	process.exit(1);
}

const cmsBlocks = sectionsField.blocks.map((b) => b.name);

const problems = [];

if (sectionsField.blockKey !== 'type') {
	problems.push(
		`.pages.yml blockKey is "${sectionsField.blockKey}", but the Zod union discriminates on "type".`
	);
}

for (const name of registryKeys) {
	if (!cmsBlocks.includes(name)) {
		problems.push(`"${name}" renders but has no block in .pages.yml, so no editor can add it.`);
	}
}

for (const name of cmsBlocks) {
	if (!registryKeys.includes(name)) {
		problems.push(
			`"${name}" is offered in .pages.yml but has no component, so it renders nothing.`
		);
	}
}

if (schemaNames.length !== registryKeys.length) {
	problems.push(
		`${schemaNames.length} schemas in the union but ${registryKeys.length} components registered.`
	);
}

if (problems.length > 0) {
	console.error(`\nSection contract broken:\n`);
	for (const p of problems) console.error(`  - ${p}`);
	console.error('');
	process.exit(1);
}

console.log(`Section contract OK - ${registryKeys.length} sections: ${registryKeys.join(', ')}`);
