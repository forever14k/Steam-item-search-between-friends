import { Observable, Subject, Subscription } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Component, HostBinding, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    SteamClient, IterationsResults, SteamPerson, MemoizedIterator, SisSettingsService,
    SisSettings, SisTag, TagParsersManager, SisCommonTags, CommonNameSisTag,
} from 'sis';

import { SISBF_APP_L10N } from './app.l10n';
import { steamPersonTrackBy } from './persons-inventories/person-iterator-track-by';
import { SteamPersonsIteratorDataSource } from './persons-inventories/persons-iterator-data-source';

import {
    PersonInventoryResult, createSteamPersonInventoryResultFactory,
} from './persons-inventories/persons-inventories-iterator-result-factory';
import { ParsedSteamInventory, parseInventories } from './persons-inventories/utils/parse-inventories-items';
import {
    getInventoriesFiltersScheme, InventoriesFiltersScheme,
} from './persons-inventories/utils/get-inventories-filters-scheme';
import { filterInventories, ParsedInventoryItemsFilter } from './persons-inventories/utils/filter-inventories';
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


    private _settingsSubscription: Subscription = Subscription.EMPTY;
    private _inventoriesSubscription: Subscription = Subscription.EMPTY;
    private _dataSource: SteamPersonsIteratorDataSource = new SteamPersonsIteratorDataSource(this._document);
    private _onSearch: Subject<void> = new Subject();
    private _inventoryItemsFilter: Observable<ParsedInventoryItemsFilter>;

    private _iterator: MemoizedIterator<SteamPerson, PersonInventoryResult> | null = null;
    private _results: IterationsResults<SteamPerson, PersonInventoryResult> | null = null;
    private _filteredResults: ParsedSteamInventory[] | null = null;


    constructor(private _fb: FormBuilder, private _steamClient: SteamClient,
                private _settings: SisSettingsService, private _tagParser: TagParsersManager,
                @Inject(DOCUMENT) private _document: Document) {

        this._settingsSubscription = this._settings.getSettings().subscribe(
            (settings: SisSettings | null) => this._app.setValue(settings || {}, { emitEvent: false }),
        );

        this._settingsSubscription.add(
            this._app.valueChanges.subscribe(
                (settings: SisSettings | null) => {
                    this._settings.setSettings(settings);
                    this._inventoriesSubscription.unsubscribe();
                    this._results = null;
                    this._iterator = null;
                    this._filters = this._fb.group({});
                    this._name = this._fb.control('');
                    this._filtersScheme = null;
                },
            ),
        );

        this._inventoryItemsFilter = createParsedInventoryItemsFilter(this._onSearch.pipe(
            map(() => {
                const name = (this._name.value as string || '').toLowerCase();
                return {
                    ...this._filters.value ? this._filters.value : {},
                    [SisCommonTags.KindEnum.Name]: (tag: CommonNameSisTag) => {
                        return !name || (tag.name && tag.name.toLowerCase().includes(name));
                    },
                };
            }),
        ));
    }


    onSearch() {
        this._onSearch.next();
    }

    onLoadInventories() {
        if (this._results && this._results.results.length === this._results.total) {
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

        this._inventoriesSubscription = new Subscription();

        this._inventoriesSubscription.add(
            results.subscribe(result => this._results = result),
        );

        this._inventoriesSubscription.add(
            getInventoriesFiltersScheme(parsedInventories).subscribe(scheme => {
                this._filtersScheme = scheme;
                for (const category of scheme.categories) {
                    if (!this._excludeFilters.has(category.kind) && !this._filters.contains(category.categoryName)) {
                        this._filters.registerControl(category.categoryName, this._fb.control(null));
                    }
                }
                console.log(scheme, this._filters);
            }),
        );

        this._inventoriesSubscription.add(
            filterInventories(parsedInventories, this._inventoryItemsFilter).subscribe(
                filtered => this._filteredResults = filtered,
            ),
        );
    }


    get filteredResults(): ParsedSteamInventory[] | null {
        return this._filteredResults;
    }
    get results(): IterationsResults<SteamPerson, PersonInventoryResult> | null {
        return this._results;
    }
    get active(): boolean {
        return !this._inventoriesSubscription.closed;
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
        this._settingsSubscription.unsubscribe();
        this._inventoriesSubscription.unsubscribe();
    }

}
