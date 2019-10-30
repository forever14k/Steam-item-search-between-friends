import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


const STEAM_INVENTORY_LAST_APP_COOKIE_NAME = 'strInventoryLastContext';
const STEAM_INVENTORY_LAST_APP_COOKIE_EXPIRE = 7;
const STEAM_INVENTORY_LAST_APP_COOKIE_PATH = '/';

/*
    TODO: add config, spec, remove cookie service dependency
 */
@Injectable()
export class SisSettingsService {

    private _settings: BehaviorSubject<SisSettings | null> = new BehaviorSubject(this.getSettingsFromCookies());

    constructor(private _cookies: CookieService) {
    }


    getSettings(): Observable<SisSettings | null> {
        return this._settings.asObservable();
    }

    setSettings(settings: SisSettings | null): void {
        if (settings) {
            const prevSettings = this.getSettingsFromCookies();
            if (prevSettings) {
                settings = {...prevSettings, ...settings};
            }
            this.saveSettingsToCookies(settings);
            this._settings.next(settings);
        }
    }


    private getSettingsFromCookies(): SisSettings | null {
        const cookie = this._cookies.get(STEAM_INVENTORY_LAST_APP_COOKIE_NAME);

        if (cookie) {
            const pair = cookie.split('_');
            return {
                appId: pair[0],
                contextId: pair[1],
            };
        }

        return null;
    }
    private saveSettingsToCookies(settings: SisSettings) {
        this._cookies.set(
            STEAM_INVENTORY_LAST_APP_COOKIE_NAME,
            `${settings.appId}_${settings.contextId}`,
            STEAM_INVENTORY_LAST_APP_COOKIE_EXPIRE,
            STEAM_INVENTORY_LAST_APP_COOKIE_PATH,
        );
    }

}


export interface SisSettings {
    appId?: string;
    contextId?: string;
}
