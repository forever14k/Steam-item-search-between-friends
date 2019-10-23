import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    SteamItemSearchContext, SteamPersonsDataSource, SteamClient
} from 'sis';

import { SISBFPersonsDataSource } from './persons';


@Component({
    selector: 'sisbf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {

    private _inputs: FormGroup = this._fb.group({
        query:     this._fb.control(''),
        appId:     this._fb.control('', Validators.required),
        contextId: this._fb.control('', Validators.required),
    });

    private _dataSource: SteamPersonsDataSource = new SISBFPersonsDataSource(this._document);


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                @Inject(DOCUMENT) private _document: Document) {
    }


    onSearch() {
        console.log('search', this._inputs.value);
    }

    onLoadInventories() {
        const context = new SteamItemSearchContext(
            this._steamClient, this._dataSource,
            this._inputs.value.appId, this._inputs.value.contextId,
        );
        const inventories = context.getInventories();
        inventories.subscribe(console.log);
    }


    get inputs(): FormGroup {
        return this._inputs;
    }
}
