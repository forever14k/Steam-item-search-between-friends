import { SteamInventoryDescription } from '../../steam/inventory/inventory';
import { SisTag } from '../../tag/tag';

import { CommonNameTagParserManagerPlugin } from './parser';


describe('CommonNameTagParserManagerPlugin', () => {

    it('should parse name tags', () => {
        const parser = new CommonNameTagParserManagerPlugin();
        const description: SteamInventoryDescription = require('../../../test/data/inventory/descriptions/170676678_253068381.json');

        let parsedResult: SisTag[];
        parser.parse(description).subscribe(result => parsedResult = result);
        expect(parsedResult.length).toBeGreaterThan(0);
    });

});
