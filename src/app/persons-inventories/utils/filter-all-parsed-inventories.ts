import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SisTag } from 'sis';

import { ParsedSteamInventory } from './parse-inventories-items';


export function filterAllParsedInventories(source: Observable<ParsedSteamInventory[]>,
                                           filters: Observable<ParsedInventoriesFilters>): Observable<ParsedSteamInventory[]> {

    return combineLatest(source, filters).pipe(
        map(([ inventories, filters ]) => {
            return inventories
                .map(({ person, items }) => {
                    return {
                        person: person,
                        items: items.filter(item => isTagsMatchesFilters(item.tags, filters)),
                    } as ParsedSteamInventory;
                })
                .filter(({ items }) => Boolean(items.length));
        }),
    );
}

function isTagsMatchesFilters(tags: SisTag[], filters: { [key: string]: null | SisTag['name'][] }): boolean {
    const filtersKeys = Object.keys(filters);
    if (!filtersKeys || !filtersKeys.length) {
        return true;
    }
    return filtersKeys.every(filterKey => {
        const filter = filters[filterKey];
        if (!filter || !filter.length) {
            return true;
        }
        return isTagsMatchesFilter(tags, filterKey, filter);
    });
}

function isTagsMatchesFilter(tags: SisTag[], categoryName: SisTag['categoryName'], names: SisTag['name'][]): boolean {
    return tags.some(tag => isTagMatchesFilter(tag, categoryName, names));
}

function isTagMatchesFilter(tag: SisTag, categoryName: SisTag['categoryName'], names: SisTag['name'][]): boolean {
    return categoryName === tag.categoryName && names.includes(tag.name);
}


export interface ParsedInventoriesFilters {
    [categoryName: string]: ParsedInventoriesFilter;
}
export type ParsedInventoriesFilter = null | SisTag['name'][];
