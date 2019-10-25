import { SteamInventoryDescription } from '../../steam/inventory/inventory';
import { SisTag } from '../../tag/tag';

import { CommonTradableTagParserManagerPlugin } from './parser';


describe('CommonTradableTagParserManagerPlugin', () => {

    it('should parse tradable tags', () => {
        const parser = new CommonTradableTagParserManagerPlugin();
        const description: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/170676678_253068381.json');

        let parsedResult: SisTag[];
        parser.parse(description).subscribe(result => parsedResult = result);
        expect(parsedResult.length).toBeGreaterThan(0);
    });

});
