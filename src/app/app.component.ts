import { combineLatest, EMPTY, forkJoin, Observable, of, Subscription } from 'rxjs';
import { finalize, map, publishReplay, refCount, scan, switchMap, takeUntil } from 'rxjs/operators';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    SteamClient, IterationsResults, SteamPerson, MemoizedIterator, TagParsersManager, getInventoryEntityId,
    SteamInventory, SisTag, SteamInventoryAsset, SteamInventoryDescription,
} from 'sis';

import { STEAM_MAX_RPM } from './app-config';
import { steamPersonTrackBy } from './persons-inventories/person-iterator-track-by';
import { SteamPersonsIteratorDataSource } from './persons-inventories/persons-iterator-data-source';
import {
    PersonInventoryResult, createSteamPersonInventoryResultFactory,
} from './persons-inventories/persons-inventories-iterator-result-factory';


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


        const inventories: Observable<[ SteamPerson, SteamInventory ]> = results.pipe(
            switchMap((result: IterationsResults<SteamPerson, SteamInventory>) => {
                if (result.results && result.results.length) {
                    const lastResult = result.results[ result.results.length - 1 ];
                    if (!(lastResult.result instanceof Error)) {
                        return of([ lastResult.entity, lastResult.result ] as [ SteamPerson, SteamInventory ]);
                    }
                }
                return EMPTY;
            }),
        );

        const items: Observable<[ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ]> = inventories.pipe(
            switchMap(([ person, inventory ]) => {
                if (inventory.assets && inventory.assets.length && inventory.descriptions && inventory.descriptions.length) {
                    const order = inventory.assets.map(asset => getInventoryEntityId(asset));
                    const assets = new Map(inventory.assets.map(asset => [ getInventoryEntityId(asset), asset ]));
                    const descriptions = new Map(inventory.descriptions.map(description =>
                        [ getInventoryEntityId(description), description ],
                    ));
                    return forkJoin(
                            order.map(id => {
                                const asset = assets.get(id);
                                const description = descriptions.get(id);
                                return this._tagParser.parse(descriptions.get(id), assets.get(id)).pipe(
                                    map(tags => [
                                        asset, description, tags,
                                    ] as [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ]),
                                );
                            }),
                        )
                        .pipe(
                            map(entities => [
                                person, entities,
                            ] as [ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ]),
                        );
                }

                return EMPTY;
            }),
        );

        const allItems: Observable<[ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ][]> = items.pipe(
            scan(
                (result: [ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ][],
                 items: [ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ]) => {
                    result.push(items);
                    return result;
                },
                [],
            ),
        );

        function isTagsMatchesFilters(tags: SisTag[], filters: { [key: string]: null | SisTag['name'][] }): boolean {
            const filtersKeys = Object.keys(filters);
            if (!filtersKeys || !filtersKeys.length) {
                return true;
            }
            return filtersKeys.every(filterKey => {
                const filter = filters[filterKey];
                if (!filter || !filter.length) {
                    return true;
                }
                return isTagsMatchesFilter(tags, filterKey, filter);
            });
        }

        function isTagsMatchesFilter(tags: SisTag[], categoryName: SisTag['categoryName'], names: SisTag['name'][]): boolean {
            return tags.some(tag => isTagMatchesFilter(tag, categoryName, names));
        }

        function isTagMatchesFilter(tag: SisTag, categoryName: SisTag['categoryName'], names: SisTag['name'][]): boolean {
            return categoryName === tag.categoryName && names.includes(tag.name);
        }

        const filteredItems: Observable<[ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ][]> =
            combineLatest(allItems, this._filters.valueChanges).pipe(
                map(([ allItems, filters ]) => {
                    return allItems
                        .map(([ person, items]) => {
                            return [
                                person, items.filter(([ , , tags ]) => isTagsMatchesFilters(tags, filters) ),
                            ] as [ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ];
                        })
                        .filter(([ , items ]) => Boolean(items.length));
                }),
            );

        const uniqueCategories: Observable<Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>>> = items.pipe(
            scan(
                (result, [ , entities ]: [ SteamPerson, [ SteamInventoryAsset, SteamInventoryDescription, SisTag[] ][] ]) => {
                    if (entities && entities.length) {
                        for (const [ , , tags ] of entities) {
                            if (tags && tags.length) {
                                for (const tag of tags) {
                                    let category = result.get(tag.categoryName);
                                    if (!category) {
                                        category = new Map();
                                    }
                                    if (!category.has(tag.name)) {
                                        category.set(tag.name, tag);
                                    }
                                    result.set(tag.categoryName, category);
                                }
                            }
                        }
                    }
                    return result;
                },
                new Map<SisTag['categoryName'], Map<SisTag['name'], SisTag>>(),
            ),
        );


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
            filteredItems.subscribe(console.log),
        );
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
