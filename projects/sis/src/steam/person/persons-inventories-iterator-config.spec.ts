import { Observer, of, throwError } from 'rxjs';

import { SteamClient } from '../client/steam-client';

import { SteamPerson } from './person';
import { createSteamPersonInventoryResultFactory } from './persons-inventories-iterator-config';


describe('createPersonsInventoryResultFactory', () => {
    let person: SteamPerson;
    let observer: Observer<any>;
    beforeEach(() => {
        person = {
            id32: '0', id64: '0',
        };
        observer = {
            next: jasmine.createSpy('next'),
            error: jasmine.createSpy('error'),
            complete: jasmine.createSpy('complete'),
        };
    });

    it('should handle any error from inventory', () => {
        const client: SteamClient = {
            getInventory: jasmine.createSpy('getInventory').and.returnValue(throwError(new Error())),
        } as unknown as SteamClient;

        const inventory = createSteamPersonInventoryResultFactory(client, 0, 0)(person);
        const subscription = inventory.subscribe(observer);
        expect(subscription.closed).toBeTruthy();
        expect(observer.next).toHaveBeenCalledWith(jasmine.any(Error));
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.complete).toHaveBeenCalledTimes(1);
        expect(observer.error).not.toHaveBeenCalled();
    });

    it('should return an inventory', () => {
        const result = { inventory: 1 };
        const client: SteamClient = {
            getInventory: jasmine.createSpy('getInventory').and.returnValue(of(result)),
        } as unknown as SteamClient;

        const inventory = createSteamPersonInventoryResultFactory(client, 0, 0)(person);
        const subscription = inventory.subscribe(observer);
        expect(subscription.closed).toBeTruthy();
        expect(observer.next).toHaveBeenCalledWith(result);
        expect(observer.next).toHaveBeenCalledTimes(1);
        expect(observer.complete).toHaveBeenCalledTimes(1);
        expect(observer.error).not.toHaveBeenCalled();
    });
});
