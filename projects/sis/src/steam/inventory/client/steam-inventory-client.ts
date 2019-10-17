import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SteamInventory } from '../inventory';
import { HttpClient } from '@angular/common/http';

export interface SteamInventoryClientConfig {
    defaultLanguage?: string;
    defaultItemsCount?: string;
}

@Injectable()
export class SteamInventoryClient {

    constructor(private _http: HttpClient) {
    }

    getInventory(steamId64: string, appid: number, contextId: number,
                 language: string = 'english', count: number = 5000): Observable<SteamInventory> {
        return this._http.get<SteamInventory>(getSteamInventoryURL(steamId64, appid, contextId, language, count));
    }

}

function getSteamInventoryURL(steamId64: string, appid: number, contextId: number,
                              language: string = 'english', count: number = 5000): string {
    return `//steamcommunity.com/inventory/${steamId64}/${appid}/${contextId}?l=${language}&count=${count}`;
}
