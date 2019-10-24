import { Observable } from 'rxjs';

import { SteamPerson } from './person';


export interface PersonsDataSource {
    getPersons(selector?: SteamPersonsSelector): Observable<SteamPersons>;
}

export interface SteamPersons {
    persons: SteamPerson[];
    total: number;
}

export interface SteamPersonsSelector {
    offset?: number;
}
