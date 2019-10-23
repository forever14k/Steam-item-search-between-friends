import { merge, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SteamPerson } from '../steam/person/person';
import { SteamInventory } from '../steam/inventory/inventory';
import { SteamClient } from '../steam/client/steam-client';

import { SteamPersonsDataSource, SteamPersonsSelector } from './steam-persons-data-source';


export class SteamItemSearchContext {

    private _persons: Map<SteamPerson['id64'], SteamPerson> = new Map();
    private _inventories: Map<SteamPerson['id64'], SteamInventory> = new Map();

    constructor(private _steamClient: SteamClient, private _dataSource: SteamPersonsDataSource,
                private _appId: number, private _contextId: number) {
    }


    getInventories(): Observable<SteamItemSearchInventories> {
        return this.fetchInventories({ offset: 0 }).pipe(
            map(() => {
                const inventories = Array.from(this._inventories.entries()).map(([ id64, inventory ]) => {
                    return {
                        person: this._persons.get(id64),
                        inventory: inventory,
                    };
                });
                return {
                    inventories: inventories,
                    total: inventories.length,
                };
            }),
        );
    }


    private fetchInventories(selector: SteamPersonsSelector): Observable<void> {
        return this._dataSource.getPersons(selector).pipe(
            switchMap(persons => {
                return merge(
                        ...persons.persons
                            .filter(person => {
                                this._persons.set(person.id64, person);
                                return !this._inventories.has(person.id64);
                            })
                            .map(person => {
                                return this._steamClient.getInventory(person.id64, this._appId, this._contextId).pipe(
                                    tap(inventory => this._inventories.set(person.id64, inventory)),
                                );
                            }),
                    )
                    .pipe(
                        switchMap(() => {
                            const nextOffset = persons.persons.length + selector.offset;
                            if (this._inventories.size === nextOffset && nextOffset !== persons.total) {
                                return this.fetchInventories({ offset: nextOffset });
                            }
                            return of(null);
                        }),
                    );
            }),
        );
    }

}

export interface SteamItemSearchInventories {
    inventories: SteamItemSearchContextInventory[];
    total: number;
}

export interface SteamItemSearchContextInventory {
    person: SteamPerson;
    inventory: SteamInventory;
}
