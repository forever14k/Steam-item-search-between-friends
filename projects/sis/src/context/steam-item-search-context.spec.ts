import { Observable, of } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { SteamPerson } from '../steam/person/person';
import { SteamClient } from '../steam/client/steam-client';

import { SteamPersons, SteamPersonsDataSource, SteamPersonsSelector } from './steam-persons-data-source';
import { SteamItemSearchContext, SteamItemSearchInventories } from './steam-item-search-context';


describe('SteamItemSearchContext', () => {
    let steamClient: SteamClient;
    let persons: SteamPerson[];
    beforeEach(() => {
        steamClient = {
            getInventory: jasmine.createSpy('getInventory').and.returnValue(of(null)),
        } as unknown as SteamClient;
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
    });


    it('should get all inventories for provided person data source', () => {
        const dataSource: SteamPersonsDataSource = {
            getPersons: (_selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                return of({
                    persons: persons,
                    total: persons.length,
                });
            },
        };
        const context = new SteamItemSearchContext(steamClient, dataSource, 0, 0);
        let result: SteamItemSearchInventories;
        const subscription = context.getInventories().subscribe(inventories => result = inventories);
        expect(steamClient.getInventory).toHaveBeenCalledTimes(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(result.inventories.length).toBe(persons.length);
        for (const inventory of result.inventories) {
            const idx = persons.indexOf(inventory.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });

    it('should get all inventories for provided partial person data source', () => {
        const limit = 2;
        const dataSource: SteamPersonsDataSource = {
            getPersons: (selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                const offset = selector && selector.offset !== undefined ? selector.offset : 0;
                return of({
                    persons: persons.slice(offset, limit + offset),
                    total: persons.length,
                });
            },
        };
        const context = new SteamItemSearchContext(steamClient, dataSource, 0, 0);
        let result: SteamItemSearchInventories;
        const subscription = context.getInventories().subscribe(inventories => result = inventories);
        expect(steamClient.getInventory).toHaveBeenCalledTimes(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(result.inventories.length).toBe(persons.length);
        for (const inventory of result.inventories) {
            const idx = persons.indexOf(inventory.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });

    it('should support pausing inventory loading by unsubscribe', () => {
        const dataSource: SteamPersonsDataSource = {
            getPersons: (_selector?: SteamPersonsSelector): Observable<SteamPersons> => {
                return of({
                    persons: persons,
                    total: persons.length,
                });
            },
        };
        const context = new SteamItemSearchContext(steamClient, dataSource, 0, 0);
        const unsubscribeOnCount = 4;
        let result: SteamItemSearchInventories;

        let subscription = context.getInventories()
            .pipe(
                tap(inventories => result = inventories),
                takeWhile(inventories => inventories.inventories.length < unsubscribeOnCount),
            )
            .subscribe();
        expect(result.inventories.length).toBe(unsubscribeOnCount);
        expect(subscription.closed).toBeTruthy();
        expect(steamClient.getInventory).toHaveBeenCalledTimes(persons.length);

        subscription = context.getInventories().subscribe(inventories => {
            expect(inventories.inventories.length).toBeGreaterThanOrEqual(unsubscribeOnCount);
            result = inventories;
        });
        expect(result.inventories.length).toBe(persons.length);
        expect(subscription.closed).toBeTruthy();
        expect(steamClient.getInventory).toHaveBeenCalledTimes(persons.length + (persons.length - unsubscribeOnCount));

        for (const inventory of result.inventories) {
            const idx = persons.indexOf(inventory.person);
            expect(idx).not.toBe(-1);
            persons.splice(idx, 1);
        }
    });
});
