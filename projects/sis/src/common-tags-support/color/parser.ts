import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { SIS_COMMON_TAGS_L10N } from '../l10n';
import { CommonColorSisTag } from './color';


enum TagCategory {
    Category = 'Category',
    Quality  = 'Quality',
    Rarity   = 'Rarity',
}

enum TagColor {
    Standard = 'Standard',
}


@Injectable()
export class CommonColorTagParserManagerPlugin implements TagParsersManagerPlugin {

    private static COLORS_CATEGORIES: string[] = [
        TagCategory.Category,
        TagCategory.Rarity,
        TagCategory.Quality,
    ];

    private static EXCLUDE_COLORS_NAMES: Set<string> = new Set([
        TagColor.Standard,
    ]);


    parse(description: SteamInventoryDescription): Observable<CommonColorSisTag[]> {
        if (description && description.tags && description.tags.length) {
            const tags = new Map(description.tags.map(tag => [ tag.localized_category_name, tag ]));
            for (const colorCategory of CommonColorTagParserManagerPlugin.COLORS_CATEGORIES) {
                const tag = tags.get(colorCategory);
                if (tag && tag.color !== undefined
                    && !CommonColorTagParserManagerPlugin.EXCLUDE_COLORS_NAMES.has(tag.localized_tag_name)) {

                    return of([{
                        kind:         SisCommonTags.KindEnum.Color,
                        categoryName: SIS_COMMON_TAGS_L10N.color.categoryName,
                        name:         tag.color ? `#${tag.color}` : undefined,
                    }]);
                }
            }
        }

        return EMPTY_TAGS;
    }

}
