import Hero from '../components/sections/Hero.astro';
import RichText from '../components/sections/RichText.astro';
import CardGrid from '../components/sections/CardGrid.astro';
import MediaSplit from '../components/sections/MediaSplit.astro';
import Steps from '../components/sections/Steps.astro';
import Quotes from '../components/sections/Quotes.astro';
import Accordion from '../components/sections/Accordion.astro';
import CtaBanner from '../components/sections/CtaBanner.astro';
import PageHeader from '../components/sections/PageHeader.astro';
import FeatureList from '../components/sections/FeatureList.astro';
import StatBand from '../components/sections/StatBand.astro';
import LogoRow from '../components/sections/LogoRow.astro';
import LegalText from '../components/sections/LegalText.astro';
import FormBlock from '../components/sections/FormBlock.astro';
import ContactDetails from '../components/sections/ContactDetails.astro';
import MediaGallery from '../components/sections/MediaGallery.astro';
import MediaCompare from '../components/sections/MediaCompare.astro';
import CollectionFeed from '../components/sections/CollectionFeed.astro';
import ServiceAreas from '../components/sections/ServiceAreas.astro';
import SearchBlock from '../components/sections/SearchBlock.astro';
import Placeholder from '../components/sections/Placeholder.astro';
import Offers from '../components/sections/Offers.astro';
import ContentBlocks from '../components/sections/ContentBlocks.astro';
import NearbyAreas from '../components/sections/NearbyAreas.astro';
import BadgeStrip from '../components/sections/BadgeStrip.astro';
import ServiceMenu from '../components/sections/ServiceMenu.astro';
import PromoCards from '../components/sections/PromoCards.astro';
import PricingTiers from '../components/sections/PricingTiers.astro';
import Team from '../components/sections/Team.astro';
import GlobalBlock from '../components/sections/GlobalBlock.astro';
import type { SectionType } from './section-schemas';

/**
 * The rendering half of the section contract: `type` string -> component.
 *
 * Typed as `Record<SectionType, ...>` so TypeScript fails the build if a schema
 * is added to the union without a matching component here. That catches two of
 * the three drift cases at compile time; the third (`.pages.yml`) is only
 * caught by the CMS round-trip check.
 */
/**
 * An Astro component as seen from outside a .astro file.
 *
 * Deliberately loose. JSX needs an element type it can construct, so `unknown`
 * does not work; and each component declares narrower props than the registry
 * can know about, so a typed parameter fails on contravariance. The real
 * guarantee that a section matches its schema comes from the Zod union and
 * `npm run check:sections`, not from this signature.
 */
type SectionComponent = (...args: any[]) => any;

export const sections: Record<SectionType, SectionComponent> = {
	hero: Hero,
	rich_text: RichText,
	card_grid: CardGrid,
	media_split: MediaSplit,
	steps: Steps,
	quotes: Quotes,
	accordion: Accordion,
	cta_banner: CtaBanner,
	page_header: PageHeader,
	feature_list: FeatureList,
	stat_band: StatBand,
	logo_row: LogoRow,
	legal_text: LegalText,
	form_block: FormBlock,
	contact_details: ContactDetails,
	media_gallery: MediaGallery,
	media_compare: MediaCompare,
	collection_feed: CollectionFeed,
	service_areas: ServiceAreas,
	search_block: SearchBlock,
	placeholder: Placeholder,
	offers: Offers,
	content_blocks: ContentBlocks,
	nearby_areas: NearbyAreas,
	badge_strip: BadgeStrip,
	service_menu: ServiceMenu,
	promo_cards: PromoCards,
	pricing_tiers: PricingTiers,
	team: Team,
	global_block: GlobalBlock,
};

export function getSection(type: string): SectionComponent | undefined {
	return (sections as Record<string, SectionComponent | undefined>)[type];
}
