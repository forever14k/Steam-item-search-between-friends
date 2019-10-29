import { Subscription } from 'rxjs';
import { finalize, publishReplay, refCount, takeUntil } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    SteamClient, IterationsResults, SteamPerson, MemoizedIterator, TagParsersManager, SisTag,
} from 'sis';

import { STEAM_MAX_RPM } from './app-config';
import { steamPersonTrackBy } from './persons-inventories/person-iterator-track-by';
import { SteamPersonsIteratorDataSource } from './persons-inventories/persons-iterator-data-source';
import {
    PersonInventoryResult, createSteamPersonInventoryResultFactory,
} from './persons-inventories/persons-inventories-iterator-result-factory';

import { getNewInventories } from './persons-inventories/utils/get-new-inventories';
import { ParsedSteamInventory, parseInventoryItems } from './persons-inventories/utils/parse-inventories-items';
import { collectInventories } from './persons-inventories/utils/collect-inventories';
import { getUniqueCategories } from './persons-inventories/utils/get-unique-categories';
import { filterAllParsedInventories } from './persons-inventories/utils/filter-all-parsed-inventories';


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

    private _filters: FormGroup = this._fb.group({});

    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: SteamPersonsIteratorDataSource = new SteamPersonsIteratorDataSource(this._document);

    private _active: boolean = false;
    private _results: IterationsResults<SteamPerson, PersonInventoryResult> | null = null;
    private _categories: Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>> | null = null;
    private _filtered: ParsedSteamInventory[] | null = null;


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                private _tagParser: TagParsersManager,
                @Inject(DOCUMENT) private _document: Document) {
    }


    onSearch() {
        console.log('search', this._app.value);
    }

    onLoadInventories() {
        this._active = true;
        this._results = null;
        this._categories = null;
        this._filters = this._fb.group({});
        this._filtered = null;

        const factory = createSteamPersonInventoryResultFactory(this._steamClient, this._app.value.appId, this._app.value.contextId);
        const results =  new MemoizedIterator(this._dataSource, factory, steamPersonTrackBy)
            .getResults()
            .pipe(
                finalize(() => {
                    this._active = false;
                }),
                publishReplay(1), refCount(),
                takeUntil(this._app.valueChanges),
            );

        this._inventoriesSubscription.unsubscribe();
        this._inventoriesSubscription = new Subscription();


        const newInventories = getNewInventories(results);
        const parsedInventories = parseInventoryItems(newInventories, this._tagParser);
        const allParsedInventories = collectInventories(parsedInventories);

        const filteredParsedInventories = filterAllParsedInventories(allParsedInventories, this._filters.valueChanges);
        const uniqueCategories = getUniqueCategories(parsedInventories);


        this._inventoriesSubscription.add(
            results.subscribe(result => {
                this._results = result;
            }),
        );

        this._inventoriesSubscription.add(
            uniqueCategories.subscribe(categories => {
                this._categories = categories;
                for (const category of categories.keys()) {
                    if (!this._filters.contains(category)) {
                        this._filters.registerControl(category, this._fb.control(null));
                    }
                }
            }),
        );

        this._inventoriesSubscription.add(
            filteredParsedInventories.subscribe(
                filtered => {
                    this._filtered = filtered;
                    console.log(filtered);
                },
            ),
        );
    }


    get filtered(): ParsedSteamInventory[] | null {
        return this._filtered;
    }
    get filters(): FormGroup {
        return this._filters;
    }
    get categories(): Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>> | null {
        return this._categories;
    }
    get results(): IterationsResults<SteamPerson, PersonInventoryResult> | null {
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
