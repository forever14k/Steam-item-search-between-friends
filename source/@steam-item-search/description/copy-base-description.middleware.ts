import { SteamInventoryV1Description } from '../steam';
import { SteamItemSearchEntry } from '../common';
import { DescriptionMiddleware } from './description-middleware';

export const copyBaseDescriptionMiddleware: DescriptionMiddleware = (description: Readonly<SteamInventoryV1Description>): Partial<SteamItemSearchEntry> | null => {
    return null;
}