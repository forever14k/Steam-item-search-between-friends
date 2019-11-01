import { SteamInventoryAsset, SteamInventoryDescription } from './inventory';

// TODO: add spec
export function getInventoryAssetId(asset: SteamInventoryAsset): string {
    return `${asset.classid}_${asset.instanceid}_${asset.instanceid}`;
}

export function getInventoryDescriptionId(description: SteamInventoryAsset | SteamInventoryDescription): string {
    return `${description.classid}_${description.instanceid}`;
}
