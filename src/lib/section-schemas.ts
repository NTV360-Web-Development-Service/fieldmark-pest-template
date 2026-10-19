import { z } from 'astro/zod';
import { heroSchema } from '../components/sections/Hero.schema';
import { richTextSchema } from '../components/sections/RichText.schema';
import { cardGridSchema } from '../components/sections/CardGrid.schema';
import { mediaSplitSchema } from '../components/sections/MediaSplit.schema';
import { stepsSchema } from '../components/sections/Steps.schema';
import { quotesSchema } from '../components/sections/Quotes.schema';
import { accordionSchema } from '../components/sections/Accordion.schema';
import { ctaBannerSchema } from '../components/sections/CtaBanner.schema';
import { pageHeaderSchema } from '../components/sections/PageHeader.schema';
import { featureListSchema } from '../components/sections/FeatureList.schema';
import { statBandSchema } from '../components/sections/StatBand.schema';
import { logoRowSchema } from '../components/sections/LogoRow.schema';
import { legalTextSchema } from '../components/sections/LegalText.schema';
import { formBlockSchema } from '../components/sections/FormBlock.schema';
import { contactDetailsSchema } from '../components/sections/ContactDetails.schema';
import { mediaGallerySchema } from '../components/sections/MediaGallery.schema';
import { mediaCompareSchema } from '../components/sections/MediaCompare.schema';
import { collectionFeedSchema } from '../components/sections/CollectionFeed.schema';
import { serviceAreasSchema } from '../components/sections/ServiceAreas.schema';
import { searchBlockSchema } from '../components/sections/SearchBlock.schema';
import { placeholderSchema } from '../components/sections/Placeholder.schema';
import { offersSchema } from '../components/sections/Offers.schema';
import { contentBlocksSchema } from '../components/sections/ContentBlocks.schema';
import { nearbyAreasSchema } from '../components/sections/NearbyAreas.schema';
import { badgeStripSchema } from '../components/sections/BadgeStrip.schema';
import { serviceMenuSchema } from '../components/sections/ServiceMenu.schema';
import { promoCardsSchema } from '../components/sections/PromoCards.schema';
import { pricingTiersSchema } from '../components/sections/PricingTiers.schema';
import { teamSchema } from '../components/sections/Team.schema';
import { globalBlockSchema } from '../components/sections/GlobalBlock.schema';

/**
 * The validation half of the section contract.
 *
 * Kept free of `.astro` imports on purpose: `content.config.ts` is evaluated in
 * a plain Node context where component imports would fail. Components live in
 * the parallel registry at `src/lib/sections.ts`.
 *
 * Adding a section means adding it in three places, all keyed by the same string:
 *   1. here (validation)
 *   2. `src/lib/sections.ts` (rendering)
 *   3. `.pages.yml` (editing)
 */
export const sectionSchemas = [
	heroSchema,
	richTextSchema,
	cardGridSchema,
	mediaSplitSchema,
	stepsSchema,
	quotesSchema,
	accordionSchema,
	ctaBannerSchema,
	pageHeaderSchema,
	featureListSchema,
	statBandSchema,
	logoRowSchema,
	legalTextSchema,
	formBlockSchema,
	contactDetailsSchema,
	mediaGallerySchema,
	mediaCompareSchema,
	collectionFeedSchema,
	serviceAreasSchema,
	searchBlockSchema,
	placeholderSchema,
	offersSchema,
	contentBlocksSchema,
	nearbyAreasSchema,
	badgeStripSchema,
	serviceMenuSchema,
	promoCardsSchema,
	pricingTiersSchema,
	teamSchema,
	globalBlockSchema,
] as const;

/**
 * Drops null-valued keys before validation.
 *
 * `.optional()` accepts a missing key but rejects an explicit null, and an
 * editor clearing a field in the CMS can write null rather than removing the
 * key. Without this, emptying an optional field in Pages CMS breaks the build
 * with a type error the editor cannot act on.
 */
function stripNulls(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(stripNulls);
	if (value === null || typeof value !== 'object') return value;

	return Object.fromEntries(
		Object.entries(value as Record<string, unknown>)
			.filter(([, v]) => v !== null)
			.map(([k, v]) => [k, stripNulls(v)])
	);
}

export const sectionSchema = z.preprocess(
	stripNulls,
	z.discriminatedUnion('type', [...sectionSchemas])
);

export type SectionData = z.infer<typeof sectionSchema>;
export type SectionType = SectionData['type'];
