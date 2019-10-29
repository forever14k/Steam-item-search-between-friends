import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { ParsedSteamInventory } from './parse-inventories-items';


export function collectInventories(source: Observable<ParsedSteamInventory>): Observable<ParsedSteamInventory[]> {
    return source.pipe(
        scan(
            (parsedInventories: ParsedSteamInventory[], parsedInventory: ParsedSteamInventory) => {
                parsedInventories.push(parsedInventory);
                return parsedInventories;
            },
            [],
        ),
    );
}
