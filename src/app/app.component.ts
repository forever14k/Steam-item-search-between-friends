import { Subscription } from 'rxjs';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    SteamClient, SteamItemSearchContext, SteamPersonsDataSource,
} from 'sis';

import { SISBFPersonsDataSource } from './persons/persons-data-source';


@Component({
    selector: 'sisbf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnDestroy {

    private _inputs: FormGroup = this._fb.group({
        query:     this._fb.control(''),
        appId:     this._fb.control('', Validators.required),
        contextId: this._fb.control('', Validators.required),
    });

    private _appChangesSubscription: Subscription = Subscription.EMPTY;
    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: SteamPersonsDataSource = new SISBFPersonsDataSource(this._document);


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                @Inject(DOCUMENT) private _document: Document) {

        this._appChangesSubscription = this._inputs.valueChanges.subscribe(
            () => {
                if (this._inventoriesSubscription) {
                    this._inventoriesSubscription.unsubscribe();
                }
            },
        );

    }


    onSearch() {
        console.log('search', this._inputs.value);
    }

    onLoadInventories() {
        const context = new SteamItemSearchContext(
            this._steamClient, this._dataSource,
            this._inputs.value.appId, this._inputs.value.contextId,
        );
        this._inventoriesSubscription = context.getInventories().subscribe(console.log);
    }


    get inputs(): FormGroup {
        return this._inputs;
    }


    ngOnDestroy() {
        this._appChangesSubscription.unsubscribe();
        this._inventoriesSubscription.unsubscribe();
    }

}
