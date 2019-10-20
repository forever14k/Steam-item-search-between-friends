import { SteamInventoryAsset, SteamInventoryDescription } from './inventory';


export function getInventoryEntityId(entity: SteamInventoryAsset | SteamInventoryDescription): string {
    return `${entity.classid}_${entity.instanceid}`;
}
