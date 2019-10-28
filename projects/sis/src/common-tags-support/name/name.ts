import { SisTag } from '../../tag/tag';
import { SisCommonTags } from '../common';


export interface CommonNameSisTag extends SisTag {
    kind: SisCommonTags.KindEnum.Name;
}
