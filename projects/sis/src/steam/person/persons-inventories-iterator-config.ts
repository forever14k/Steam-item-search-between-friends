import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SteamInventory } from '../inventory/inventory';
import {
    ClosedInventoryError, NotFoundInventoryError, SteamClient, TooManyRequestsError, UnaccessibleInventoryError
} from '../client/steam-client';

import { SteamPerson } from './person';
import { PersonResultFactory } from './persons-memoized-iterator';

export function createPersonsInventoryResultFactory(steamClient: SteamClient,
                                                    appId: number, contextId: number): PersonResultFactory<PersonInventoryResult> {

    return (person: SteamPerson): Observable<PersonInventoryResult> => {
        return steamClient.getInventory(person.id64, appId, contextId).pipe(
            catchError((error: Error, caught: Observable<SteamInventory>) => {
                if (error instanceof TooManyRequestsError) {
                    return caught;
                }

                return of(error);
            }),
        );
    };
}

export type PersonInventoryResult = SteamInventory | ClosedInventoryError | NotFoundInventoryError | UnaccessibleInventoryError | Error;
