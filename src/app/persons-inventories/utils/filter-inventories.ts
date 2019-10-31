import { Observable } from 'rxjs';
import { map, scan, withLatestFrom } from 'rxjs/operators';

import { ParsedSteamInventory, ParsedSteamInventoryItem } from './parse-inventories-items';

export type ParsedInventoryItemsFilter = (items: ParsedSteamInventoryItem[]) => ParsedSteamInventoryItem[] | null;

export function filterInventories(source: Observable<ParsedSteamInventory>,
                                  filter: Observable<ParsedInventoryItemsFilter>): Observable<ParsedSteamInventory[]> {

    return filter.pipe(
        withLatestFrom(source.pipe(
            scan<ParsedSteamInventory, ParsedSteamInventory[]>(
                (parsedInventories, parsedInventory) => {
                    parsedInventories.push(parsedInventory);
                    return parsedInventories;
            }, []),
        )),
        map(([ filter, inventories ]) => {
            return inventories.reduce<ParsedSteamInventory[]>(
                (result, { person, items }) => {
                    const filteredItems = filter(items);
                    if (filteredItems.length) {
                        result.push({
                            person: person,
                            items:  filteredItems,
                        });
                    }
                    return result;
            }, []);
        }),
    );
}
