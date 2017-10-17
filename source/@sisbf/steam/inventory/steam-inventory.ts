export interface SteamInventoryBaseAsset {
    assetid: string;
    classid: string;
    instanceid: string;

    amount: string;
}

export interface SteamInventoryBaseDescription {
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

    actions: SteamInventoryBaseAction[];
    market_actions: SteamInventoryBaseAction[];
    descriptions: SteamInventoryBaseDescriptionDescription[]
    tags: SteamInventoryBaseTag[];

}


export interface SteamInventoryBaseDescriptionDescription {
    value: string;
    color: string;
}

export interface SteamInventoryBaseAction {
    link: string;
    name: string;
}

export interface SteamInventoryBaseTag {
    category: string;
    internal_name: string;
    color?: string
}


export enum SteamInventoryItemTradable {
    NOT_TRADABLE,
    TRADABLE,
}

export enum SteamInventoryItemMarketable {
    NOT_MARKETABLE,
    MARKETABLE,
}