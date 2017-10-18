import { SteamInventoryV1Description } from '../steam';
import { SisbfItem } from '../sisbf';

export function copyBaseDescriptionMiddleware(description: Readonly<SteamInventoryV1Description>): Partial<SisbfItem> | null {
    return null;
}