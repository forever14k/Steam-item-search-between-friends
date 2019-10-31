import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { SisTag } from 'sis';

import { ParsedSteamInventory } from './parse-inventories-items';


export function getInventoriesFiltersScheme(source: Observable<ParsedSteamInventory>): Observable<InventoriesFiltersScheme> {
    return source.pipe(
        scan(
            (result, inventory: ParsedSteamInventory) => {
                if (inventory.items && inventory.items.length) {
                    for (const item of inventory.items) {
                        if (item.tags && item.tags.length) {
                            for (const tag of item.tags) {
                                let category = result.categories.find(existing =>
                                    existing.categoryName === tag.categoryName && existing.kind === tag.kind,
                                );
                                if (!category) {
                                    category = {
                                        kind:         tag.kind,
                                        categoryName: tag.categoryName,
                                        items:        [],
                                    };
                                    result.categories = [ ...result.categories, category ];
                                }
                                const item = category.items.find(existing => existing.name === tag.name);
                                if (!item) {
                                    category.items = [ ...category.items, tag ];
                                }
                            }
                        }
                    }
                }
                return result;
            },
            { categories: [] } as InventoriesFiltersScheme,
        ),
    );
}

export interface InventoriesFiltersScheme {
    categories: InventoriesFiltersSchemeCategory[];
}

export interface InventoriesFiltersSchemeCategory {
    kind: SisTag['kind'];
    categoryName: SisTag['categoryName'];
    items: SisTag[];
}
