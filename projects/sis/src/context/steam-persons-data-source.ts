import { Observable } from 'rxjs';

import { SteamPerson } from '../steam/person/person';


export interface SteamPersonsDataSource {
    getPersons(selector?: SteamPersonsSelector): Observable<SteamPersons>;
}

export interface SteamPersons {
    persons: SteamPerson[];
    total: number;
}

export interface SteamPersonsSelector {
    offset?: number;
}
