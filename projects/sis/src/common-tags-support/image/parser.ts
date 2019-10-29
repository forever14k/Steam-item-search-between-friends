import { Observable, of } from 'rxjs';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { EMPTY_TAGS, TagParsersManagerPlugin } from '../../tag/tag-parsers-manager';
import { SteamInventoryDescription } from '../../steam/inventory/inventory';

import { SisCommonTags } from '../common';
import { SIS_COMMON_TAGS_L10N } from '../l10n';
import { CommonImageSisTag } from './image';


export const COMMON_IMAGE_TAG_PARSER_MANAGER_PLUGIN_CONFIG =
    new InjectionToken<CommonImageTagParserManagerPluginConfig>('CommonImageTagParserManagerPluginConfig');

export interface CommonImageTagParserManagerPluginConfig {
    imageUrlFactory?(iconUrl?: string): string | undefined;
}

const DEFAULT_COMMON_IMAGE_TAG_PARSER_MANAGER_PLUGIN_CONFIG: CommonImageTagParserManagerPluginConfig = {
    imageUrlFactory: defaultImageUrlFactory,
};


@Injectable()
export class CommonImageTagParserManagerPlugin implements TagParsersManagerPlugin {

    private _config: CommonImageTagParserManagerPluginConfig;

    constructor(@Inject(COMMON_IMAGE_TAG_PARSER_MANAGER_PLUGIN_CONFIG) @Optional() config?: CommonImageTagParserManagerPluginConfig) {
        this._config = {
            ...DEFAULT_COMMON_IMAGE_TAG_PARSER_MANAGER_PLUGIN_CONFIG,
            ...config ? config : {},
        };
    }

    parse(description: SteamInventoryDescription): Observable<CommonImageSisTag[]> {
        if (description && description.icon_url) {
            return of([{
                kind:         SisCommonTags.KindEnum.Image,
                categoryName: SIS_COMMON_TAGS_L10N.image.categoryName,
                name:         this._config.imageUrlFactory(description.icon_url),
            }]);
        }

        return EMPTY_TAGS;
    }




}


function defaultImageUrlFactory(iconUrl?: string): string | undefined {
    if (iconUrl) {
        return `//steamcommunity-a.akamaihd.net/economy/image/${iconUrl}/73fx49f`;
    }
    return undefined;
}
