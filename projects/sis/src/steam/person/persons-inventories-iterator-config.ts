import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SteamInventory } from '../inventory/inventory';
import {
    ClosedInventoryError, NotFoundInventoryError, SteamClient, TooManyRequestsError, UnaccessibleInventoryError,
} from '../client/steam-client';

import { SteamPerson } from './person';
import { IteratorResultFactory } from '../../iterator/memoized-iterator';
import { IteratorTrackBy } from '../../iterator/iterator-track-by';

export function createSteamPersonInventoryResultFactory(
    steamClient: SteamClient, appId: number, contextId: number,
): IteratorResultFactory<SteamPerson, PersonInventoryResult> {

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

export const steamPersonTrackBy: IteratorTrackBy<SteamPerson> = person => person.id64;
