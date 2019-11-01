import { SteamInventory, SteamInventoryAsset, SteamInventoryDescription } from './inventory';
import { getInventoryAssetId, getInventoryDescriptionId } from './inventory-id';


export function dedupeInventoryEntities(inventory: SteamInventory): SteamInventory {
    return {
        ...inventory,
        assets:       dedupeInventoriesEntities(inventory.assets, getInventoryAssetId),
        descriptions: dedupeInventoriesEntities(inventory.descriptions, getInventoryDescriptionId),
    };
}

function dedupeInventoriesEntities<T extends SteamInventoryAsset>(entities: T[], getId: (entity: T) => any): T[];
function dedupeInventoriesEntities<T extends SteamInventoryDescription>(entities: T[], getId: (entity: T) => any): T[];
function dedupeInventoriesEntities<T extends SteamInventoryAsset | SteamInventoryDescription>(
    entities: T[], getId: (entity: T) => any): T[] {

    if (!entities || !entities.length) {
        return [];
    }

    return Array.from(new Map<any, T>(entities.map(entry => [ getId(entry), entry ])).values());
}
