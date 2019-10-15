import { SteamInventoryV1Description } from '../steam';
import { SteamItemSearchEntry } from '../common';

export interface DescriptionMiddleware {
    (description: Readonly<SteamInventoryV1Description>): Partial<SteamItemSearchEntry> | null;
}