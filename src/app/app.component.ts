import { Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {
    SteamClient, createPersonsInventoryResultFactory, PersonsDataSource, PersonsMemoizedIterator,
    PersonsIterationsResults, PersonInventoryResult,
} from 'sis';

import { STEAM_MAX_RPM } from './app-config';
import { SISBFPersonsDataSource } from './persons/persons-data-source';


@Component({
    selector: 'sisbf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnDestroy {

    readonly STEAM_MAX_RPM = STEAM_MAX_RPM;

    private _query: FormControl = this._fb.control('');

    private _app: FormGroup = this._fb.group({
        appId:     this._fb.control('', Validators.required),
        contextId: this._fb.control('', Validators.required),
    });

    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: PersonsDataSource = new SISBFPersonsDataSource(this._document);

    private _active: boolean = false;
    private _results: PersonsIterationsResults<PersonInventoryResult> | null = null;


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                @Inject(DOCUMENT) private _document: Document) {
    }


    onSearch() {
        console.log('search', this._app.value);
    }

    onLoadInventories() {
        this._active = true;
        this._results = null;
        this._inventoriesSubscription = new PersonsMemoizedIterator(
                this._dataSource,
                createPersonsInventoryResultFactory(this._steamClient, this._app.value.appId, this._app.value.contextId),
            )
            .getResults()
            .pipe(
                finalize(() => {
                    this._active = false;
                }),
                takeUntil(this._app.valueChanges),
            )
            .subscribe(
                results => this._results = results,
            );
    }


    get results(): PersonsIterationsResults<PersonInventoryResult> | null {
        return this._results;
    }
    get active(): boolean {
        return this._active;
    }
    get query(): FormControl {
        return this._query;
    }
    get app(): FormGroup {
        return this._app;
    }


    ngOnDestroy() {
        this._inventoriesSubscription.unsubscribe();
    }

}
