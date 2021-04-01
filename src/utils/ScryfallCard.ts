export interface QOH {
    FOIL_NM: number;
    FOIL_LP: number;
    FOIL_MP: number;
    FOIL_HP: number;
    NONFOIL_NM: number;
    NONFOIL_LP: number;
    NONFOIL_MP: number;
    NONFOIL_HP: number;
}

export interface ImageURIs {
    normal: string;
}

export interface CardFace {
    colors: string[];
    type_line: string;
    color_identity: string[];
    image_uris: ImageURIs;
}

export interface ScryfallApiCard {
    id: string;
    name: string;
    printed_name: string;
    set: string;
    set_name: string;
    rarity: string;
    image_uris: ImageURIs;
    card_faces: CardFace[];
    nonfoil: boolean;
    foil: boolean;
    colors: string[];
    type_line: string;
    frame_effects: string[];
    lang: string;
    border_color: string;
    display_name: string;
    cardImage: string;
    color_identity: string[];
    qoh?: Partial<QOH>;
    quantity?: number;
    qtyToSell?: number;
    finishCondition?: string;
    price?: number;
}

/**
 * This class wraps the Scryfall API request data and models it to something we can control.
 * Also acts as a safeguard for any future updates to Scryfall's API data model and makes
 * the code easier to maintain and debug.
 */
export class ScryfallCard {
    public id: string;
    public name: string;
    public printed_name: string | null;
    public set: string;
    public set_name: string;
    public rarity: string;
    public image_uris: { normal: string };
    public card_faces: CardFace[];
    public nonfoil: boolean;
    public foil: boolean;
    public colors: string[];
    public type_line: string;
    public frame_effects: string[];
    public lang: string;
    public border_color: string;
    public display_name: string;
    public cardImage: string;
    public color_identity: string[];

    public constructor(card: ScryfallApiCard) {
        this.id = card.id;
        this.name = card.name;
        this.printed_name = card.printed_name || null;
        this.set = card.set;
        this.set_name = card.set_name;
        this.rarity = card.rarity;
        this.image_uris = card.image_uris || null;
        this.card_faces = card.card_faces || null;
        this.nonfoil = card.nonfoil;
        this.foil = card.foil;
        this.colors = card.colors;
        this.type_line = card.type_line;
        this.frame_effects = card.frame_effects || [];
        this.lang = card.lang || '';
        this.border_color = card.border_color;
        this.display_name = this._createDisplayName();
        this.cardImage = this._getCardImage();
        this.color_identity = card.color_identity || null;
    }

    // Computes the proper displayName for a card, depending on its properties
    _createDisplayName() {
        const { name, printed_name, frame_effects, border_color, lang } = this;

        if (lang !== 'en') return `${name} (${lang.toUpperCase()})`;

        if (name !== printed_name && printed_name) {
            // Covers cards like Godzilla series
            return `${name} (IP series)`;
        } else if (
            frame_effects.length === 0 &&
            border_color === 'borderless'
        ) {
            // Covers cards like comic-art Vivien, Monsters' Advocate
            return `${name} (Borderless)`;
        } else if (frame_effects.includes('showcase')) {
            // Covers showcase cards like comic-art Illuna, Apex of Wishes
            return `${name} (Showcase)`;
        } else if (frame_effects.includes('extendedart')) {
            // Covers cards with extended left and roght border art
            return `${name} (Extended art)`;
        } else {
            return name;
        }
    }

    _getCardImage() {
        let myImage: string;

        try {
            // If normal prop doesn't exist, move to catch block for flip card faces
            myImage = this.image_uris.normal;
        } catch (e) {
            myImage = this.card_faces[0].image_uris.normal;
        }

        return myImage;
    }
}

/**
 * Extends the Scryfall card object and adds properties we know exist in our database.
 * Models the data and makes writing cards to Mongo a more confident process.
 */
export class InventoryCard extends ScryfallCard {
    private _qoh: Partial<QOH>;
    public quantity: number | null;
    public qtyToSell: number | null;
    public finishCondition: string | null;
    public price: number | null;

    public constructor(card: ScryfallApiCard) {
        super(card);
        this._qoh = card.qoh ? card.qoh : {};
        // `quantity` and `qtyToSell` are redundant transaction props, unify them down the line
        this.quantity = card.quantity || null;
        this.qtyToSell = card.qtyToSell || null;
        this.finishCondition = card.finishCondition || null;
        this.price = card.price && card.price >= 0 ? card.price : null;
    }

    get qohParsed() {
        const foilQty =
            (this._qoh.FOIL_NM || 0) +
            (this._qoh.FOIL_LP || 0) +
            (this._qoh.FOIL_MP || 0) +
            (this._qoh.FOIL_HP || 0);

        const nonfoilQty =
            (this._qoh.NONFOIL_NM || 0) +
            (this._qoh.NONFOIL_LP || 0) +
            (this._qoh.NONFOIL_MP || 0) +
            (this._qoh.NONFOIL_HP || 0);

        return [foilQty, nonfoilQty];
    }

    get qoh() {
        return this._qoh;
    }

    set qoh(quantities) {
        this._qoh = quantities ? quantities : {};
    }
}