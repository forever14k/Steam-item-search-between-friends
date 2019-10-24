import { Observable, of } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { SteamPerson } from './person';

import { SteamPersons, PersonsDataSource, SteamPersonsSelector } from './persons-data-source';
import {
    PersonsIterationsResults, PersonResultFactory, PersonsMemoizedIterator,
} from './persons-memoized-iterator';


describe('PersonsMemoizedIterator', () => {
    let persons: SteamPerson[];
    let factory: PersonResultFactory<any>;
    beforeEach(() => {
        persons = [
            { id32: '0', id64: '0' },
            { id32: '1', id64: '1' },
            { id32: '2', id64: '2' },
            { id32: '3', id64: '3' },
            { id32: '4', id64: '4' },
            { id32: '5', id64: '5' },
            { id32: '6', id64: '6' },
            { id32: '7', id64: '7' },
        ];
        factory = jasmine.createSpy('factory').and.returnValue(of(null));
    });


    it('should get all inventories for provided person data source', () => {
        const dataSource: PersonsDataSource = {
            getPersons: (_selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                return of({
                    persons: persons,
                    total: persons.length,
                });
            },
        };
        const iterator = new PersonsMemoizedIterator(dataSource, factory);
        let iterationsResult: PersonsIterationsResults<any>;
        const subscription = iterator.getResults().subscribe(results => iterationsResult = results);
        expect(factory).toHaveBeenCalledTimes(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(iterationsResult.results.length).toBe(persons.length);
        for (const result of iterationsResult.results) {
            const idx = persons.indexOf(result.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });

    it('should get all inventories for provided partial person data source', () => {
        const limit = 2;
        const dataSource: PersonsDataSource = {
            getPersons: (selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                const offset = selector && selector.offset !== undefined ? selector.offset : 0;
                return of({
                    persons: persons.slice(offset, limit + offset),
                    total: persons.length,
                });
            },
        };
        const iterator = new PersonsMemoizedIterator(dataSource, factory);
        let iterationsResult: PersonsIterationsResults<any>;
        const subscription = iterator.getResults().subscribe(results => iterationsResult = results);
        expect(factory).toHaveBeenCalledTimes(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(iterationsResult.results.length).toBe(persons.length);
        for (const result of iterationsResult.results) {
            const idx = persons.indexOf(result.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });

    it('should support pausing inventory loading by unsubscribe', () => {
        const dataSource: PersonsDataSource = {
            getPersons: (_selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                return of({
                    persons: persons,
                    total: persons.length,
                });
            },
        };
        const iterator = new PersonsMemoizedIterator(dataSource, factory);
        const unsubscribeOnCount = 4;
        let iterationsResult: PersonsIterationsResults<any>;

        let subscription = iterator.getResults()
            .pipe(
                tap(result => iterationsResult = result),
                takeWhile(result => result.results.length < unsubscribeOnCount),
            )
            .subscribe();
        expect(iterationsResult.results.length).toBe(unsubscribeOnCount);
        expect(subscription.closed).toBeTruthy();
        expect(factory).toHaveBeenCalledTimes(persons.length);

        subscription = iterator.getResults().subscribe(result => {
            expect(result.results.length).toBeGreaterThanOrEqual(unsubscribeOnCount);
            iterationsResult = result;
        });
        expect(iterationsResult.results.length).toBe(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(factory).toHaveBeenCalledTimes(persons.length + (persons.length - unsubscribeOnCount));

        for (const result of iterationsResult.results) {
            const idx = persons.indexOf(result.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });
});
