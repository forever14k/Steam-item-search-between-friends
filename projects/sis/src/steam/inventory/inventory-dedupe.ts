import { SteamInventory, SteamInventoryAsset, SteamInventoryDescription } from './inventory';
import { getInventoryEntityId } from './inventory-id';


export function dedupeInventoryEntities(inventory: SteamInventory): SteamInventory {
    return {
        ...inventory,
        assets:       dedupeInventoriesEntities(inventory.assets),
        descriptions: dedupeInventoriesEntities(inventory.descriptions),
    };
}

function dedupeInventoriesEntities(entities: SteamInventoryAsset[]): SteamInventoryAsset[];
function dedupeInventoriesEntities(entities: SteamInventoryDescription[]): SteamInventoryDescription[];
function dedupeInventoriesEntities(
    entities?: (SteamInventoryAsset | SteamInventoryDescription)[]): (SteamInventoryAsset | SteamInventoryDescription)[] {

    if (!entities || !entities.length) {
        return [];
    }

    return Array.from(
        new Map<string, SteamInventoryAsset | SteamInventoryDescription>(
            entities.map(entry => [ getInventoryEntityId(entry), entry ],
            ))
            .values(),
    );
}
