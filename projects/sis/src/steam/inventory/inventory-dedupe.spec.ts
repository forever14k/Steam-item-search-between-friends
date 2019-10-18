import { SteamInventory, SteamInventoryAsset, SteamInventoryBoolean, SteamInventoryDescription } from './inventory';
import { dedupeInventoryEntities } from './inventory-dedupe';


describe('dedupeInventoryEntities', () => {

    let inventory: SteamInventory;
    beforeEach(() => {
        const asset1: SteamInventoryAsset = require('../../../test/data/inventory/assets/170676678_253068381.json');
        const asset2: SteamInventoryAsset = require('../../../test/data/inventory/assets/172726297_93973071.json');
        const description1: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/170676678_253068381.json');
        const description2: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/172726297_93973071.json');
        inventory = {
            assets: [asset1, asset2, asset1, asset2, asset1, asset2],
            descriptions: [description1, description2, description1, description2, description1, description2],
            last_assetid: asset2.assetid, success: SteamInventoryBoolean.TRUE,
        };
    });

    it('should dedupe inventory assets', () => {
        expect(dedupeInventoryEntities(inventory).assets.length).toEqual(2);
    });

    it('should dedupe inventory descriptions', () => {
        expect(dedupeInventoryEntities(inventory).descriptions.length).toEqual(2);
    });

});
