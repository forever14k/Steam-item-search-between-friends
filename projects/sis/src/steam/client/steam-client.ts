import { Observable, of, SchedulerLike } from 'rxjs';
import { catchError, map, subscribeOn, switchMap } from 'rxjs/operators';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Executor, ExecutorScheduler } from '../../executor';
import { LANGUAGE, STEAM_INVENTORY_API_PATH } from '../config';
import { SteamInventory, dedupeInventoryEntities } from '../inventory';
import {
    STEAM_INVENTORY_COUNT_PARAM, STEAM_INVENTORY_START_ASSET_ID_PARAM, STEAM_LANGUAGE_PARAM,
} from './steam-client-params';


export const STEAM_CLIENT_CONFIG = new InjectionToken<SteamClientConfig>('SteamClientConfig');
export interface SteamClientConfig {
    executor: Executor;
    baseUrl?: string;
    inventory?: SteamClientInventoryConfig;
}
export interface SteamClientInventoryConfig {
    itemsPerRequest?: number;
}

const STEAM_CLIENT_CONFIG_DEFAULTS: Partial<SteamClientConfig> = {
    baseUrl: '//steamcommunity.com',
    inventory: {
        itemsPerRequest: 5000,
    },
};


@Injectable()
export class SteamClient {

    private _config: SteamClientConfig;
    private _scheduler: SchedulerLike;


    constructor(private _http: HttpClient, @Inject(STEAM_CLIENT_CONFIG) config: SteamClientConfig) {
        this._config = {
            ...STEAM_CLIENT_CONFIG_DEFAULTS,
            ...config,
            inventory: {
                ...STEAM_CLIENT_CONFIG_DEFAULTS.inventory,
                ...config && config.inventory ? config.inventory : {},
            },
        };
        this._scheduler = new ExecutorScheduler(this._config.executor);
    }


    getInventory(steamId64: string, appid: number, contextId: number): Observable<SteamInventory> {
        return this.fetchInventory(steamId64, appid, contextId,  this._config.inventory.itemsPerRequest);
    }


    private fetchInventory(steamId64: string, appid: number, contextId: number,
                           itemsPerRequest: number, startAssetId?: string): Observable<SteamInventory> {
        const url = `${this._config.baseUrl}/${STEAM_INVENTORY_API_PATH}/${steamId64}/${appid}/${contextId}`;
        let params = new HttpParams({
            fromObject: {
                [STEAM_LANGUAGE_PARAM]: LANGUAGE,
                [STEAM_INVENTORY_COUNT_PARAM]: String(itemsPerRequest),
            },
        });
        if (startAssetId !== undefined) {
            params = params.set(STEAM_INVENTORY_START_ASSET_ID_PARAM, String(startAssetId));
        }
        return this._http.get<SteamInventory>(url, { params: params }).pipe(
            subscribeOn(this._scheduler),
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 403: throw new ClosedInventoryError(steamId64, appid, contextId);
                        case 429: throw new TooManyRequestsError();
                        case 500: throw new UnaccessibleInventoryError(steamId64, appid, contextId);
                        default:  throw error;
                    }
                }
                throw error;
            }),
            switchMap((inventory: SteamInventory) => {
                if (inventory.more_items) {
                    return this.fetchInventory(steamId64, appid, contextId, itemsPerRequest, inventory.last_assetid).pipe(
                        map((nextInventory: SteamInventory) => mergeInventories(inventory, nextInventory)),
                    );
                }
                return of(inventory);
            }),
            map((inventory: SteamInventory) => dedupeInventoryEntities(inventory)),
        );
    }

}

function mergeInventories(inventory: SteamInventory, nextInventory: SteamInventory): SteamInventory {
    return {
        ...inventory,
        ...nextInventory,
        assets:       [ ...inventory.assets || [],       ...nextInventory.assets || [] ],
        descriptions: [ ...inventory.descriptions || [], ...nextInventory.descriptions || [] ],
    };
}


export class TooManyRequestsError extends Error {
    constructor() {
        super('Made too many request in short period of time');
    }
}

export class UnaccessibleInventoryError extends Error {
    constructor(steamId64: string, appid: number, contextId: number) {
        super(`Inventory of ID:'${steamId64}' for APP_ID:'${appid}' with CONTEXT_ID:'${contextId}' can not be accessed`);
    }
}

export class ClosedInventoryError extends Error {
    constructor(steamId64: string, appid: number, contextId: number) {
        super(`Access to inventory of ID:'${steamId64}' for APP_ID:'${appid}' with CONTEXT_ID:'${contextId}' is closed`);
    }
}

