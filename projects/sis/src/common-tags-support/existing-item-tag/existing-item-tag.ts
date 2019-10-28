import { SisTag } from '../../tag/tag';
import { SisCommonTags } from '../common';


export interface CommonExistingItemTagSisTag extends SisTag {
    kind: SisCommonTags.KindEnum.ExistingItemTag;
    color?: string;
}
