import { EMPTY, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getInventoryEntityId, SteamInventoryAsset, SteamInventoryDescription, SisTag, SteamPerson, TagParsersManager } from 'sis';

import { NewSteamInventory } from './get-new-inventories';


export function parseInventoryItems(source: Observable<NewSteamInventory>, parser: TagParsersManager): Observable<ParsedSteamInventory> {
    return source.pipe(
        switchMap(({ person, inventory }) => {
            if (inventory.assets && inventory.assets.length && inventory.descriptions && inventory.descriptions.length) {
                const order = inventory.assets.map(asset => getInventoryEntityId(asset));
                const assets = new Map(inventory.assets.map(asset => [ getInventoryEntityId(asset), asset ]));
                const descriptions = new Map(inventory.descriptions.map(description =>
                    [ getInventoryEntityId(description), description ],
                ));
                return forkJoin(
                    order.map(id => {
                        const asset = assets.get(id);
                        const description = descriptions.get(id);
                        return parser.parse(descriptions.get(id), assets.get(id)).pipe(
                            map(tags => {
                                return {
                                    asset: asset,
                                    description: description,
                                    tags: tags,
                                } as ParsedSteamInventoryItem;
                            }),
                        );
                    }),
                )
                    .pipe(
                        map(items => {
                            return {
                                person: person,
                                items: items,
                            } as ParsedSteamInventory;
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
