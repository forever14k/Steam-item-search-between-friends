import { SteamInventoryAsset, SteamInventoryDescription } from './inventory';
import { getInventoryDescriptionId } from './inventory-id';


describe('getInventoryEntityId', () => {

    it('should return same id for each entity', () => {
        const asset1: SteamInventoryAsset = require('../../../test/data/inventory/assets/170676678_253068381.json');
        const asset2: SteamInventoryAsset = require('../../../test/data/inventory/assets/172726297_93973071.json');
        expect(getInventoryDescriptionId(asset1)).toEqual(getInventoryDescriptionId(asset1));
        expect(getInventoryDescriptionId(asset2)).toEqual(getInventoryDescriptionId(asset2));
    });

    it('asset id should match description id', () => {
        const asset: SteamInventoryAsset = require('../../../test/data/inventory/assets/170676678_253068381.json');
        const description: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/170676678_253068381.json');
        expect(getInventoryDescriptionId(asset)).toEqual(getInventoryDescriptionId(description));
    });

});
