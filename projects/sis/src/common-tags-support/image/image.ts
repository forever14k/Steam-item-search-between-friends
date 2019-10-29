import { SisTag } from '../../tag/tag';
import { SisCommonTags } from '../common';


export interface CommonImageSisTag extends SisTag {
    kind: SisCommonTags.KindEnum.Image;
}
