import { SteamInventoryV1Description } from '../../../steam';
import { SteamItemSearchEntry, SteamItemSearchTagCategory } from '../../../common';
import { DescriptionMiddleware } from '../../description-middleware';


export function createColorDescriptionTagMiddleware(config: CreateColorDescriptionTagMiddlewareConfig): DescriptionMiddleware {
    return (description: Readonly<SteamInventoryV1Description>): Partial<SteamItemSearchEntry> | null => {
        if (description && description.tags) {
            return config.tagCategoryNames.reduce(
                (item: Partial<SteamItemSearchEntry> | null, next: string, index: number, array: string[]) => {
                    if (!item) {
                        const tag = description.tags.find(tag => tag.category_name === next);
                        if (tag && tag.color !== undefined && config.excludeTagNames.indexOf(tag.name) !== -1) {
                            return {
                                tags: [{
                                    category: SteamItemSearchTagCategory.COLOR,
                                    name: tag.color,
                                    color: tag.color,

                                    meta: {
                                        forTooltip: false,
                                        forFilter: false,
                                    },
                                }],
                            };
                        }
                    }
                },
                null
            )
        }
        return null;
    };
}

export interface CreateColorDescriptionTagMiddlewareConfig {
    tagCategoryNames: string[];
    excludeTagNames: string[];
}