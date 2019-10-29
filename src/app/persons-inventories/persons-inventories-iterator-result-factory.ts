import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    ClosedInventoryError, IteratorResultFactory, NotFoundInventoryError, SteamClient, SteamInventory,
    SteamPerson, TooManyRequestsError, UnaccessibleInventoryError,
} from 'sis';


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
