import { Collection } from '../common/types';
import getDatabaseConnection from '../database';
import ScryfallCard from './ScryfallCard';

/**
 * Creates a detailed user-friendly name for cards to discern what they are, without imagery
 */
function cardDisplayName(card: ScryfallCard): string {
    const treatments: string[] = [];
    const baseTitle = card.name;
    const setName = card.set_name;

    const isPrereleasePromo =
        card.promo_types && card.promo_types.includes('prerelease');

    const isPromoPackPromo =
        card.promo_types && card.promo_types.includes('promopack');

    const isStampedPromo =
        card.promo_types && card.promo_types.includes('stamped');

    const isShowcase =
        card.frame_effects && card.frame_effects.includes('showcase');

    const isBorderless = card.border_color === 'borderless';

    const isEtched =
        card.frame_effects && card.frame_effects.includes('etched');

    const isExtendedArt =
        card.frame_effects && card.frame_effects.includes('extendedart');

    if (isPrereleasePromo) treatments.push('Prerelease promo');
    if (isPromoPackPromo) treatments.push('Promo pack');
    if (isStampedPromo) treatments.push('Stamped');
    if (isShowcase) treatments.push('Showcase');
    if (isBorderless) treatments.push('Borderless');
    if (isEtched) treatments.push('Etched');
    if (isExtendedArt) treatments.push('Extended art');

    const separator = treatments.length > 0 ? ' - ' : '';

    return `${baseTitle} - ${setName}${separator}${treatments.join(', ')}`;
}

class BulkCard {
    public scryfall_id: string;
    public name: string;
    public display_name: string;
    public set_abbreviation: string;
    public set_name: string;
    public rarity: string;
    public foil_printing: boolean;
    public nonfoil_printing: boolean;

    constructor(card: ScryfallCard) {
        this.scryfall_id = card.id;
        this.name = card.name;
        this.display_name = cardDisplayName(card);
        this.set_abbreviation = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.foil_printing = card.foil;
        this.nonfoil_printing = card.nonfoil;
    }
}

async function getCardPrintings(cardName: string) {
    try {
        const db = await getDatabaseConnection();

        const pipeline = [];

        // Match only english cards
        const match = {
            lang: 'en',
        };

        // Text match on card title
        const search = {
            index: 'autocomplete',
            autocomplete: {
                query: cardName,
                path: 'name',
                tokenOrder: 'sequential',
            },
        };

        pipeline.push({ $search: search });
        pipeline.push({ $match: match });

        const cards = await db
            .collection(Collection.scryfallBulkCards)
            .aggregate(pipeline)
            .toArray();

        return cards.map((c) => new BulkCard(c));
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardPrintings;
