import { SteamInventoryBaseAsset, SteamInventoryBaseDescription, SteamInventoryBaseTag } from './steam-inventory';


export interface SteamInventoryV1 {
    success: boolean;
    rgInventory: { [key: string]: SteamInventoryV1Asset; };
    rgDescriptions: { [key: string]: SteamInventoryV1Description; };
}

export interface SteamInventoryV1Asset extends SteamInventoryBaseAsset {
    id: string;
    appid: string;
    contextid: string;
}

export interface SteamInventoryV1Description extends SteamInventoryBaseDescription {
    appid: string;
    tags: SteamInventoryV1Tag[];
}

export interface SteamInventoryV1Tag extends SteamInventoryBaseTag {
    name: string;
    category_name: string;
}