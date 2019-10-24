import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
    SteamClient, createPersonsInventoryResultFactory, PersonsDataSource, PersonsMemoizedIterator,
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

    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: PersonsDataSource = new SISBFPersonsDataSource(this._document);


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                @Inject(DOCUMENT) private _document: Document) {
    }


    onSearch() {
        console.log('search', this._inputs.value);
    }

    onLoadInventories() {
        const iterator = new PersonsMemoizedIterator(
            this._dataSource,
            createPersonsInventoryResultFactory(this._steamClient, this._inputs.value.appId, this._inputs.value.contextId),
        );
        this._inventoriesSubscription = iterator
            .getResults()
            .pipe(takeUntil(this._inputs.valueChanges))
            .subscribe(console.log);
    }


    get inputs(): FormGroup {
        return this._inputs;
    }


    ngOnDestroy() {
        this._inventoriesSubscription.unsubscribe();
    }

}
