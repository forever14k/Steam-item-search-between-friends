import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { SIS_COMMON_TAGS_L10N } from '../l10n';
import { CommonNameSisTag } from './name';


@Injectable()
export class CommonNameTagParserManagerPlugin implements TagParsersManagerPlugin {

    parse(description: SteamInventoryDescription): Observable<CommonNameSisTag[]> {
        if (description && description.market_name) {
            return of([{
                kind:         SisCommonTags.KindEnum.Name,
                categoryName: SIS_COMMON_TAGS_L10N.name.categoryName,
                name:         description.market_name,
            }]);
        }

        return EMPTY_TAGS;
    }

}
