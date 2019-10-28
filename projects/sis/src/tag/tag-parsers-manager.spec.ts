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
                        { kind: countKind, categoryName: countKind, name: _asset.amount  },
                        { kind: nameKind, categoryName: nameKind, name: _description.market_name },
                    ]);
                },
            },
            {
                parse: (_description: SteamInventoryDescription, _asset: SteamInventoryAsset): Observable<SisTag[]> => {
                    return of([
                        { kind: appIdKind, categoryName: appIdKind, name: asset.appid },
                    ]);
                },
            },
        ];

        const asset: SteamInventoryAsset = require('../../test/data/inventory/assets/170676678_253068381.json');
        const description: SteamInventoryDescription = require('../../test/data/inventory/descriptions/170676678_253068381.json');

        const manager: TagParsersManager = new TagParsersManager(plugins);

        let parseResult: SisTag[];
        manager.parse(description, asset).subscribe(result => parseResult = result);
        expect(parseResult).toContain(jasmine.objectContaining({ kind: nameKind,  name: description.market_name }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: countKind, name: asset.amount }));
        expect(parseResult).toContain(jasmine.objectContaining({ kind: appIdKind, name: asset.appid }));

    });

});
