import { SisTag } from '../../tag/tag';
import { SisCommonTags } from '../common';


export interface CommonTradableSisTag extends SisTag {
    kind: SisCommonTags.KindEnum.Name;
}
