import { Observable, of } from 'rxjs';

import { SteamInventoryAsset, SteamInventoryDescription } from '../steam/inventory/inventory';

import { SisTag } from './tag';
import { TagParsersManager, TagParsersManagerPlugin } from './tag-parsers-manager';


describe('TagParsersManager', () => {

    it('should support plugins', () => {
        const nameKind = 'Name';
        const countKind = 'Count';
        const appIdKind = 'AppId';
        const plugins: TagParsersManagerPlugin[] = [
            {
                parse: (asset: SteamInventoryAsset, description: SteamInventoryDescription): Observable<SisTag[]> => {
                    return of([
                        { name: countKind, kind: countKind, count: asset.amount },
                        { name: nameKind,  kind: nameKind, value: description.market_name },
                    ]);
                },
            },
            {
                parse: (asset: SteamInventoryAsset, _description: SteamInventoryDescription): Observable<SisTag[]> => {
                    return of([
                        { name: appIdKind, kind: appIdKind, appId: asset.appid },
                    ]);
                },
            },
        ];

        const asset1: SteamInventoryAsset = require('../../test/data/inventory/assets/170676678_253068381.json');
        const description1: SteamInventoryDescription = require('../../test/data/inventory/descriptions/170676678_253068381.json');

        const manager: TagParsersManager = new TagParsersManager(plugins);

        let parseResult: SisTag[];
        manager.parse(asset1, description1).subscribe(result => parseResult = result);
        expect(parseResult).toContain(jasmine.objectContaining({ kind: nameKind,  value: description1.market_name }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: countKind, count: asset1.amount }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: appIdKind, appId: asset1.appid }));

    });

});
