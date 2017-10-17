import { SteamInventoryV1Description } from '../../../steam';
import { SisbfItem, SisbfItemTagCategory } from '../../../sisbf';
import { DescriptionMiddleware } from '../../description-middleware';


export function createColorDescriptionTagMiddleware(config: CreateColorDescriptionTagMiddlewareConfig): DescriptionMiddleware {
    return (description: Readonly<SteamInventoryV1Description>): Partial<SisbfItem> | null => {
        if (description && description.tags) {
            return config.tagCategoryNames.reduce(
                (item: Partial<SisbfItem> | null, next: string, index: number, array: string[]) => {
                    if (!item) {
                        const tag = description.tags.find(tag => tag.category_name === next);
                        if (tag && tag.color !== undefined && config.excludeTagNames.indexOf(tag.name) !== -1) {
                            return {
                                tags: [{
                                    category: SisbfItemTagCategory.COLOR,
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