import { SisTag } from '../../tag/tag';
import { SisCommonTags } from '../common';


export interface CommonColorSisTag extends SisTag {
    kind: SisCommonTags.KindEnum.Color;
}
