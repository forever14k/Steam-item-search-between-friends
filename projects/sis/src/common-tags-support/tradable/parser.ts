import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryBoolean, SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { SIS_COMMON_TAGS_L10N } from '../l10n';
import { CommonTradableSisTag } from './tradable';


@Injectable()
export class CommonTradableTagParserManagerPlugin implements TagParsersManagerPlugin {

    parse(description: SteamInventoryDescription): Observable<CommonTradableSisTag[]> {
        if (description && description.market_name) {
            return of([{
                kind:         SisCommonTags.KindEnum.Name,
                categoryName: SIS_COMMON_TAGS_L10N.tradable.categoryName,
                name:         description.tradable === SteamInventoryBoolean.TRUE
                                ? SIS_COMMON_TAGS_L10N.tradable.options.yes
                                : SIS_COMMON_TAGS_L10N.tradable.options.no,
            }]);
        }

        return EMPTY_TAGS;
    }

}
