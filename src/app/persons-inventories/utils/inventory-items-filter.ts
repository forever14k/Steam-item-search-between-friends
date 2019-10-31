import { SisTag } from 'sis';
import { ParsedInventoryItemsFilter } from './filter-inventories';
import { Observable } from 'rxjs';
import { ParsedSteamInventoryItem } from './parse-inventories-items';
import { map } from 'rxjs/operators';


const NOOP_PARSED_INVENTORY_ITEMS_FILTER: ParsedInventoryItemsFilter = items => items;

export function createParsedInventoryItemsFilter(
    filters: Observable<ParsedInventoriesTagsFilters>): Observable<ParsedInventoryItemsFilter> {

    return filters.pipe(
        map(filters => {
            const filtersFns = Object.entries(filters)
                .filter(([ , filter ]) => Boolean(filter))
                .map(([ categoryName, filter ]) => {
                    return typeof(filter) === 'function' ? filter : createFilterFn(categoryName, filter);
                });

            if (filtersFns.length) {
                return createFilter(filtersFns);
            }

            return NOOP_PARSED_INVENTORY_ITEMS_FILTER;
        }),
    );
}


export interface ParsedInventoriesTagsFilters {
    [categoryName: string]: ParsedInventoriesTagsFilter | null;
}
export type ParsedInventoriesTagsFilterFn = (tag: SisTag) => boolean;
export type ParsedInventoriesTagsFilter = ParsedInventoriesTagsFilterFn | SisTag['name'][];


function createFilterFn(categoryName: SisTag['categoryName'], names: SisTag['name'][]): ParsedInventoriesTagsFilterFn {
    return (tag: SisTag) => {
        return categoryName === tag.categoryName && names.includes(tag.name);
    };
}

function createFilter(filters: ParsedInventoriesTagsFilterFn[]): ParsedInventoryItemsFilter {
    return (items: ParsedSteamInventoryItem[]): ParsedSteamInventoryItem[] | null => {
        return items.filter(item => filters.every(filter => item.tags.some(tag => filter(tag))));
    };
}
