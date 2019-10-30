import { combineLatest, Observable } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { SisTag } from 'sis';

import { ParsedSteamInventory } from './parse-inventories-items';


export interface ParsedInventoriesFilters {
    [categoryName: string]: ParsedInventoriesFilter;
}
export type ParsedInventoriesFilter = null | SisTag['name'][];


export function filterInventories(source: Observable<ParsedSteamInventory>,
                                  filters: Observable<ParsedInventoriesFilters>): Observable<ParsedSteamInventory[]> {

    return combineLatest(
            source.pipe(
                scan<ParsedSteamInventory, ParsedSteamInventory[]>(
                    (parsedInventories, parsedInventory) => {
                        parsedInventories.push(parsedInventory);
                        return parsedInventories;
                }, []),
            ),
            filters,
        )
        .pipe(
            map(([ inventories, filters ]) => {
                return inventories.reduce<ParsedSteamInventory[]>(
                    (result, { person, items }) => {
                        const tagsMatcher = createFiltersTagsMatcher(filters);
                        const filteredItems = items.filter(item => tagsMatcher(item.tags));
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


function noopFiltersTagsMatcher() {
    return true;
}

function createFiltersTagsMatcher(filters: ParsedInventoriesFilters): (tags: SisTag[]) => boolean {
    const entries = Object.entries(filters);

    if (entries && entries.length) {
        return (tags: SisTag[]) => {
            const matcher = createTagsMatcher(tags);
            return entries.every(([ categoryName, names]) => {
                if (names && names.length) {
                    return matcher(categoryName, names);
                }
                return true;
            });
        };
    }

    return noopFiltersTagsMatcher;
}

function createTagsMatcher(tags: SisTag[]): (categoryName: SisTag['categoryName'], names: SisTag['name'][]) => boolean {
    return (categoryName: SisTag['categoryName'], names: SisTag['name'][]) => {
        return tags.some(createTagMatcher(categoryName, names));
    };

}

function createTagMatcher(categoryName: SisTag['categoryName'], names: SisTag['name'][]): (tag: SisTag) => boolean {
    return (tag: SisTag) => {
        return categoryName === tag.categoryName && names.includes(tag.name);
    };
}
