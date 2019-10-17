export interface SteamInventory {
    assets: SteamInventoryAsset[];
    descriptions: SteamInventoryDescription[];
    success: number;
}

export interface SteamInventoryAsset {
    assetid: string;
    classid: string;
    instanceid: string;

    amount: string;

    appid: number;
    contextid: string;
}

export interface SteamInventoryDescription {
    classid: string;
    instanceid: string;

    currency: number;
    commodity: number;

    marketable: SteamInventoryItemMarketable;
    tradable: SteamInventoryItemTradable;

    name_color: string;
    background_color: string;
    icon_url: string;
    icon_url_large: string;

    type: string;
    name: string;

    market_name: string;
    market_hash_name: string;

    market_marketable_restriction: number;
    market_tradable_restriction: number;

    actions: SteamInventoryAction[];
    market_actions: SteamInventoryAction[];
    descriptions: SteamInventoryDescriptionDescription[];

    appid: number;
    tags: SteamInventoryTag[];
}

export interface SteamInventoryDescriptionDescription {
    value: string;
    color: string;
}

export interface SteamInventoryAction {
    link: string;
    name: string;
}

export interface SteamInventoryTag {
    category: string;
    internal_name: string;
    color?: string;
    localized_category_name: string;
    localized_tag_name: string;
}

export enum SteamInventoryItemTradable {
    NOT_TRADABLE,
    TRADABLE,
}

export enum SteamInventoryItemMarketable {
    NOT_MARKETABLE,
    MARKETABLE,
}

export enum SteamInventoryTagCategory {
    CATEGORY = 'Category',
    QUALITY  = 'Quality',
    RARITY   = 'Rarity',
}
