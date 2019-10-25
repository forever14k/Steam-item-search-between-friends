import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryBoolean, SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { CommonTradableSisTag } from './tradable';


@Injectable()
export class CommonTradableTagParserManagerPlugin implements TagParsersManagerPlugin {

    parse(description: SteamInventoryDescription): Observable<CommonTradableSisTag[]> {
        if (description && description.market_name) {
            return of([{
                kind: SisCommonTags.KindEnum.Name,
                tradable: description.tradable === SteamInventoryBoolean.TRUE,
            }]);
        }

        return EMPTY_TAGS;
    }

}
