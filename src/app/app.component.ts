import { forkJoin, of, Subscription } from 'rxjs';
import { finalize, publishReplay, refCount, scan, switchMap, takeUntil } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import {
    SteamClient, PersonInventoryResult, IterationsResults, SteamPerson, createSteamPersonInventoryResultFactory,
    MemoizedIterator, steamPersonTrackBy, TagParsersManager, getInventoryEntityId, SteamInventory, SisTag,
} from 'sis';

import { STEAM_MAX_RPM } from './app-config';
import { SteamPersonsIteratorDataSource } from './persons/persons-data-source';


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
    private _dataSource: SteamPersonsIteratorDataSource = new SteamPersonsIteratorDataSource(this._document);

    private _active: boolean = false;
    private _results: IterationsResults<SteamPerson, PersonInventoryResult> | null = null;


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

        this._inventoriesSubscription = results.subscribe(result => {
            this._results = result;
        });

        this._inventoriesSubscription.add(results
            .pipe(
                switchMap((result: IterationsResults<SteamPerson, SteamInventory>) => {
                    if (result.results && result.results.length) {
                        const lastResult = result.results[ result.results.length - 1 ];
                        if (!(lastResult.result instanceof Error)) {
                            const inventory = lastResult.result;
                            if (inventory.assets && inventory.assets.length && inventory.descriptions && inventory.descriptions.length) {
                                const order = inventory.assets.map(asset => getInventoryEntityId(asset));
                                const assets = new Map(inventory.assets.map(asset => [ getInventoryEntityId(asset), asset ]));
                                const descriptions = new Map(inventory.descriptions.map(description =>
                                    [ getInventoryEntityId(description), description ],
                                ));
                                return forkJoin(order.map(id => this._tagParser.parse(descriptions.get(id), assets.get(id))));
                            }
                        }
                    }

                    return of([]);
                }),
                scan(
                    (categories, containers: SisTag[][]) => {
                        if (containers && containers.length) {
                            for (const tags of containers) {
                                if (tags && tags.length) {
                                    for (const tag of tags) {
                                        let category = categories.get(tag.categoryName);
                                        if (!category) {
                                            category = [];
                                        }
                                        if (!category.includes(tag.name)) {
                                            category.push(tag.name);
                                        }
                                        categories.set(tag.categoryName, category);
                                    }
                                }
                            }
                        }
                        return categories;
                    },
                    new Map<string, any[]>(),
                ),
            )
            .subscribe(console.log));
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
