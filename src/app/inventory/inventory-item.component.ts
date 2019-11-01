import { Component, Input, OnChanges } from '@angular/core';
import { SisTag } from 'sis';

import { ParsedSteamInventoryItem } from '../persons-inventories/utils/parse-inventories-items';
import { SisCommonTags } from '../../../projects/sis/src/common-tags-support/common';


@Component({
    selector: 'sisbf-inventory-item',
    templateUrl: './inventory-item.component.html',
    styleUrls: ['./inventory-item.component.less'],
})
export class InventoryItemComponent implements OnChanges {

    @Input() item: ParsedSteamInventoryItem;

    @Input() excludeTags: Set<SisTag['kind']>;

    private _imageUrl: string | null;
    private _color: string | null;


    ngOnChanges() {
        this._imageUrl = null;
        this._color = null;

        if (this.item) {
            const imageTag = this.item.tags.find(tag => tag.kind === SisCommonTags.KindEnum.Image);
            if (imageTag) {
                this._imageUrl = imageTag.name;
            }

            const colorTag = this.item.tags.find(tag => tag.kind === SisCommonTags.KindEnum.Color);
            if (colorTag) {
                this._color = colorTag.name;
            }
        }
    }


    get color(): string | null {
        return this._color;
    }
    get imageUrl(): string | null {
        return this._imageUrl;
    }

}
