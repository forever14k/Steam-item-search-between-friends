import { SteamInventoryDescription } from '../../steam/inventory/inventory';
import { SisTag } from '../../tag/tag';

import { CommonExistingItemTagParserManagerPlugin } from './parser';


describe('CommonNameTagParserManagerPlugin', () => {

    it('should parse existing item tags', () => {
        const parser = new CommonExistingItemTagParserManagerPlugin();
        const description: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/170676678_253068381.json');

        let parsedResult: SisTag[];
        parser.parse(description).subscribe(result => parsedResult = result);
        expect(parsedResult.length).toBeGreaterThan(0);

        console.log(parsedResult);
    });

});
