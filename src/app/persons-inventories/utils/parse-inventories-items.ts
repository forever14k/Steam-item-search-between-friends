import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
    getInventoryDescriptionId, SteamInventoryAsset, SteamInventoryDescription, SisTag, SteamPerson, TagParsersManager,
    IterationsResults,
} from 'sis';

import { PersonInventoryResult } from '../persons-inventories-iterator-result-factory';


export function parseInventories(source: Observable<IterationsResults<SteamPerson, PersonInventoryResult>>,
                                 parser: TagParsersManager): Observable<ParsedSteamInventory> {

    return source.pipe(
        switchMap((result: IterationsResults<SteamPerson, PersonInventoryResult>) => {
            if (result.results && result.results.length) {
                const lastResult = result.results[ result.results.length - 1 ];
                if (!(lastResult.result instanceof Error)) {
                    return of({
                        person:    lastResult.entity,
                        inventory: lastResult.result,
                    });
                }
            }
            return EMPTY;
        }),
        switchMap(({ person, inventory }) => {
            if (inventory.assets && inventory.assets.length && inventory.descriptions && inventory.descriptions.length) {
                const order = inventory.assets.map(asset => getInventoryDescriptionId(asset));
                const assets = new Map(inventory.assets.map(asset => [ getInventoryDescriptionId(asset), asset ]));
                const descriptions = new Map(inventory.descriptions.map(description =>
                    [ getInventoryDescriptionId(description), description ],
                ));
                return forkJoin(
                        order.map(id => {
                            const asset = assets.get(id);
                            const description = descriptions.get(id);
                            return parser.parse(description, asset).pipe(
                                map(tags => {
                                    return {
                                        asset:       asset,
                                        description: description,
                                        tags:        tags,
                                    } as ParsedSteamInventoryItem;
                                }),
                            );
                        }),
                    )
                    .pipe(
                        map(items => {
                            return {
                                person: person,
                                items:  items,
                            };
                        }),
                    );
            }

            return EMPTY;
        }),
    );
}


export interface ParsedSteamInventory {
    person: SteamPerson;
    items: ParsedSteamInventoryItem[];
}

export interface ParsedSteamInventoryItem {
    asset: SteamInventoryAsset;
    description: SteamInventoryDescription;
    tags: SisTag[];
}
