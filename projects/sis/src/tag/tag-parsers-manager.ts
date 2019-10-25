import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject, Injectable, InjectionToken } from '@angular/core';

import { SteamInventoryAsset, SteamInventoryDescription } from '../steam/inventory/inventory';

import { SisTag } from './tag';


const TAG_PARSERS_MANAGER_PLUGIN = new InjectionToken<TagParsersManagerPlugin>('TagParsersManagerPlugin');

export interface TagParsersManagerPlugin {
    parse(asset: SteamInventoryAsset, description: SteamInventoryDescription): Observable<SisTag[]>;
}


const EMPTY_TAGS = of([]);


@Injectable()
export class TagParsersManager {

    constructor(@Inject(TAG_PARSERS_MANAGER_PLUGIN) private _plugins: TagParsersManagerPlugin[]) {
    }


    parse(asset: SteamInventoryAsset, description: SteamInventoryDescription): Observable<SisTag[]> {
        if (!this._plugins || !this._plugins.length) {
            return EMPTY_TAGS;
        }

        return forkJoin(this._plugins.map(plugin => plugin.parse(asset, description)))
            .pipe(map(tags => reduceTags(tags)));
    }


}

function reduceTags(tags: SisTag[][]): SisTag[] {
    return tags.reduce((result, part) => [...result, ...part], []);
}
