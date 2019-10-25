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
                parse: (_description: SteamInventoryDescription, _asset: SteamInventoryAsset): Observable<SisTag[]> => {
                    return of([
                        { name: countKind, kind: countKind, count: _asset.amount },
                        { name: nameKind,  kind: nameKind, value: _description.market_name },
                    ]);
                },
            },
            {
                parse: (_description: SteamInventoryDescription, _asset: SteamInventoryAsset): Observable<SisTag[]> => {
                    return of([
                        { name: appIdKind, kind: appIdKind, appId: _asset.appid },
                    ]);
                },
            },
        ];

        const asset: SteamInventoryAsset = require('../../test/data/inventory/assets/170676678_253068381.json');
        const description: SteamInventoryDescription = require('../../test/data/inventory/descriptions/170676678_253068381.json');

        const manager: TagParsersManager = new TagParsersManager(plugins);

        let parseResult: SisTag[];
        manager.parse(description, asset).subscribe(result => parseResult = result);
        expect(parseResult).toContain(jasmine.objectContaining({ kind: nameKind,  value: description.market_name }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: countKind, count: asset.amount }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: appIdKind, appId: asset.appid }));

    });

});
