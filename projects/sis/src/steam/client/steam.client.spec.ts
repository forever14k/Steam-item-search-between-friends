import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ImmediateExecutor } from '../../executor';

import {
    ClosedInventoryError, STEAM_CLIENT_CONFIG, SteamClient, SteamClientConfig, TooManyRequestsError,
    UnaccessibleInventoryError,
} from './steam-client';
import { HttpRequest } from '@angular/common/http';
import { STEAM_INVENTORY_COUNT_PARAM, STEAM_INVENTORY_START_ASSET_ID_PARAM } from './steam-client-params';
import { SteamInventory, SteamInventoryBoolean } from '../inventory';


describe('SteamClient', () => {

    describe('specific errors', () => {
        let client: SteamClient;
        let httpTestingController: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    {
                        provide: STEAM_CLIENT_CONFIG,
                        useValue: {
                            executor: new ImmediateExecutor(),
                        } as SteamClientConfig,
                    },
                    SteamClient,
                ],
            });

            client = TestBed.get(SteamClient);
            httpTestingController = TestBed.get(HttpTestingController);
        });

        afterEach(() => {
            // After every test, assert that there are no more pending requests.
            httpTestingController.verify();
        });

        it('should handle 403 http error', fakeAsync(() => {
            client.getInventory('0', 0, 0).subscribe({
                error: error => {
                    expect(error).toEqual(jasmine.any(ClosedInventoryError));
                },
            });
            tick();
            const req = httpTestingController.expectOne(() => true);
            req.flush(null, { status: 403, statusText: 'Closed inventory' });
        }));

        it('should handle 429 http error', fakeAsync(() => {
            client.getInventory('0', 0, 0).subscribe({
                error: error => {
                    expect(error).toEqual(jasmine.any(TooManyRequestsError));
                },
            });
            tick();
            const req = httpTestingController.expectOne(() => true);
            req.flush(null, { status: 429, statusText: 'Too many requests' });
        }));

        it('should handle 500 http error', fakeAsync(() => {
            client.getInventory('0', 0, 0).subscribe({
                error: error => {
                    expect(error).toEqual(jasmine.any(UnaccessibleInventoryError));
                },
            });
            tick();
            const req = httpTestingController.expectOne(() => true);
            req.flush(null, { status: 500, statusText: 'Unaccessible inventory' });
        }));

    });

    describe('partial requests', () => {
        const ITEMS_PER_REQUEST = 100;
        let client: SteamClient;
        let httpTestingController: HttpTestingController;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    {
                        provide: STEAM_CLIENT_CONFIG,
                        useValue: {
                            executor: new ImmediateExecutor(),
                            inventory: {
                                itemsPerRequest: ITEMS_PER_REQUEST,
                            },
                        } as SteamClientConfig,
                    },
                    SteamClient,
                ],
            });

            client = TestBed.get(SteamClient);
            httpTestingController = TestBed.get(HttpTestingController);
        });

        afterEach(() => {
            // After every test, assert that there are no more pending requests.
            httpTestingController.verify();
        });


        it('should support items per request limit', fakeAsync(() => {
            client.getInventory('0', 0, 0).subscribe();
            tick();
            const req = httpTestingController.expectOne((request: HttpRequest<any>) =>
                request.params.get(STEAM_INVENTORY_COUNT_PARAM) === String(ITEMS_PER_REQUEST),
            );
            expect(req).toBeTruthy();
        }));

        it('should fetch whole inventory at once', fakeAsync(() => {
            let count = 1;
            const countTarget = 3;
            let nextCalls = 0;
            client.getInventory('0', 0, 0).subscribe(
                () => {
                    nextCalls++;
                    expect(nextCalls).toEqual(1);
                    expect(count).toEqual(countTarget);
                },
            );

            tick();
            const req1 = httpTestingController.expectOne((request: HttpRequest<any>) => {
                return !request.params.has(STEAM_INVENTORY_START_ASSET_ID_PARAM);
            });
            req1.flush({
                more_items: SteamInventoryBoolean.TRUE, last_assetid: String(count), assets: [], descriptions: [],
            } as SteamInventory);

            tick();
            const req2 = httpTestingController.expectOne((request: HttpRequest<any>) => {
                return request.params.get(STEAM_INVENTORY_START_ASSET_ID_PARAM) === String(count);
            });
            count++;
            req2.flush({
                more_items: SteamInventoryBoolean.TRUE, last_assetid: String(count), assets: [], descriptions: [],
            } as SteamInventory);

            tick();
            const req3 = httpTestingController.expectOne((request: HttpRequest<any>) =>
                request.params.get(STEAM_INVENTORY_START_ASSET_ID_PARAM) === String(count),
            );
            count++;
            req3.flush({ more_items: SteamInventoryBoolean.FALSE, assets: [], descriptions: [] } as SteamInventory);
        }));

    });

});
