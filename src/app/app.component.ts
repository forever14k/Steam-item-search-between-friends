import { Observable, Subject, Subscription, EMPTY, Unsubscribable, concat, of } from 'rxjs';
import { map, publishReplay, refCount, switchMap, takeUntil } from 'rxjs/operators';
import { Component, HostBinding, Inject, OnDestroy, TrackByFunction } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    SteamClient, IterationsResults, SteamPerson, MemoizedIterator, SisSettingsService,
    SisSettings, SisTag, TagParsersManager, SisCommonTags, CommonNameSisTag, getInventoryAssetId,
} from 'sis';

import { SISBF_APP_L10N } from './app.l10n';
import { steamPersonTrackBy } from './persons-inventories/person-iterator-track-by';
import { SteamPersonsIteratorDataSource } from './persons-inventories/persons-iterator-data-source';

import {
    PersonInventoryResult, createSteamPersonInventoryResultFactory,
} from './persons-inventories/persons-inventories-iterator-result-factory';
import {
    ParsedSteamInventory, ParsedSteamInventoryItem, parseInventories
} from './persons-inventories/utils/parse-inventories-items';
import {
    getInventoriesFiltersScheme, InventoriesFiltersScheme,
} from './persons-inventories/utils/get-inventories-filters-scheme';
import { filterInventories } from './persons-inventories/utils/filter-inventories';
import { createParsedInventoryItemsFilter } from './persons-inventories/utils/inventory-items-filter';


@Component({
    selector: 'sisbf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnDestroy {

    @HostBinding('class.sisbf-app') readonly className = true;

    readonly SISBF_APP_L10N = SISBF_APP_L10N;


    private _app: FormGroup = this._fb.group({
        appId:     this._fb.control('', Validators.required),
        contextId: this._fb.control('', Validators.required),
    });

    private _name: FormControl = this._fb.control('');

    private _filters: FormGroup = this._fb.group({});
    private _excludeFilters: Set<SisTag['kind']> = new Set([
        SisCommonTags.KindEnum.Name,
        SisCommonTags.KindEnum.Image,
        SisCommonTags.KindEnum.Color,
    ]);
    private _filtersScheme: InventoriesFiltersScheme | null = null;


    private _unsubscribeOnDestroy: Unsubscribable[] = [];
    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: SteamPersonsIteratorDataSource = new SteamPersonsIteratorDataSource(this._document);
    private _onSearch: Subject<void> = new Subject();

    private _parsedInventories: Subject<Observable<ParsedSteamInventory> | null> = new Subject();

    private _iterator: MemoizedIterator<SteamPerson, PersonInventoryResult> | null = null;
    private _results: IterationsResults<SteamPerson, PersonInventoryResult> | null = null;
    private _filteredResults: ParsedSteamInventory[] | null = null;


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                private _settings: SisSettingsService, private _tagParser: TagParsersManager,
                @Inject(DOCUMENT) private _document: Document) {

        this._unsubscribeOnDestroy = [
            this._settings.getSettings().subscribe(
                (settings: SisSettings | null) => this._app.setValue(settings || {}, { emitEvent: false }),
            ),

            this._app.valueChanges.subscribe(
                (settings: SisSettings | null) => {
                    this._settings.setSettings(settings);
                    this._inventoriesSubscription.unsubscribe();
                    this._results = null;
                    this._iterator = null;
                    this._name = this._fb.control('');
                    this._filters = this._fb.group({});
                    this._filtersScheme = null;
                    this._filteredResults = null;
                },
            ),

            concat(of(null), this._app.valueChanges)
                .pipe(
                    switchMap(() => filterInventories(
                        this._parsedInventories.pipe(
                            switchMap(parsedInventories => parsedInventories || EMPTY),
                        ),
                        createParsedInventoryItemsFilter(this._onSearch.pipe(
                            map(() => {
                                const name = (this._name.value as string || '').toLowerCase();
                                return {
                                    ...this._filters.value ? this._filters.value : {},
                                    [SisCommonTags.KindEnum.Name]: (tag: CommonNameSisTag) => {
                                        return !name || (tag.name && tag.name.toLowerCase().includes(name));
                                    },
                                };
                            }),
                        )),
                    )),
                )
                .subscribe(
                    filtered => this._filteredResults = filtered,
                ),
        ];
    }


    onSearch() {
        this._onSearch.next();
    }

    onLoadInventories() {
        if (this.completed) {
            return;
        }

        if (!this._inventoriesSubscription.closed) {
            this._inventoriesSubscription.unsubscribe();
            return;
        }

        if (!this._iterator) {
            const factory = createSteamPersonInventoryResultFactory(this._steamClient, this._app.value.appId, this._app.value.contextId);
            this._iterator = new MemoizedIterator(this._dataSource, factory, steamPersonTrackBy);
        }

        const results = this._iterator.getResults().pipe(
            publishReplay(1), refCount(),
        );
        const parsedInventories = parseInventories(results, this._tagParser);

        const unsubscribe = new Subject();
        this._inventoriesSubscription = new Subscription(() => unsubscribe.next());

        results
            .pipe(takeUntil(unsubscribe))
            .subscribe(result => this._results = result);


        getInventoriesFiltersScheme(parsedInventories)
            .pipe(takeUntil(unsubscribe))
            .subscribe(scheme => {
                scheme = {
                    categories: scheme.categories.filter(category => !this._excludeFilters.has(category.kind)),
                };
                this._filtersScheme = scheme;
                for (const category of scheme.categories) {
                    if (!this._filters.contains(category.categoryName)) {
                        this._filters.registerControl(category.categoryName, this._fb.control(null));
                    }
                }
            });

        this._parsedInventories.next(parsedInventories.pipe(takeUntil(unsubscribe)));
    }


    trackParsedSteamInventory: TrackByFunction<ParsedSteamInventory> =
        (_, inventory) => (inventory.person.id64)
    trackParsedSteamInventoryItem: TrackByFunction<ParsedSteamInventoryItem> =
        (_, item) => getInventoryAssetId(item.asset)


    get filteredResults(): ParsedSteamInventory[] | null {
        return this._filteredResults;
    }
    get results(): IterationsResults<SteamPerson, PersonInventoryResult> | null {
        return this._results;
    }
    get active(): boolean {
        return !this._inventoriesSubscription.closed;
    }
    get completed(): boolean {
        return this._results && this._results.results.length === this._results.total;
    }
    get filtersScheme(): InventoriesFiltersScheme | null {
        return this._filtersScheme;
    }
    get filters(): FormGroup {
        return this._filters;
    }
    get name(): FormControl {
        return this._name;
    }
    get app(): FormGroup {
        return this._app;
    }


    ngOnDestroy() {
        this._inventoriesSubscription.unsubscribe();
        this._unsubscribeOnDestroy.reverse().forEach(subscription => subscription.unsubscribe());
    }

}
