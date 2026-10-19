import { site } from './site';

/**
 * Structured data builders.
 *
 * Everything is derived from content that already exists, never typed twice.
 * A schema field an editor has to maintain separately from the visible page
 * is a schema field that will drift and start lying to search engines.
 */

type Json = Record<string, unknown>;

function absolute(path: string | undefined, base: URL): string | undefined {
	if (!path) return undefined;
	try {
		return new URL(path, base).href;
	} catch {
		return undefined;
	}
}

/**
 * The business itself. Emitted once, on the home page, with an @id other
 * schema can point at instead of repeating the whole organisation.
 */
export function organisationSchema(base: URL): Json {
	const address = site.contact.address;

	return {
		'@context': 'https://schema.org',
		// e.g. HVACBusiness, RoofingContractor, Plumber, HomeAndConstructionBusiness.
		'@type': site.businessType,
		'@id': new URL('#business', base).href,
		name: site.name,
		legalName: site.legalName,
		description: site.tagline,
		url: base.href,
		telephone: site.contact.phone,
		email: site.contact.email,
		...(address
			? {
					address: {
						'@type': 'PostalAddress',
						streetAddress: address.street,
						addressLocality: address.city,
						addressRegion: address.region,
						postalCode: address.postalCode,
						addressCountry: address.country,
					},
				}
			: {}),
		...(site.contact.hours ? { openingHours: site.contact.hours } : {}),
		...(site.social.length > 0 ? { sameAs: site.social.map((s) => s.href) } : {}),
		...(site.rating
			? {
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: site.rating.value,
						reviewCount: site.rating.count,
					},
				}
			: {}),
	};
}

/** A service page. Linked back to the business rather than restating it. */
export function serviceSchema(
	data: { title: string; summary: string; image?: { src: string } },
	url: URL,
	base: URL
): Json {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: data.title,
		description: data.summary,
		url: url.href,
		...(data.image ? { image: absolute(data.image.src, base) } : {}),
		provider: { '@id': new URL('#business', base).href },
		areaServed: site.contact.address?.region,
	};
}

/**
 * A location page. Modelled as a branch of the business, so the town is the
 * thing being described rather than a keyword in a title.
 */
export function locationSchema(
	data: { city: string; region: string; postalCodes: string[]; serves: string[]; summary: string },
	url: URL,
	base: URL
): Json {
	return {
		'@context': 'https://schema.org',
		'@type': site.businessType,
		name: `${site.name} - ${data.city}`,
		description: data.summary,
		url: url.href,
		telephone: site.contact.phone,
		parentOrganization: { '@id': new URL('#business', base).href },
		address: {
			'@type': 'PostalAddress',
			addressLocality: data.city,
			addressRegion: data.region,
			addressCountry: site.contact.address?.country ?? 'US',
		},
		areaServed: [data.city, ...data.serves].map((name) => ({ '@type': 'Place', name })),
	};
}

/**
 * Built from whatever accordion sections a page actually contains, so the
 * marked-up questions are always the questions on screen.
 */
export function faqSchema(
	sections: { type: string; items?: { question: string; answer: string }[] }[]
): Json | null {
	const items = sections
		.filter((section) => section.type === 'accordion' && Array.isArray(section.items))
		.flatMap((section) => section.items ?? []);

	if (items.length === 0) return null;

	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				// Markdown emphasis would be read literally, so it is stripped.
				text: item.answer.replace(/[*_`]/g, ''),
			},
		})),
	};
}
