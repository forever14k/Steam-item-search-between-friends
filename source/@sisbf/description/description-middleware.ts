import { SteamInventoryV1Description } from '../steam';
import { SisbfItem } from '../sisbf';

export interface DescriptionMiddleware {
    (description: Readonly<SteamInventoryV1Description>): Partial<SisbfItem> | null;
}