import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { SisTag } from 'sis';

import { ParsedSteamInventory } from './parse-inventories-items';


export function getInventoriesFiltersScheme(
    source: Observable<ParsedSteamInventory>): Observable<Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>>> {

    return source.pipe(
        scan(
            (result, inventory: ParsedSteamInventory) => {
                if (inventory.items && inventory.items.length) {
                    for (const item of inventory.items) {
                        if (item.tags && item.tags.length) {
                            for (const tag of item.tags) {
                                let category = result.get(tag.categoryName);
                                if (!category) {
                                    category = new Map();
                                }
                                if (!category.has(tag.name)) {
                                    category.set(tag.name, tag);
                                }
                                result.set(tag.categoryName, category);
                            }
                        }
                    }
                }
                return result;
            },
            new Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>>(),
        ),
    );
}

