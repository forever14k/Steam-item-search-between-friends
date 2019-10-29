import { EMPTY, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IterationsResults, SteamInventory, SteamPerson } from 'sis';

import { PersonInventoryResult } from '../persons-inventories-iterator-result-factory';


export function getNewInventories(
    source: Observable<IterationsResults<SteamPerson, PersonInventoryResult>>): Observable<NewSteamInventory> {

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
    );
}

export interface NewSteamInventory {
    person: SteamPerson;
    inventory: SteamInventory;
}
