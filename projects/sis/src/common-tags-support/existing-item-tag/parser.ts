import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { CommonExistingItemTagSisTag } from './existing-item-tag';


@Injectable()
export class CommonExistingItemTagParserManagerPlugin implements TagParsersManagerPlugin {

    parse(description: SteamInventoryDescription): Observable<CommonExistingItemTagSisTag[]> {
        if (description && description.tags && description.tags.length) {
            return of(description.tags.map(tag => {
                return {
                    kind:         SisCommonTags.KindEnum.ExistingItemTag,
                    categoryName: tag.localized_category_name,
                    name:         tag.localized_tag_name,
                    color:        tag.color,
                };
            }));
        }

        return EMPTY_TAGS;
    }

}
