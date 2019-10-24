import { merge, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SteamPerson } from './person';

import { PersonsDataSource, SteamPersonsSelector } from './persons-data-source';


export class PersonsMemoizedIterator<T> {

    private _total: number = 0;
    private _order: SteamPerson['id64'][] = [];
    private _persons: Map<SteamPerson['id64'], SteamPerson> = new Map();
    private _results: Map<SteamPerson['id64'], T> = new Map();

    constructor(private _dataSource: PersonsDataSource, private _factory: PersonResultFactory<T>) {
    }


    getResults(): Observable<PersonsIterationsResults<T>> {
        return this.fetchResults({ offset: 0 }).pipe(
            map(() => {
                const results = this._order.map(id64 => {
                    return {
                        person: this._persons.get(id64),
                        result: this._results.get(id64),
                    };
                });
                return {
                    results: results,
                    total: this._total,
                };
            }),
        );
    }


    private fetchResults(selector: SteamPersonsSelector): Observable<void> {
        return this._dataSource.getPersons(selector).pipe(
            switchMap(persons => {
                this._total = persons.total;
                return merge(
                        ...persons.persons
                            .filter(person => {
                                this._persons.set(person.id64, person);
                                return !this._results.has(person.id64);
                            })
                            .map(person => this._factory(person).pipe(
                                tap(result => {
                                    this._results.set(person.id64, result);
                                    const orderIdx = this._order.indexOf(person.id64);
                                    if (orderIdx !== -1) {
                                        this._order.splice(orderIdx, 1);
                                    }
                                    this._order.push(person.id64);
                                }),
                            )),
                    )
                    .pipe(
                        switchMap(() => {
                            const nextOffset = persons.persons.length + selector.offset;
                            if (this._results.size === nextOffset && nextOffset !== persons.total) {
                                return this.fetchResults({ offset: nextOffset });
                            }
                            return of(null);
                        }),
                    );
            }),
        );
    }

}

export type PersonResultFactory<T> = (person: SteamPerson) => Observable<T>;

export interface PersonsIterationsResults<T> {
    results: PersonsIterationsResult<T>[];
    total: number;
}

export interface PersonsIterationsResult<T> {
    person: SteamPerson;
    result: T;
}
