import { SteamInventoryBaseAsset, SteamInventoryBaseDescription, SteamInventoryBaseTag } from './steam-inventory';


export interface SteamInventoryV2 {
    assets: SteamInventoryV2Asset[];
    descriptions: SteamInventoryV2Description[];
    success: number;
}

export interface SteamInventoryV2Asset extends SteamInventoryBaseAsset {
    appid: number;
    contextid: string;
}

export interface SteamInventoryV2Description extends SteamInventoryBaseDescription {
    appid: number;
    tags: SteamInventoryV2Tag[];
}

export interface SteamInventoryV2Tag extends SteamInventoryBaseTag {
    localized_category_name: string;
    localized_tag_name: string;
}