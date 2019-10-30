import { Observable } from 'rxjs';
import { map, scan, withLatestFrom } from 'rxjs/operators';
import { SisTag } from 'sis';

import { ParsedSteamInventory, ParsedSteamInventoryItem } from './parse-inventories-items';


export interface ParsedInventoriesFilters {
    [categoryName: string]: ParsedInventoriesFilter;
}
export type ParsedInventoriesFilter = null | SisTag['name'][];

export type ItemsFilterFactory = (filters: ParsedInventoriesFilters) => (items: ParsedSteamInventoryItem[]) => ParsedSteamInventoryItem[];


export function filterInventories(source: Observable<ParsedSteamInventory>,
                                  // TODO: merge filters and filters factory
                                  filters: Observable<ParsedInventoriesFilters>,
                                  filtersFactory: ItemsFilterFactory = createItemsFilterFactory(),
    ): Observable<ParsedSteamInventory[]> {

    return filters.pipe(
        withLatestFrom(source.pipe(
            scan<ParsedSteamInventory, ParsedSteamInventory[]>(
                (parsedInventories, parsedInventory) => {
                    parsedInventories.push(parsedInventory);
                    return parsedInventories;
            }, []),
        )),
        map(([ filters, inventories ]) => {
            const filter = filtersFactory(filters);
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

function noopFiltersTagsMatcher() {
    return true;
}

function defaultFiltersTagsMatcherFactory(
        filters: ParsedInventoriesFilters, tagMatcherFactory: TagMatcherFactory,
    ): (tags: SisTag[]) => boolean {

    const entries = Object.entries(filters);

    if (entries && entries.length) {
        return (tags: SisTag[]) => {
            const matcher = defaultTagsMatcherFactory(tags, tagMatcherFactory);
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

function defaultTagsMatcherFactory(
        tags: SisTag[], tagMatcherFactory: TagMatcherFactory,
    ): (categoryName: SisTag['categoryName'], names: SisTag['name'][]) => boolean {

    return (categoryName: SisTag['categoryName'], names: SisTag['name'][]) => {
        return tags.some(tagMatcherFactory(categoryName, names));
    };
}


export interface CreateItemsFilterFactoryConfig {
    tagMatcherFactory?: TagMatcherFactory;
}
export type TagMatcherFactory = (categoryName: SisTag['categoryName'], names: SisTag['name'][]) => (tag: SisTag) => boolean;

export function createItemsFilterFactory(config?: CreateItemsFilterFactoryConfig): ItemsFilterFactory {
    const tagMatcherFactory = config && config.tagMatcherFactory ? config.tagMatcherFactory : defaultTagMatcherFactory;
    return (filters: ParsedInventoriesFilters) => {
        const filtersTagsMatcher = defaultFiltersTagsMatcherFactory(filters, tagMatcherFactory);
        return (items: ParsedSteamInventoryItem[]) => {
            return items.filter(item => filtersTagsMatcher(item.tags));
        };
    };
}

export function defaultTagMatcherFactory(categoryName: SisTag['categoryName'], names: SisTag['name'][]): (tag: SisTag) => boolean {
    return (tag: SisTag) => {
        return categoryName === tag.categoryName && names.includes(tag.name);
    };
}
