/**
 * Token substitution for template pages.
 *
 * One section array plus a data row per town is what turns ten location pages
 * into a thousand. The editor writes `{{city}}` once in the template and every
 * generated page carries its own value.
 */

const TOKEN = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

export class UnknownTokenError extends Error {}

function lookup(vars: Record<string, unknown>, path: string): string | undefined {
	const value = path
		.split('.')
		.reduce<unknown>(
			(acc, key) => (acc && typeof acc === 'object' ? (acc as any)[key] : undefined),
			vars
		);

	if (value === undefined || value === null) return undefined;
	return Array.isArray(value) ? value.join(', ') : String(value);
}

/**
 * Walks a value and replaces every `{{token}}` in every string.
 *
 * An unknown token throws rather than rendering literally. A page that ships
 * `{{phone}}` to a customer is worse than a build that stops, and the failure
 * names both the token and the row so it can be fixed without hunting.
 */
export function interpolate<T>(value: T, vars: Record<string, unknown>, context: string): T {
	if (typeof value === 'string') {
		return value.replace(TOKEN, (match, path: string) => {
			const replacement = lookup(vars, path);
			if (replacement === undefined) {
				throw new UnknownTokenError(
					`Unknown token ${match} while building ${context}. ` +
						`Available: ${Object.keys(vars).sort().join(', ')}`
				);
			}
			return replacement;
		}) as T;
	}

	if (Array.isArray(value)) {
		return value.map((item) => interpolate(item, vars, context)) as T;
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, val]) => [
				key,
				interpolate(val, vars, context),
			])
		) as T;
	}

	return value;
}
