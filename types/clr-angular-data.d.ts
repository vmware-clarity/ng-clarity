import * as i0 from '@angular/core';
import { OnDestroy, OnInit, OnChanges, EventEmitter, ElementRef, ViewContainerRef, ChangeDetectorRef, SimpleChanges, DoCheck, TemplateRef, IterableDiffers, TrackByFunction, QueryList, AfterContentInit, AfterViewInit, Renderer2, NgZone, EnvironmentInjector, EmbeddedViewRef, AfterViewChecked, Type, Injector } from '@angular/core';
import * as i1 from '@clr/angular/data/datagrid';
import * as i2 from '@clr/angular/data/stack-view';
import * as i3 from '@clr/angular/data/tree-view';
import * as i39 from '@clr/angular/utils';
import { ClrCommonStringsService, IfExpandService, ClrLoadingState, ClrExpandableAnimationDirective, DomAdapter, WillyWonka, OompaLoompa, HeadingLevel } from '@clr/angular/utils';
import { Observable, Subject, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { ModalStackService } from '@clr/angular/modal';
import * as i1$1 from '@clr/angular/popover/common';
import { ClrPopoverPosition, ClrPopoverService, ClrPopoverType } from '@clr/angular/popover/common';
import * as i6 from '@angular/common';
import { NgForOfContext } from '@angular/common';
import * as _clr_angular_data from '@clr/angular/data';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import { Directionality } from '@angular/cdk/bidi';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualForOfContext, ScrollDispatcher, ViewportRuler, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import * as _angular_cdk_overlay from '@angular/cdk/overlay';
import { ClrControlLabel } from '@clr/angular/forms/common';
import * as i40 from '@clr/angular/icon';
import * as i41 from '@clr/angular/forms/input';
import * as i42 from '@clr/angular/forms/radio';
import * as i43 from '@clr/angular/forms/checkbox';
import * as i44 from '@clr/angular/forms/number-input';
import * as i45 from '@clr/angular/forms/select';
import * as i46 from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import * as i47 from '@clr/angular/progress/spinner';

declare class ClrDataModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDataModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDataModule, never, never, [typeof i1.ClrDatagridModule, typeof i2.ClrStackViewModule, typeof i3.ClrTreeViewModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDataModule>;
}

/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
declare enum ClrDatagridSortOrder {
    UNSORTED = 0,
    ASC = 1,
    DESC = -1
}
declare enum ClrDatagridAriaSortOrder {
    UNSORTED = "none",
    ASC = "ascending",
    DESC = "descending"
}

interface ClrDatagridComparatorInterface<T> {
    compare(a: T, b: T): number;
}

interface ClrDatagridFilterInterface<T, S = any> {
    readonly state?: S;
    changes: Observable<any>;
    isActive(): boolean;
    accepts(item: T): boolean;
    equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}

declare class DetailService {
    private readonly modalStackService;
    id: string;
    private preventScroll;
    private toggleState;
    private cache;
    private button;
    private _enabled;
    private _state;
    constructor(modalStackService: ModalStackService);
    get enabled(): boolean;
    set enabled(state: boolean);
    get preventFocusScroll(): boolean;
    set preventFocusScroll(preventScroll: boolean);
    get state(): any;
    get stateChange(): Observable<boolean | null>;
    get isOpen(): boolean;
    open(item: any, button?: HTMLButtonElement): void;
    close(): void;
    returnFocus(): void;
    toggle(item: any, button?: HTMLButtonElement): void;
    isRowOpen(item: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DetailService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DetailService>;
}

declare class StateDebouncer {
    private nbChanges;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    private _change;
    get change(): Observable<void>;
    changeStart(): void;
    changeDone(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateDebouncer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateDebouncer>;
}

declare class Page {
    private stateDebouncer;
    activated: boolean;
    /**
     * Page size, a value of 0 means no pagination
     */
    private _size;
    /**
     * Total items (needed to guess the last page)
     */
    private _totalItems?;
    /**
     * Last page
     */
    private _last;
    /**
     * Current page
     */
    private _current;
    /**
     * The Observable that lets other classes subscribe to page changes
     */
    private _change;
    private preventEmit;
    private _sizeChange;
    constructor(stateDebouncer: StateDebouncer);
    get size(): number;
    set size(size: number);
    get totalItems(): number;
    set totalItems(total: number);
    get last(): number;
    set last(page: number);
    get change(): Observable<number>;
    get sizeChange(): Observable<number>;
    get current(): number;
    set current(page: number);
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem(): number;
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem(): number;
    /**
     * Moves to the previous page if it exists
     */
    previous(): void;
    /**
     * Moves to the next page if it exists
     */
    next(): void;
    /**
     * Resets the page size to 0
     */
    resetPageSize(preventEmit?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Page, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Page>;
}

declare class FiltersProvider<T = any> {
    private _page;
    private stateDebouncer;
    /**
     * This subject is the list of filters that changed last, not the whole list.
     * We emit a list rather than just one filter to allow batch changes to several at once.
     */
    private _change;
    /**
     * List of all filters, whether they're active or not
     */
    private _all;
    constructor(_page: Page, stateDebouncer: StateDebouncer);
    get change(): Observable<ClrDatagridFilterInterface<T>[]>;
    /**
     * Tests if at least one filter is currently active
     */
    hasActiveFilters(): boolean;
    /**
     * Returns a list of all currently active filters
     */
    getActiveFilters(): ClrDatagridFilterInterface<T>[];
    /**
     * Registers a filter, and returns a deregistration function
     */
    add<F extends ClrDatagridFilterInterface<T>>(filter: F): RegisteredFilter<T, F>;
    /**
     * Accepts an item if it is accepted by all currently active filters
     */
    accepts(item: T): boolean;
    private resetPageAndEmitFilterChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<FiltersProvider<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FiltersProvider<any>>;
}
declare class RegisteredFilter<T, F extends ClrDatagridFilterInterface<T>> {
    filter: F;
    unregister: () => void;
    constructor(filter: F, unregister: () => void);
}

declare class Sort<T = any> {
    private stateDebouncer;
    /**
     * Currently active comparator
     */
    private _comparator;
    /**
     * Ascending order if false, descending if true
     */
    private _reverse;
    /**
     * The Observable that lets other classes subscribe to sort changes
     */
    private _change;
    constructor(stateDebouncer: StateDebouncer);
    get comparator(): ClrDatagridComparatorInterface<T>;
    set comparator(value: ClrDatagridComparatorInterface<T>);
    get reverse(): boolean;
    set reverse(value: boolean);
    get change(): Observable<Sort<T>>;
    /**
     * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
     * optional forceReverse input parameter allows to override that toggling behavior by sorting in
     * reverse order if `true`.
     *
     * @memberof Sort
     */
    toggle(sortBy: ClrDatagridComparatorInterface<T>, forceReverse?: boolean): void;
    /**
     * Clears the current sorting order
     */
    clear(): void;
    /**
     * Compares two objects according to the current comparator
     */
    compare(a: T, b: T): number;
    private emitChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<Sort<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Sort<any>>;
}

declare abstract class DatagridFilterRegistrar<T, F extends ClrDatagridFilterInterface<T>> implements OnDestroy {
    private filters;
    /**
     * @NOTEe Type `any` is set here to be able to pass templateStrictMode
     */
    registered: any;
    protected constructor(filters: FiltersProvider<T>);
    get filter(): F;
    ngOnDestroy(): void;
    setFilter(filter: F | RegisteredFilter<T, F>): void;
    deleteFilter(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFilterRegistrar<any, any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridFilterRegistrar<any, any>, never, never, {}, {}, never, never, true, never>;
}

declare class ClrDatagridColumn<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements OnDestroy, OnInit, OnChanges {
    private el;
    private _sort;
    private vcr;
    private detailService;
    private changeDetectorRef;
    private commonStrings;
    filterStringPlaceholder: string;
    filterNumberMaxPlaceholder: string;
    filterNumberMinPlaceholder: string;
    disableUnsort: boolean;
    sortOrderChange: EventEmitter<ClrDatagridSortOrder>;
    filterValueChange: EventEmitter<any>;
    titleContainer: ElementRef<HTMLElement>;
    /**
     * A custom filter for this column that can be provided in the projected content
     */
    customFilter: boolean;
    private _colType;
    private _field;
    /**
     * ClrDatagridComparatorInterface to use when sorting the column
     */
    private _sortBy;
    /**
     * Indicates how the column is currently sorted
     */
    private _sortOrder;
    private _sortDirection;
    private initFilterValue;
    private wrappedInjector;
    /**
     * Subscription to the sort service changes
     */
    private subscriptions;
    private _showSeparator;
    constructor(el: ElementRef<HTMLElement>, _sort: Sort<T>, filters: FiltersProvider<T>, vcr: ViewContainerRef, detailService: DetailService, changeDetectorRef: ChangeDetectorRef, commonStrings: ClrCommonStringsService);
    get isHidden(): boolean;
    get showSeparator(): boolean;
    set showSeparator(value: boolean);
    get colType(): "string" | "number";
    set colType(value: 'string' | 'number');
    get field(): string;
    set field(field: string);
    get sortBy(): ClrDatagridComparatorInterface<T> | string;
    set sortBy(comparator: ClrDatagridComparatorInterface<T> | string);
    get sortOrder(): ClrDatagridSortOrder;
    set sortOrder(value: ClrDatagridSortOrder);
    set updateFilterValue(newValue: string | [number, number]);
    set projectedFilter(custom: any);
    /**
     * Indicates if the column is sortable
     */
    get sortable(): boolean;
    get ariaSort(): ClrDatagridAriaSortOrder;
    get sortDirection(): 'up' | 'down' | null;
    /**
     * @NOTE type `any` here is to let us pass templateStrictMode, because in our code we try to handle
     * two types of filters String and Number with the same variable but both of them work with different
     * format we got an error for casting. We could not cast anything inside the template so to not mess the
     * casting, the last type is set to `any`
     *
     * Orignial types: string | [number, number]
     */
    get filterValue(): any;
    set filterValue(newValue: any);
    get _view(): any;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Sorts the datagrid based on this column
     */
    sort(reverse?: boolean): void;
    private listenForDetailPaneChanges;
    private setFilterToggleAriaLabel;
    private listenForSortingChanges;
    private setupDefaultFilter;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumn<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumn<any>, "clr-dg-column", never, { "filterStringPlaceholder": { "alias": "clrFilterStringPlaceholder"; "required": false; }; "filterNumberMaxPlaceholder": { "alias": "clrFilterNumberMaxPlaceholder"; "required": false; }; "filterNumberMinPlaceholder": { "alias": "clrFilterNumberMinPlaceholder"; "required": false; }; "disableUnsort": { "alias": "clrDgDisableUnsort"; "required": false; }; "colType": { "alias": "clrDgColType"; "required": false; }; "field": { "alias": "clrDgField"; "required": false; }; "sortBy": { "alias": "clrDgSortBy"; "required": false; }; "sortOrder": { "alias": "clrDgSortOrder"; "required": false; }; "updateFilterValue": { "alias": "clrFilterValue"; "required": false; }; }, { "sortOrderChange": "clrDgSortOrderChange"; "filterValueChange": "clrFilterValueChange"; }, ["projectedFilter"], ["clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter", "*"], false, [{ directive: typeof i1$1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

type ClrDatagridItemsIdentityFunction<T> = (item: T) => any;
declare class Items<T = any> {
    private _filters;
    private _sort;
    private _page;
    /**
     * Indicates if the data is currently loading
     */
    loading: boolean;
    /**
     * Subscriptions to the other providers changes.
     */
    private _filtersSub;
    private _sortSub;
    private _pageSub;
    /**
     * Whether we should use smart items for this datagrid or let the user handle
     * everything.
     */
    private _smart;
    /**
     * List of all items in the datagrid
     */
    private _all;
    /**
     * Internal temporary step, which we preserve to avoid re-filtering or re-sorting if not necessary
     */
    private _filtered;
    /**
     * List of items currently displayed
     */
    private _displayed;
    /**
     * The Observable that lets other classes subscribe to items changes
     */
    private _change;
    private _allChanges;
    constructor(_filters: FiltersProvider<T>, _sort: Sort<T>, _page: Page);
    get smart(): boolean;
    get all(): T[];
    set all(items: T[]);
    get displayed(): T[];
    get change(): Observable<T[]>;
    get allChanges(): Observable<T[]>;
    /**
     * Checks if we don't have data to process yet, to abort early operations
     */
    private get uninitialized();
    /**
     * Tracking function to identify objects.
     */
    identifyBy: ClrDatagridItemsIdentityFunction<T>;
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy(): void;
    smartenDown(): void;
    smartenUp(): void;
    /**
     * Manually recompute the list of displayed items
     */
    refresh(): void;
    private emitChange;
    private emitAllChanges;
    /**
     * FiltersProvider items from the raw list
     */
    private _filterItems;
    /**
     * Sorts items in the filtered list
     */
    private _sortItems;
    /**
     * Extracts the current page from the sorted list
     */
    private _changePage;
    static ɵfac: i0.ɵɵFactoryDeclaration<Items<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Items<any>>;
}

declare class ClrDatagridItems<T> implements DoCheck, OnDestroy {
    template: TemplateRef<NgForOfContext<T>>;
    private differs;
    private items;
    private iterableProxy;
    private _rawItems;
    private differ;
    private subscriptions;
    constructor(template: TemplateRef<NgForOfContext<T>>, differs: IterableDiffers, items: Items, vcr: ViewContainerRef);
    set rawItems(items: T[]);
    set trackBy(value: TrackByFunction<T>);
    /**
     * Asserts the correct type of the template context that the directive will render.
     * See https://angular.io/guide/structural-directives#typing-the-directives-context
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T>(_dir: ClrDatagridItems<T>, _ctx: unknown): _ctx is NgForOfContext<T>;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridItems<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridItems<any>, "[clrDgItems][clrDgItemsOf]", never, { "rawItems": { "alias": "clrDgItemsOf"; "required": false; }; "trackBy": { "alias": "clrDgItemsTrackBy"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrDatagridPlaceholder<T = any> {
    private items;
    constructor(items: Items<T>);
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPlaceholder<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPlaceholder<any>, "clr-dg-placeholder", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrDatagridCell implements OnInit {
    private vcr;
    /*********
     * @property signpost
     *
     * @description
     * @ContentChild is used to detect the presence of a Signpost in the projected content.
     * On the host, we set the .datagrid-signpost-trigger class on the cell when signpost.length is greater than 0.
     *
     */
    signpost: QueryList<ClrSignpost>;
    private wrappedInjector;
    constructor(vcr: ViewContainerRef);
    get _view(): any;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridCell, "clr-dg-cell", never, {}, {}, ["signpost"], ["*"], false, never>;
}

declare class DatagridIfExpandService extends IfExpandService {
    expandableId: string;
    private _replace;
    private _animate;
    constructor();
    get expanded(): boolean;
    set expanded(value: boolean);
    get replace(): Observable<boolean>;
    get animate(): Observable<void>;
    loadingStateChange(state: ClrLoadingState): void;
    setReplace(replaceValue: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridIfExpandService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridIfExpandService>;
}

declare enum SelectionType {
    None = 0,
    Single = 1,
    Multi = 2
}

declare enum DatagridDisplayMode {
    DISPLAY = 0,
    CALCULATE = 1
}

declare enum DatagridRenderStep {
    ALIGN_COLUMNS = 0,
    CALCULATE_MODE_ON = 1,
    CALCULATE_MODE_OFF = 2,
    CLEAR_WIDTHS = 3,// Note this is listened to by both cells and columns
    COMPUTE_COLUMN_WIDTHS = 4
}

declare class DatagridRenderOrganizer {
    protected _renderStep: Subject<DatagridRenderStep>;
    private alreadySized;
    get renderStep(): Observable<DatagridRenderStep>;
    filterRenderSteps(step: DatagridRenderStep): Observable<DatagridRenderStep>;
    resize(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRenderOrganizer, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridRenderOrganizer>;
}

declare class DisplayModeService implements OnDestroy {
    protected _view: BehaviorSubject<DatagridDisplayMode>;
    private subscriptions;
    constructor(renderOrganizer: DatagridRenderOrganizer);
    get view(): Observable<DatagridDisplayMode>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DisplayModeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DisplayModeService>;
}

declare class ExpandableRowsCount {
    private detailService;
    private expandableCount;
    constructor(detailService: DetailService);
    /**
     * false means no rows with action
     * check if details are on, and disable rows entirely
     */
    get hasExpandableRow(): boolean;
    register(): void;
    unregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableRowsCount, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpandableRowsCount>;
}

declare class RowActionService {
    private actionableCount;
    /**
     * false means no rows with action
     */
    get hasActionableRow(): boolean;
    register(): void;
    unregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RowActionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RowActionService>;
}

declare class Selection<T = any> {
    private _items;
    id: string;
    preserveSelection: boolean;
    /**
     * Last selection, for use in range selection.
     */
    rangeStart: T;
    /**
     * Shift key state, for use in range selection.
     */
    shiftPressed: boolean;
    /** @deprecated since 2.0, remove in 3.0 */
    rowSelectionMode: boolean;
    private lockedRefs;
    private _currentSelectionRefs;
    private valueCollector;
    private _selectionType;
    /**
     * The current selection
     */
    private _current;
    /**
     * The current selection in single selection type
     */
    private _currentSingle;
    /**
     * The Observable that lets other classes subscribe to selection changes
     */
    private _change;
    /**
     * Subscriptions to the other providers changes.
     */
    private subscriptions;
    /**
     * Differ to track changes of multi selection.
     */
    private _differ;
    private identifyBy;
    constructor(_items: Items<T>, filters: FiltersProvider<T>, differs: IterableDiffers);
    get selectionType(): SelectionType;
    set selectionType(value: SelectionType);
    get current(): T[];
    set current(value: T[]);
    get currentSingle(): T;
    set currentSingle(value: T);
    get change(): Observable<T[] | T>;
    private get _selectable();
    private get currentSelectionRefs();
    private get currentSingleSelectionRef();
    checkForChanges(): void;
    clearSelection(): void;
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy(): void;
    updateCurrent(value: T[], emit: boolean): void;
    /**
     * Checks if an item is currently selected
     */
    isSelected(item: T): boolean;
    /**
     * Selects or deselects an item
     */
    setSelected(item: T, selected: boolean): void;
    /**
     * Checks if all currently displayed items are selected
     */
    isAllSelected(): boolean;
    /**
     * Lock and unlock item
     */
    lockItem(item: T, lock: boolean): void;
    /**
     * Check is item locked or not by searching into lockedRefs for entry
     */
    isLocked(item: T): boolean;
    /**
     * Selects or deselects all currently displayed items
     */
    toggleAll(): void;
    /**
     * Selects an item
     */
    private selectItem;
    /**
     * Deselects an item
     */
    private deselectItem;
    /**
     * Make sure that it could be locked
     */
    private canItBeLocked;
    private emitChange;
    private updateCurrentSelectionRefs;
    static ɵfac: i0.ɵɵFactoryDeclaration<Selection<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Selection<any>>;
}

declare class ClrDatagridRow<T = any> implements AfterContentInit, AfterViewInit {
    selection: Selection<T>;
    rowActionService: RowActionService;
    globalExpandable: ExpandableRowsCount;
    expand: DatagridIfExpandService;
    detailService: DetailService;
    private displayMode;
    private vcr;
    el: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private items;
    private document;
    selectedChanged: EventEmitter<boolean>;
    expandedChange: EventEmitter<boolean>;
    detailDisabled: boolean;
    detailHidden: boolean;
    skeletonLoading: boolean;
    id: string;
    radioId: string;
    checkboxId: string;
    expandableId: string;
    replaced: boolean;
    displayCells: boolean;
    expandAnimationTrigger: boolean;
    SELECTION_TYPE: typeof SelectionType;
    /**
     * @internal
     */
    itemChanges: ReplaySubject<T>;
    /*****
     * property dgCells
     *
     * @description
     * A Query List of the ClrDatagrid cells in this row.
     *
     */
    dgCells: QueryList<ClrDatagridCell>;
    expandAnimation: ClrExpandableAnimationDirective;
    detailButton: ElementRef<HTMLButtonElement>;
    _stickyCells: ViewContainerRef;
    _scrollableCells: ViewContainerRef;
    _calculatedCells: ViewContainerRef;
    _fixedCellTemplate: TemplateRef<any>;
    private _item;
    private _selected;
    private _detailOpenLabel;
    private _detailCloseLabel;
    private _rowSelectionLabel;
    private wrappedInjector;
    private subscriptions;
    private _selectable;
    constructor(selection: Selection<T>, rowActionService: RowActionService, globalExpandable: ExpandableRowsCount, expand: DatagridIfExpandService, detailService: DetailService, displayMode: DisplayModeService, vcr: ViewContainerRef, renderer: Renderer2, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, items: Items, document: any);
    /**
     * Model of the row, to use for selection
     */
    get item(): T;
    set item(item: T);
    get clrDgSelectable(): boolean | string;
    set clrDgSelectable(value: boolean | string);
    /**
     * Indicates if the row is selected
     */
    get selected(): boolean | string;
    set selected(value: boolean | string);
    get expanded(): boolean | string;
    set expanded(value: boolean | string);
    get clrDgDetailOpenLabel(): string;
    set clrDgDetailOpenLabel(label: string);
    get clrDgDetailCloseLabel(): string;
    set clrDgDetailCloseLabel(label: string);
    get clrDgRowSelectionLabel(): string;
    set clrDgRowSelectionLabel(label: string);
    get _view(): any;
    get identifyBy(): _clr_angular_data.ClrDatagridItemsIdentityFunction<any>;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    toggle(selected?: boolean): void;
    toggleExpand(): void;
    /**
     * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
     * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
     * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
     * selection browser functionality, which is inconsistently implemented in browsers anyway.
     */
    clearRanges(event: MouseEvent): void;
    /**
     * @deprecated related to clrDgRowSelection, which is deprecated
     */
    protected selectRow(selected: boolean, $event: any): void;
    private rangeSelect;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridRow<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridRow<any>, "clr-dg-row", never, { "detailDisabled": { "alias": "clrDgDetailDisabled"; "required": false; }; "detailHidden": { "alias": "clrDgDetailHidden"; "required": false; }; "skeletonLoading": { "alias": "clrDgSkeletonLoading"; "required": false; }; "item": { "alias": "clrDgItem"; "required": false; }; "clrDgSelectable": { "alias": "clrDgSelectable"; "required": false; }; "selected": { "alias": "clrDgSelected"; "required": false; }; "expanded": { "alias": "clrDgExpanded"; "required": false; }; "clrDgDetailOpenLabel": { "alias": "clrDgDetailOpenLabel"; "required": false; }; "clrDgDetailCloseLabel": { "alias": "clrDgDetailCloseLabel"; "required": false; }; "clrDgRowSelectionLabel": { "alias": "clrDgRowSelectionLabel"; "required": false; }; }, { "selectedChanged": "clrDgSelectedChange"; "expandedChange": "clrDgExpandedChange"; }, ["dgCells"], ["clr-dg-action-overflow", "clr-dg-cell", "clr-dg-row-detail"], false, never>;
}

interface ClrDatagridVirtualScrollRangeInterface<T> {
    total: number;
    skip: number;
    data: T[];
}

declare enum DatagridColumnChanges {
    WIDTH = 0,
    HIDDEN = 1,
    INITIALIZE = 2
}

interface ColumnState {
    columnIndex?: number;
    changes?: DatagridColumnChanges[];
    width?: number;
    strictWidth?: number;
    hideable?: boolean;
    hidden?: boolean;
    titleTemplateRef?: TemplateRef<any>;
}
interface ColumnStateDiff extends ColumnState {
    changes: DatagridColumnChanges[];
}

declare class ColumnsService {
    columns: BehaviorSubject<ColumnState>[];
    columnsStateChange: BehaviorSubject<ColumnState>;
    private _cache;
    get columnStates(): ColumnState[];
    get hasHideableColumns(): boolean;
    get visibleColumns(): ColumnState[];
    cache(): void;
    hasCache(): boolean;
    resetToLastCache(): void;
    emitStateChangeAt(columnIndex: number, diff: ColumnStateDiff): void;
    emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnsService>;
}

type CdkVirtualForInputKey = 'cdkVirtualForOf' | 'cdkVirtualForTrackBy' | 'cdkVirtualForTemplate' | 'cdkVirtualForTemplateCacheSize';
type CdkVirtualForInputs<T> = Partial<Pick<CdkVirtualForOf<T>, CdkVirtualForInputKey>>;
type CdkFixedSizeVirtualScrollInputs = Pick<CdkFixedSizeVirtualScroll, 'itemSize' | 'minBufferPx' | 'maxBufferPx'>;
declare class ClrDatagridVirtualScrollDirective<T> implements AfterViewInit, DoCheck, OnDestroy {
    private readonly changeDetectorRef;
    private iterableDiffers;
    private items;
    private readonly ngZone;
    private readonly renderer2;
    private readonly templateRef;
    private readonly viewContainerRef;
    private readonly directionality;
    private readonly scrollDispatcher;
    private readonly viewportRuler;
    private readonly datagrid;
    private columnsService;
    private readonly injector;
    renderedRangeChange: EventEmitter<ListRange>;
    persistItems: boolean;
    private _isUserProvidedItemSize;
    private _itemSize;
    private _minBufferPx;
    private _maxBufferPx;
    private shouldUpdateAriaRowIndexes;
    private readonly datagridElementRef;
    private gridRoleElement;
    private readonly virtualScrollStrategy;
    private virtualScrollViewport;
    private cdkVirtualFor;
    private subscriptions;
    private topIndex;
    private mutationChanges;
    private cdkVirtualForInputs;
    private _totalItems;
    constructor(changeDetectorRef: ChangeDetectorRef, iterableDiffers: IterableDiffers, items: Items<T>, ngZone: NgZone, renderer2: Renderer2, templateRef: TemplateRef<CdkVirtualForOfContext<T>>, viewContainerRef: ViewContainerRef, directionality: Directionality, scrollDispatcher: ScrollDispatcher, viewportRuler: ViewportRuler, datagrid: ClrDatagrid, columnsService: ColumnsService, injector: EnvironmentInjector);
    get totalContentHeight(): string;
    get cdkVirtualForOf(): CdkVirtualForInputs<T>["cdkVirtualForOf"];
    set cdkVirtualForOf(value: CdkVirtualForInputs<T>['cdkVirtualForOf']);
    get cdkVirtualForTrackBy(): CdkVirtualForInputs<T>["cdkVirtualForTrackBy"];
    set cdkVirtualForTrackBy(value: CdkVirtualForInputs<T>['cdkVirtualForTrackBy']);
    get cdkVirtualForTemplate(): CdkVirtualForInputs<T>["cdkVirtualForTemplate"];
    set cdkVirtualForTemplate(value: CdkVirtualForInputs<T>['cdkVirtualForTemplate']);
    get cdkVirtualForTemplateCacheSize(): CdkVirtualForInputs<T>["cdkVirtualForTemplateCacheSize"];
    set cdkVirtualForTemplateCacheSize(value: CdkVirtualForInputs<T>['cdkVirtualForTemplateCacheSize']);
    get itemSize(): CdkFixedSizeVirtualScrollInputs["itemSize"];
    set itemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']);
    get minBufferPx(): CdkFixedSizeVirtualScrollInputs["minBufferPx"];
    set minBufferPx(value: CdkFixedSizeVirtualScrollInputs['minBufferPx']);
    get maxBufferPx(): CdkFixedSizeVirtualScrollInputs["maxBufferPx"];
    set maxBufferPx(value: CdkFixedSizeVirtualScrollInputs['maxBufferPx']);
    set dataRange(range: ClrDatagridVirtualScrollRangeInterface<T>);
    get totalItems(): number;
    private set totalItems(value);
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    scrollUp(offset: number, behavior?: ScrollBehavior): void;
    scrollDown(offset: number, behavior?: ScrollBehavior): void;
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    private updateDataRange;
    private updateItemSize;
    private updateCdkVirtualForInputs;
    private updateFixedSizeVirtualScrollInputs;
    private updateAriaRowCount;
    private updateAriaRowIndexes;
    private createVirtualScrollViewportForDatagrid;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridVirtualScrollDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridVirtualScrollDirective<any>, "[clrVirtualScroll],[ClrVirtualScroll]", never, { "persistItems": { "alias": "clrVirtualPersistItems"; "required": false; }; "cdkVirtualForOf": { "alias": "clrVirtualRowsOf"; "required": false; }; "cdkVirtualForTrackBy": { "alias": "clrVirtualRowsTrackBy"; "required": false; }; "cdkVirtualForTemplate": { "alias": "clrVirtualRowsTemplate"; "required": false; }; "cdkVirtualForTemplateCacheSize": { "alias": "clrVirtualRowsTemplateCacheSize"; "required": false; }; "itemSize": { "alias": "clrVirtualRowsItemSize"; "required": false; }; "minBufferPx": { "alias": "clrVirtualRowsMinBufferPx"; "required": false; }; "maxBufferPx": { "alias": "clrVirtualRowsMaxBufferPx"; "required": false; }; "dataRange": { "alias": "clrVirtualDataRange"; "required": false; }; }, { "renderedRangeChange": "renderedRangeChange"; }, never, never, false, never>;
}

interface ClrDatagridStateInterface<T = any> {
    page?: {
        from?: number;
        to?: number;
        size?: number;
        current?: number;
    };
    sort?: {
        by: string | ClrDatagridComparatorInterface<T>;
        reverse: boolean;
    };
    filters?: any[];
}

/**
 * This provider aggregates state changes from the various providers of the Datagrid
 */
declare class StateProvider<T> {
    private filters;
    private sort;
    private page;
    private debouncer;
    /**
     * The Observable that lets other classes subscribe to global state changes
     */
    change: Observable<ClrDatagridStateInterface<T>>;
    constructor(filters: FiltersProvider<T>, sort: Sort<T>, page: Page, debouncer: StateDebouncer);
    get state(): ClrDatagridStateInterface<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<StateProvider<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StateProvider<any>>;
}

interface KeyNavigationGridConfig {
    keyGrid: string;
    keyGridRows: string;
    keyGridCells: string;
}
interface CellCoordinates {
    x: number;
    y: number;
    ariaRowIndex?: string;
}
declare class KeyNavigationGridController implements OnDestroy {
    private zone;
    nextCellCoordsEmitter: EventEmitter<CellCoordinates>;
    skipItemFocus: boolean;
    preventScrollOnFocus: boolean;
    config: KeyNavigationGridConfig;
    private keyNavUtils;
    private listenersAdded;
    private destroy$;
    constructor(zone: NgZone);
    ngOnDestroy(): void;
    addListeners(): void;
    initializeKeyGrid(host: HTMLElement): void;
    resetKeyGrid(): void;
    setActiveCell(activeCell: HTMLElement): void;
    focusElement(activeCell: HTMLElement, options?: FocusOptions): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyNavigationGridController, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyNavigationGridController>;
}

declare class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy, DoCheck {
    private organizer;
    items: Items<T>;
    expandableRows: ExpandableRowsCount;
    selection: Selection<T>;
    rowActionService: RowActionService;
    private stateProvider;
    private displayMode;
    private renderer;
    detailService: DetailService;
    private document;
    el: ElementRef<HTMLElement>;
    private page;
    commonStrings: ClrCommonStringsService;
    keyNavigation: KeyNavigationGridController;
    private zone;
    loadingMoreItems: boolean;
    clrDgSingleSelectionAriaLabel: string;
    clrDgSingleActionableAriaLabel: string;
    clrDetailExpandableAriaLabel: string;
    clrDgDisablePageFocus: boolean;
    selectedChanged: EventEmitter<T[]>;
    singleSelectedChanged: EventEmitter<T>;
    /**
     * Output emitted whenever the data needs to be refreshed, based on user action or external ones
     */
    refresh: EventEmitter<ClrDatagridStateInterface<T>>;
    /**
     * The application can provide custom select all logic.
     */
    customSelectAllEnabled: boolean;
    customSelectAll: EventEmitter<boolean>;
    /**
     * Expose virtual scroll directive for applications to access its public methods
     */
    _virtualScroll: QueryList<ClrDatagridVirtualScrollDirective<any>>;
    /**
     * We grab the smart iterator from projected content
     */
    iterator: ClrDatagridItems<T>;
    /**
     * Custom placeholder detection
     */
    placeholder: ClrDatagridPlaceholder<T>;
    /**
     * Hideable Column data source / detection.
     */
    columns: QueryList<ClrDatagridColumn<T>>;
    /**
     * When the datagrid is user-managed without the smart iterator, we get the items displayed
     * by querying the projected content. This is needed to keep track of the models currently
     * displayed, typically for selection.
     */
    rows: QueryList<ClrDatagridRow<T>>;
    datagrid: ElementRef<HTMLElement>;
    datagridTable: ElementRef<HTMLElement>;
    datagridHeader: ElementRef<HTMLElement>;
    contentWrapper: ElementRef<HTMLElement>;
    rowsWrapper: ElementRef<HTMLElement>;
    scrollableColumns: ViewContainerRef;
    _projectedDisplayColumns: ViewContainerRef;
    _projectedCalculationColumns: ViewContainerRef;
    _displayedRows: ViewContainerRef;
    _calculationRows: ViewContainerRef;
    _fixedColumnTemplate: TemplateRef<any>;
    stickyHeaders: QueryList<ElementRef>;
    selectAllId: string;
    activeCellCoords: CellCoordinates;
    SELECTION_TYPE: typeof SelectionType;
    private selectAllCheckbox;
    /**
     * Subscriptions to all the services and queries changes
     */
    private _subscriptions;
    private _virtualScrollSubscriptions;
    private cachedRowsHeight;
    private cachedContentHeight;
    private resizeObserver;
    constructor(organizer: DatagridRenderOrganizer, items: Items<T>, expandableRows: ExpandableRowsCount, selection: Selection<T>, rowActionService: RowActionService, stateProvider: StateProvider<T>, displayMode: DisplayModeService, renderer: Renderer2, detailService: DetailService, document: any, el: ElementRef<HTMLElement>, page: Page, commonStrings: ClrCommonStringsService, keyNavigation: KeyNavigationGridController, zone: NgZone);
    /**
     * Freezes the datagrid while data is loading
     */
    get loading(): boolean;
    set loading(value: boolean);
    /**
     * Array of all selected items
     */
    set selected(value: T[] | undefined);
    /**
     * Selected item in single-select mode
     */
    set singleSelected(value: T);
    set clrDgPreserveSelection(state: boolean);
    /**
     * @deprecated since 2.0, remove in 3.0
     *
     * Selection/Deselection on row click mode
     */
    set rowSelectionMode(value: boolean);
    set identityFn(value: ClrDatagridItemsIdentityFunction<T>);
    /**
     * Indicates if all currently displayed items are selected
     */
    get allSelected(): boolean;
    set allSelected(value: boolean);
    get virtualScroll(): ClrDatagridVirtualScrollDirective<any>;
    ngAfterContentInit(): void;
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    ngAfterViewInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    toggleAllSelected($event: any): void;
    resize(): void;
    /**
     * Checks the state of detail panel and if it's opened then
     * find the matching row and trigger the detail panel
     */
    updateDetailState(): void;
    /**
     * Public method to re-trigger the computation of displayed items manually
     */
    dataChanged(): void;
    private toggleVirtualScrollSubscriptions;
    private handleResizeChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagrid<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagrid<any>, "clr-datagrid", never, { "loadingMoreItems": { "alias": "clrLoadingMoreItems"; "required": false; }; "clrDgSingleSelectionAriaLabel": { "alias": "clrDgSingleSelectionAriaLabel"; "required": false; }; "clrDgSingleActionableAriaLabel": { "alias": "clrDgSingleActionableAriaLabel"; "required": false; }; "clrDetailExpandableAriaLabel": { "alias": "clrDetailExpandableAriaLabel"; "required": false; }; "clrDgDisablePageFocus": { "alias": "clrDgDisablePageFocus"; "required": false; }; "customSelectAllEnabled": { "alias": "clrDgCustomSelectAllEnabled"; "required": false; }; "loading": { "alias": "clrDgLoading"; "required": false; }; "selected": { "alias": "clrDgSelected"; "required": false; }; "singleSelected": { "alias": "clrDgSingleSelected"; "required": false; }; "clrDgPreserveSelection": { "alias": "clrDgPreserveSelection"; "required": false; }; "rowSelectionMode": { "alias": "clrDgRowSelection"; "required": false; }; "identityFn": { "alias": "clrDgItemsIdentityFn"; "required": false; }; }, { "selectedChanged": "clrDgSelectedChange"; "singleSelectedChanged": "clrDgSingleSelectedChange"; "refresh": "clrDgRefresh"; "customSelectAll": "clrDgCustomSelectAll"; }, ["iterator", "placeholder", "_virtualScroll", "columns", "rows"], ["clr-dg-action-bar", "clr-dg-placeholder", "clr-dg-footer", "[clrIfDetail],clr-dg-detail"], false, never>;
}

declare class ClrDatagridActionBar {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridActionBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridActionBar, "clr-dg-action-bar", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrDatagridActionOverflow implements OnDestroy {
    private rowActionService;
    commonStrings: ClrCommonStringsService;
    private platformId;
    private popoverService;
    buttonLabel: string;
    openChange: EventEmitter<boolean>;
    popoverId: string;
    smartPosition: ClrPopoverPosition;
    protected positions: _angular_cdk_overlay.ConnectedPosition[];
    private readonly keyFocus;
    private _open;
    private subscriptions;
    constructor(rowActionService: RowActionService, commonStrings: ClrCommonStringsService, platformId: any, popoverService: ClrPopoverService);
    get open(): boolean;
    set open(open: boolean);
    ngOnDestroy(): void;
    closeOverflowContent(event: Event): void;
    private initializeFocus;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridActionOverflow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridActionOverflow, "clr-dg-action-overflow", never, { "buttonLabel": { "alias": "clrDgActionOverflowButtonLabel"; "required": false; }; "open": { "alias": "clrDgActionOverflowOpen"; "required": false; }; }, { "openChange": "clrDgActionOverflowOpenChange"; }, never, ["*"], false, [{ directive: typeof i1$1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDatagridColumnToggle implements OnDestroy {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    popoverId: string;
    openState: boolean;
    popoverPosition: ClrPopoverPosition;
    popoverType: ClrPopoverType;
    readonly trackByFn: i0.TrackByFunction<ColumnState>;
    private _allColumnsVisible;
    private subscription;
    private allSelectedElement;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService, popoverService: ClrPopoverService);
    get allColumnsVisible(): boolean;
    set allColumnsVisible(value: boolean);
    get hideableColumnStates(): ColumnState[];
    get hasOnlyOneVisibleColumn(): boolean;
    ngOnDestroy(): void;
    toggleColumnState(columnState: ColumnState, event: boolean): void;
    toggleSwitchPanel(): void;
    allColumnsSelected(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnToggle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnToggle, "clr-dg-column-toggle", never, {}, {}, never, never, false, [{ directive: typeof i1$1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class ClrDatagridColumnToggleButton {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    private allSelected;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService);
    get clrAllSelected(): Observable<boolean>;
    get allHideablesVisible(): boolean;
    selectAll(): void;
    private hideableColumns;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnToggleButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnToggleButton, "clr-dg-column-toggle-button", never, {}, { "clrAllSelected": "clrAllSelected"; }, never, never, false, never>;
}

declare class ColumnResizerService {
    private el;
    private domAdapter;
    private organizer;
    isWithinMaxResizeRange: boolean;
    private widthBeforeResize;
    private _resizedBy;
    constructor(el: ElementRef<HTMLElement>, domAdapter: DomAdapter, organizer: DatagridRenderOrganizer);
    get resizedBy(): number;
    get minColumnWidth(): number;
    get maxResizeRange(): number;
    get widthAfterResize(): number;
    startResize(): void;
    endResize(): void;
    calculateResize(resizedBy: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnResizerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnResizerService>;
}

/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
declare class TableSizeService {
    private platformId;
    private _tableRef;
    constructor(platformId: any);
    get tableRef(): HTMLElement;
    set tableRef(element: HTMLElement);
    set table(table: ElementRef<HTMLElement>);
    getColumnDragHeight(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableSizeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TableSizeService>;
}

declare class ClrDatagridColumnSeparator implements AfterViewInit, OnDestroy {
    private columnResizerService;
    private renderer;
    private ngZone;
    private tableSizeService;
    commonString: ClrCommonStringsService;
    private document;
    columnSeparatorId: string;
    private resizeStartedOnKeyDown;
    private isWithinMaxResizeRange;
    private unlisteners;
    private resizeTrackerRef;
    private columnHandleRef;
    constructor(columnResizerService: ColumnResizerService, renderer: Renderer2, ngZone: NgZone, tableSizeService: TableSizeService, commonString: ClrCommonStringsService, document: any);
    get descriptionId(): string;
    private get resizeTrackerEl();
    private get columnHandleEl();
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    showTracker(): void;
    moveTracker(movedBy: number): void;
    hideTracker(): void;
    private showTrackerOnFirstKeyDown;
    private moveTrackerOnKeyDown;
    private hideTrackerOnKeyUp;
    private redFlagTracker;
    private isArrowLeftKeyEvent;
    private isArrowRightKeyEvent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnSeparator, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnSeparator, "clr-dg-column-separator", never, {}, {}, never, never, false, never>;
}

declare class ClrDatagridDetailHeader implements AfterViewInit {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    title: ElementRef<HTMLElement>;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get titleId(): string;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetailHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetailHeader, "clr-dg-detail-header", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrDatagridDetail {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    ariaLabelledBy: string;
    ariaLabel: string;
    header: ClrDatagridDetailHeader;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get labelledBy(): string;
    get label(): string;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetail, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetail, "clr-dg-detail", never, { "ariaLabelledBy": { "alias": "clrDetailAriaLabelledBy"; "required": false; }; "ariaLabel": { "alias": "clrDetailAriaLabel"; "required": false; }; }, {}, ["header"], ["*"], false, never>;
}

declare class ClrDatagridDetailBody {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetailBody, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetailBody, "clr-dg-detail-body", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrDatagridHideableColumn implements OnDestroy {
    private titleTemplateRef;
    private columnsService;
    private columnState;
    hiddenChange: EventEmitter<boolean>;
    /**
     *
     * @description
     * Used to initialize the column with either hidden or visible state.
     *
     */
    private _hidden;
    private subscriptions;
    constructor(titleTemplateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    /**
     *
     * @description
     * Setter fn for the @Input with the same name as this structural directive.
     * It allows the user to pre-configure the column's hide/show state. { hidden: true }
     * It's more verbose but has more Clarity.
     *
     * @example
     * *clrDgHideableColumn
     * *clrDgHideableColumn={hidden: false}
     * *clrDgHideableColumn={hidden: true}
     *
     */
    set clrDgHideableColumn(value: {
        hidden: boolean;
    } | string);
    set clrDgHidden(hidden: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridHideableColumn, [null, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridHideableColumn, "[clrDgHideableColumn]", never, { "clrDgHideableColumn": { "alias": "clrDgHideableColumn"; "required": false; }; "clrDgHidden": { "alias": "clrDgHidden"; "required": false; }; }, { "hiddenChange": "clrDgHiddenChange"; }, never, never, false, never>;
}

declare abstract class CustomFilter {
}

/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
declare class ClrDatagridFilter<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements CustomFilter, OnDestroy {
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private keyNavigation;
    openChange: EventEmitter<boolean>;
    ariaExpanded: boolean;
    popoverId: string;
    popoverPosition: ClrPopoverPosition;
    popoverType: ClrPopoverType;
    anchor: ElementRef<HTMLButtonElement>;
    private subs;
    constructor(_filters: FiltersProvider<T>, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, keyNavigation: KeyNavigationGridController);
    get open(): boolean;
    set open(open: boolean);
    set customFilter(filter: ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>);
    /**
     * Indicates if the filter is currently active
     */
    get active(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFilter<any>, [null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFilter<any>, "clr-dg-filter", never, { "open": { "alias": "clrDgFilterOpen"; "required": false; }; "customFilter": { "alias": "clrDgFilter"; "required": false; }; }, { "openChange": "clrDgFilterOpenChange"; }, never, ["*"], false, never>;
    static ngAcceptInputType_open: unknown;
}

declare class ClrIfDetail implements OnInit, OnDestroy {
    private templateRef;
    private viewContainer;
    private detailService;
    stateChange: EventEmitter<any>;
    private subscriptions;
    private skip;
    private embeddedViewRef;
    constructor(templateRef: TemplateRef<any>, viewContainer: ViewContainerRef, detailService: DetailService);
    set state(model: any);
    get viewContext(): {
        $implicit: any;
    };
    ngOnInit(): void;
    ngOnDestroy(): void;
    private togglePanel;
    /**
     * For a given outlet instance, we create a proxy object that delegates
     * to the user-specified context. This allows changing, or swapping out
     * the context object completely without having to destroy/re-create the view.
     */
    private _createContextForwardProxy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfDetail, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfDetail, "[clrIfDetail]", never, { "state": { "alias": "clrIfDetail"; "required": false; }; }, { "stateChange": "clrIfDetailChange"; }, never, never, false, never>;
}

/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
declare class ClrDatagridRowDetail implements AfterContentInit, OnDestroy {
    selection: Selection;
    rowActionService: RowActionService;
    expand: DatagridIfExpandService;
    expandableRows: ExpandableRowsCount;
    commonStrings: ClrCommonStringsService;
    _beginningOfExpandableContentAriaText: string;
    _endOfExpandableContentAriaText: string;
    replacedRow: boolean;
    SELECTION_TYPE: typeof SelectionType;
    cells: QueryList<ClrDatagridCell>;
    private subscriptions;
    constructor(selection: Selection, rowActionService: RowActionService, expand: DatagridIfExpandService, expandableRows: ExpandableRowsCount, commonStrings: ClrCommonStringsService);
    set replace(value: boolean);
    get beginningOfExpandableContentAriaText(): string;
    get endOfExpandableContentAriaText(): string;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridRowDetail, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridRowDetail, "clr-dg-row-detail", never, { "_beginningOfExpandableContentAriaText": { "alias": "clrRowDetailBeginningAriaText"; "required": false; }; "_endOfExpandableContentAriaText": { "alias": "clrRowDetailEndAriaText"; "required": false; }; "replace": { "alias": "clrDgReplace"; "required": false; }; }, {}, ["cells"], ["*"], false, never>;
}

declare class ClrDatagridFooter<T = any> {
    selection: Selection<T>;
    detailService: DetailService;
    private columnsService;
    commonStrings: ClrCommonStringsService;
    SELECTION_TYPE: typeof SelectionType;
    constructor(selection: Selection<T>, detailService: DetailService, columnsService: ColumnsService, commonStrings: ClrCommonStringsService);
    get hasHideableColumns(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFooter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFooter<any>, "clr-dg-footer", never, {}, {}, never, ["*", "clr-dg-pagination"], false, never>;
}

declare class ClrDatagridPageSize {
    page: Page;
    pageSizeOptions: number[];
    pageSizeOptionsId: string;
    constructor(page: Page);
    set label(label: ClrControlLabel);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPageSize, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPageSize, "clr-dg-page-size", never, { "pageSizeOptions": { "alias": "clrPageSizeOptions"; "required": false; }; "pageSizeOptionsId": { "alias": "clrPageSizeOptionsId"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrDatagridPagination implements OnDestroy, OnInit {
    page: Page;
    commonStrings: ClrCommonStringsService;
    detailService: DetailService;
    disableCurrentPageInput: boolean;
    currentChanged: EventEmitter<number>;
    _pageSizeComponent: ClrDatagridPageSize;
    currentPageInputRef: ElementRef<HTMLInputElement>;
    /**
     * Subscription to the page service changes
     */
    private _pageSubscription;
    constructor(page: Page, commonStrings: ClrCommonStringsService, detailService: DetailService);
    /**
     * Page size
     */
    get pageSize(): number;
    set pageSize(size: number);
    /**
     * Total items (needed to guess the last page)
     */
    get totalItems(): number;
    set totalItems(total: number);
    /**
     * Last page
     */
    get lastPage(): number;
    set lastPage(last: number);
    /**
     * Current page
     */
    get currentPage(): number;
    set currentPage(page: number);
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem(): number;
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem(): number;
    /**
     * Conditionally adds page numbers before and after the current page
     */
    get middlePages(): number[];
    /**********
     * Subscription to the Page service for page changes.
     * Note: this only emits after the datagrid is initialized/stabalized and the page changes.
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Moves to the previous page if it exists
     */
    previous(): void;
    /**
     * Moves to the next page if it exists
     */
    next(): void;
    verifyCurrentPage(event: any): void;
    /**
     * We only update the pagination's current page on enter.
     */
    updateCurrentPage(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPagination, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPagination, "clr-dg-pagination", never, { "disableCurrentPageInput": { "alias": "clrDgPageInputDisabled"; "required": false; }; "pageSize": { "alias": "clrDgPageSize"; "required": false; }; "totalItems": { "alias": "clrDgTotalItems"; "required": false; }; "lastPage": { "alias": "clrDgLastPage"; "required": false; }; "currentPage": { "alias": "clrDgPage"; "required": false; }; }, { "currentChanged": "clrDgPageChange"; }, ["_pageSizeComponent"], ["clr-dg-page-size", "*"], false, never>;
}

interface ClrDatagridStringFilterInterface<T> {
    accepts(item: T, search: string): boolean;
}

interface ClrDatagridNumericFilterInterface<T> {
    accepts(item: T, low: number, high: number): boolean;
}

declare class DatagridStringFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridStringFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Input value converted to lowercase
     */
    private _lowerCaseValue;
    /**
     * Raw input value
     */
    private _rawValue;
    constructor(filterFn: ClrDatagridStringFilterInterface<T>);
    get changes(): Observable<string>;
    get lowerCaseValue(): string;
    get state(): this | {
        property: string;
        value: string;
    };
    get value(): string;
    /**
     * Common setter for the input value
     */
    set value(value: string);
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}

declare class DatagridStringFilter<T = any> extends DatagridFilterRegistrar<T, DatagridStringFilterImpl<T>> implements CustomFilter, OnChanges, OnDestroy, AfterViewInit {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private elementRef;
    private cdr;
    private ngZone;
    /**
     * Provide a way to pass external placeholder and aria-label to the filter input
     */
    placeholder: string;
    label: string;
    filterValueChange: EventEmitter<any>;
    /**
     * Indicates if the filter dropdown is open
     */
    open: boolean;
    /**
     * We need the actual input element to automatically focus on it
     */
    input: ElementRef<HTMLInputElement>;
    /**
     * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
     */
    filterContainer: ClrDatagridFilter<T>;
    labelValue: string;
    private initFilterValue;
    private subs;
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone);
    /**
     * Customizable filter logic based on a search text
     */
    set customStringFilter(value: ClrDatagridStringFilterInterface<T> | RegisteredFilter<T, DatagridStringFilterImpl<T>>);
    /**
     * Common setter for the input value
     */
    get value(): string;
    set value(value: string);
    get placeholderValue(): string;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    /**
     * This is not in a getter to prevent "expression has changed after it was checked" errors.
     */
    private setFilterLabel;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridStringFilter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridStringFilter<any>, "clr-dg-string-filter", never, { "placeholder": { "alias": "clrFilterPlaceholder"; "required": false; }; "label": { "alias": "clrFilterLabel"; "required": false; }; "customStringFilter": { "alias": "clrDgStringFilter"; "required": false; }; "value": { "alias": "clrFilterValue"; "required": false; }; }, { "filterValueChange": "clrFilterValueChange"; }, never, never, false, never>;
}

declare class DatagridNumericFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridNumericFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Internal values and accessor
     */
    private _low;
    private _high;
    constructor(filterFn: ClrDatagridNumericFilterInterface<T>);
    get changes(): Observable<[number, number]>;
    get value(): [number, number];
    set value(vals: [number, number]);
    get low(): number;
    set low(low: number);
    get high(): number;
    set high(high: number);
    get state(): this | {
        property: string;
        low: number;
        high: number;
    };
    /**
     * Indicates if the filter is currently active, (at least one input is set)
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}

declare class DatagridNumericFilter<T = any> extends DatagridFilterRegistrar<T, DatagridNumericFilterImpl<T>> implements CustomFilter, AfterViewInit {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private popoverService;
    private ngZone;
    minPlaceholder: string;
    maxPlaceholder: string;
    fromLabel: string;
    toLabel: string;
    filterValueChange: EventEmitter<any>;
    /**
     * Indicates if the filter dropdown is open
     */
    open: boolean;
    /**
     * We need the actual input element to automatically focus on it
     */
    input: ElementRef<HTMLInputElement>;
    /**
     * We grab the ClrDatagridFilter we wrap to register this StringFilter to it.
     */
    filterContainer: ClrDatagridFilter<T>;
    private initFilterValues;
    private subscriptions;
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, ngZone: NgZone);
    /**
     * Common setter for the input values
     */
    get value(): [number, number];
    set value(values: [number, number]);
    /**
     * Customizable filter logic based on high and low values
     */
    set customNumericFilter(value: ClrDatagridNumericFilterInterface<T> | RegisteredFilter<T, DatagridNumericFilterImpl<T>>);
    get maxPlaceholderValue(): string;
    get minPlaceholderValue(): string;
    get fromLabelValue(): string;
    get toLabelValue(): string;
    get low(): number | string;
    set low(low: number | string);
    get high(): number | string;
    set high(high: number | string);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridNumericFilter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridNumericFilter<any>, "clr-dg-numeric-filter", never, { "minPlaceholder": { "alias": "clrFilterMinPlaceholder"; "required": false; }; "maxPlaceholder": { "alias": "clrFilterMaxPlaceholder"; "required": false; }; "fromLabel": { "alias": "clrFilterFromLabel"; "required": false; }; "toLabel": { "alias": "clrFilterToLabel"; "required": false; }; "value": { "alias": "clrFilterValue"; "required": false; }; "customNumericFilter": { "alias": "clrDgNumericFilter"; "required": false; }; }, { "filterValueChange": "clrFilterValueChange"; }, never, never, false, never>;
}

declare class DatagridPropertyStringFilter<T = any> implements ClrDatagridStringFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, search: string): boolean;
}

declare class DatagridPropertyNumericFilter<T = any> implements ClrDatagridNumericFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, low: number, high: number): boolean;
}

declare class DatagridPropertyComparator<T = any> implements ClrDatagridComparatorInterface<T> {
    prop: string;
    private nestedProp;
    constructor(prop: string);
    compare(a: T, b: T): number;
}

declare class ClrDatagridSelectionCellDirective {
    private readonly selection;
    constructor(selection: Selection);
    private onSelectionCellClick;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSelectionCellDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSelectionCellDirective, ".datagrid-select", never, {}, {}, never, never, false, never>;
}

declare class DatagridDetailRegisterer {
    private expandableRowsCount;
    constructor(expandableRowsCount: ExpandableRowsCount);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridDetailRegisterer, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridDetailRegisterer, "[clrIfExpanded]", never, {}, {}, never, never, false, never>;
}

declare class WrappedCell implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    cellView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedCell, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedCell, "dg-wrapped-cell", never, {}, {}, never, ["*"], false, never>;
}

declare class WrappedColumn implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    columnView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedColumn, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedColumn, "dg-wrapped-column", never, {}, {}, never, ["*"], false, never>;
}

declare class WrappedRow implements AfterViewInit, OnDestroy {
    templateRef: TemplateRef<void>;
    rowView: EmbeddedViewRef<void>;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WrappedRow, "dg-wrapped-row", never, {}, {}, never, ["*"], false, never>;
}

declare class DatagridCellRenderer implements OnDestroy {
    private el;
    private renderer;
    private stateSubscription;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer);
    ngOnDestroy(): void;
    resetState(state: ColumnState): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridCellRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridCellRenderer, "clr-dg-cell", never, {}, {}, never, never, false, never>;
}

declare class DatagridHeaderRenderer implements OnDestroy {
    private el;
    private renderer;
    private domAdapter;
    private columnResizerService;
    private columnsService;
    private columnState;
    resizeEmitter: EventEmitter<number>;
    /**
     * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
     */
    private widthSet;
    private autoSet;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer, domAdapter: DomAdapter, columnResizerService: ColumnResizerService, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    ngOnDestroy(): void;
    getColumnWidthState(): Partial<ColumnState>;
    setColumnState(index: number): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
    private detectStrictWidth;
    private computeWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridHeaderRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridHeaderRenderer, "clr-dg-column", never, {}, { "resizeEmitter": "clrDgColumnResize"; }, never, never, false, never>;
}

declare class DatagridMainRenderer implements AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
    private datagrid;
    private organizer;
    private items;
    private page;
    private el;
    private renderer;
    private tableSizeService;
    private columnsService;
    private ngZone;
    private keyNavigation;
    private changeDetectorRef;
    private headers;
    private rows;
    private _heightSet;
    private shouldStabilizeColumns;
    private subscriptions;
    private intersectionObserver;
    /**
     * Indicates if we want to re-compute columns width. This should only happen:
     * 1) When headers change, with columns being added or removed
     * 2) When rows are lazily loaded for the first time
     */
    private columnsSizesStable;
    constructor(datagrid: ClrDatagrid, organizer: DatagridRenderOrganizer, items: Items, page: Page, el: ElementRef<HTMLElement>, renderer: Renderer2, detailService: DetailService, tableSizeService: TableSizeService, columnsService: ColumnsService, ngZone: NgZone, keyNavigation: KeyNavigationGridController, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    toggleDetailPane(state: boolean): void;
    private setupColumns;
    private shouldComputeHeight;
    /**
     * Computes the height of the datagrid.
     *
     * NOTE: We had to choose to set the height instead of the min-height because
     * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
     * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
     * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
     *
     * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
     */
    private computeDatagridHeight;
    private resetDatagridHeight;
    /**
     * Makes each header compute its width.
     */
    private computeHeadersWidth;
    private columnStateChanged;
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    private stabilizeColumns;
    private updateColumnSeparatorsVisibility;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridMainRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridMainRenderer, "clr-datagrid", never, {}, {}, ["headers", "rows"], never, false, never>;
}

declare class DatagridRowRenderer implements AfterContentInit, OnDestroy {
    private columnsService;
    cells: QueryList<DatagridCellRenderer>;
    expandableRows: DatagridRowDetailRenderer[];
    private subscriptions;
    constructor(columnsService: ColumnsService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setCellsState(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowRenderer, "clr-dg-row", never, {}, {}, ["cells"], never, false, never>;
}

declare class DatagridRowDetailRenderer extends DatagridRowRenderer implements OnDestroy {
    private parentRow;
    constructor(parentRow: DatagridRowRenderer, columnsService: ColumnsService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowDetailRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowDetailRenderer, "clr-dg-row-detail", never, {}, {}, never, never, false, never>;
}

declare class DatagridWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridWillyWonka, "clr-datagrid", never, {}, {}, never, never, false, never>;
}

declare class ActionableOompaLoompa extends OompaLoompa {
    private rowActions;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, rowActions: RowActionService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActionableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ActionableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}

declare class ExpandableOompaLoompa extends OompaLoompa {
    private expandableCount;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, expandableCount: ExpandableRowsCount);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ExpandableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}

declare class ClrDatagridSingleSelectionValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    value: any;
    clrDgIdentityFn: (value: any) => unknown;
    private state;
    constructor(renderer: Renderer2, elementRef: ElementRef<HTMLInputElement>);
    onChange: (value: any) => void;
    onTouched: () => void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: any): void;
    private keyOf;
    private updateChecked;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridSingleSelectionValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridSingleSelectionValueAccessor, "input[type=radio][clrDgSingleSelectionRadio]", never, { "value": { "alias": "value"; "required": false; }; "clrDgIdentityFn": { "alias": "clrDgIdentityFn"; "required": false; }; }, {}, never, never, true, never>;
}

declare const CLR_DATAGRID_DIRECTIVES: Type<any>[];
declare class ClrDatagridModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatagridModule, [typeof ClrDatagrid, typeof ClrDatagridActionBar, typeof ClrDatagridActionOverflow, typeof ClrDatagridCell, typeof ClrDatagridColumn, typeof ClrDatagridColumnSeparator, typeof ClrDatagridDetail, typeof ClrDatagridDetailBody, typeof ClrDatagridDetailHeader, typeof ClrDatagridFilter, typeof ClrDatagridFooter, typeof ClrDatagridHideableColumn, typeof ClrDatagridItems, typeof ClrDatagridPageSize, typeof ClrDatagridPagination, typeof ClrDatagridPlaceholder, typeof ClrDatagridRow, typeof ClrDatagridRowDetail, typeof ClrDatagridSelectionCellDirective, typeof ClrDatagridVirtualScrollDirective, typeof ClrIfDetail, typeof DatagridDetailRegisterer, typeof WrappedCell, typeof WrappedColumn, typeof WrappedRow, typeof DatagridCellRenderer, typeof DatagridHeaderRenderer, typeof DatagridMainRenderer, typeof DatagridRowDetailRenderer, typeof DatagridRowRenderer, typeof ActionableOompaLoompa, typeof DatagridWillyWonka, typeof ExpandableOompaLoompa, typeof DatagridNumericFilter, typeof DatagridStringFilter, typeof ClrDatagridColumnToggle, typeof ClrDatagridColumnToggleButton], [typeof i6.CommonModule, typeof i39.CdkDragModule, typeof i39.CdkTrapFocusModule, typeof i40.ClrIcon, typeof i41.ClrInputModule, typeof i42.ClrRadioModule, typeof i43.ClrCheckboxModule, typeof i44.ClrNumberInputModule, typeof i45.ClrSelectModule, typeof i46.FormsModule, typeof i39.ClrLoadingModule, typeof i39.ClrConditionalModule, typeof i39.ClrOutsideClickModule, typeof i39.ClrExpandableAnimationModule, typeof i47.ClrSpinnerModule, typeof i1$1.ÇlrClrPopoverModuleNext, typeof i39.ClrKeyFocusModule, typeof ClrDatagridSingleSelectionValueAccessor, typeof i39.ClrIfExpanded], [typeof ClrDatagrid, typeof ClrDatagridActionBar, typeof ClrDatagridActionOverflow, typeof ClrDatagridCell, typeof ClrDatagridColumn, typeof ClrDatagridColumnSeparator, typeof ClrDatagridDetail, typeof ClrDatagridDetailBody, typeof ClrDatagridDetailHeader, typeof ClrDatagridFilter, typeof ClrDatagridFooter, typeof ClrDatagridHideableColumn, typeof ClrDatagridItems, typeof ClrDatagridPageSize, typeof ClrDatagridPagination, typeof ClrDatagridPlaceholder, typeof ClrDatagridRow, typeof ClrDatagridRowDetail, typeof ClrDatagridSelectionCellDirective, typeof ClrDatagridVirtualScrollDirective, typeof ClrIfDetail, typeof DatagridDetailRegisterer, typeof WrappedCell, typeof WrappedColumn, typeof WrappedRow, typeof DatagridCellRenderer, typeof DatagridHeaderRenderer, typeof DatagridMainRenderer, typeof DatagridRowDetailRenderer, typeof DatagridRowRenderer, typeof ActionableOompaLoompa, typeof DatagridWillyWonka, typeof ExpandableOompaLoompa, typeof DatagridNumericFilter, typeof DatagridStringFilter, typeof ClrDatagridSingleSelectionValueAccessor, typeof i39.ClrIfExpanded]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatagridModule>;
}

declare enum ClrSelectedState {
    UNSELECTED = 0,
    SELECTED = 1,
    INDETERMINATE = 2
}

type AsyncArray<T> = T[] | null | undefined | Promise<T[] | null | undefined> | Observable<T[] | null | undefined>;

declare abstract class TreeNodeModel<T> {
    nodeId: string;
    expanded: boolean;
    model: T | null;
    textContent: string;
    loading$: BehaviorSubject<boolean>;
    selected: BehaviorSubject<ClrSelectedState>;
    private _loading;
    private _disabled;
    abstract parent: TreeNodeModel<T> | null;
    abstract children: TreeNodeModel<T>[];
    get loading(): boolean;
    set loading(isLoading: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    destroy(): void;
    setSelected(state: ClrSelectedState, propagateUp: boolean, propagateDown: boolean): void;
    toggleSelection(propagate: boolean): void;
    _updateSelectionFromChildren(): void;
    private computeSelectionStateFromChildren;
}

declare class RecursiveTreeNodeModel<T> extends TreeNodeModel<T> {
    private getChildren;
    private featuresService;
    parent: RecursiveTreeNodeModel<T> | null;
    private subscription;
    private childrenFetched;
    private _children;
    constructor(model: T, parent: RecursiveTreeNodeModel<T> | null, getChildren: (node: T) => AsyncArray<T> | undefined, featuresService: TreeFeaturesService<T> | undefined);
    get children(): RecursiveTreeNodeModel<T>[];
    set children(value: RecursiveTreeNodeModel<T>[]);
    destroy(): void;
    clearChildren(): void;
    fetchChildren(): void;
    private wrapChildren;
}

interface ClrRecursiveForOfContext<T> {
    $implicit: T;
    clrModel: TreeNodeModel<T>;
}
declare class ClrRecursiveForOf<T> implements OnChanges, OnDestroy {
    private template;
    private featuresService;
    private cdr;
    nodes: T | T[];
    getChildren: (node: T) => AsyncArray<T>;
    private childrenFetchSubscription;
    constructor(template: TemplateRef<ClrRecursiveForOfContext<T>>, featuresService: TreeFeaturesService<T>, cdr: ChangeDetectorRef);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRecursiveForOf<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRecursiveForOf<any>, "[clrRecursiveFor][clrRecursiveForOf]", never, { "nodes": { "alias": "clrRecursiveForOf"; "required": false; }; "getChildren": { "alias": "clrRecursiveForGetChildren"; "required": false; }; }, {}, never, never, false, never>;
}

declare class TreeFeaturesService<T> {
    selectable: boolean;
    eager: boolean;
    recursion: {
        template: TemplateRef<ClrRecursiveForOfContext<T>>;
        root: RecursiveTreeNodeModel<T>[];
    };
    childrenFetched: Subject<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFeaturesService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFeaturesService<any>>;
}

declare class TreeFocusManagerService<T> {
    rootNodeModels: TreeNodeModel<T>[];
    private focusedNodeId;
    private _focusRequest;
    private _focusChange;
    get focusRequest(): Observable<string>;
    get focusChange(): Observable<string>;
    focusNode(model: TreeNodeModel<T>): void;
    broadcastFocusedNode(nodeId: string): void;
    focusParent(model: TreeNodeModel<T>): void;
    focusFirstVisibleNode(): void;
    focusLastVisibleNode(): void;
    focusNodeAbove(model: TreeNodeModel<T>): void;
    focusNodeBelow(model: TreeNodeModel<T>): void;
    focusNodeStartsWith(searchString: string, model: TreeNodeModel<T>): void;
    private findSiblings;
    private findLastVisibleInNode;
    private findNextFocusable;
    private findLastVisibleInTree;
    private findNodeAbove;
    private findNodeBelow;
    private findDescendentNodeStartsWith;
    private findSiblingNodeStartsWith;
    private findRootNodeStartsWith;
    private findNodeStartsWith;
    private findClosestNodeStartsWith;
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeFocusManagerService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TreeFocusManagerService<any>>;
}

declare class ClrTree<T> implements AfterContentInit, OnDestroy {
    featuresService: TreeFeaturesService<T>;
    private focusManagerService;
    private renderer;
    private el;
    private rootNodes;
    private subscriptions;
    private _isMultiSelectable;
    constructor(featuresService: TreeFeaturesService<T>, focusManagerService: TreeFocusManagerService<T>, renderer: Renderer2, el: ElementRef<HTMLElement>, ngZone: NgZone);
    set lazy(value: boolean);
    get isMultiSelectable(): boolean;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    private setMultiSelectable;
    private setRootNodes;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTree<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTree<any>, "clr-tree", never, { "lazy": { "alias": "clrLazy"; "required": false; }; }, {}, ["rootNodes"], ["*"], false, never>;
}

declare class ClrTreeNodeLink {
    private el;
    constructor(el: ElementRef<HTMLElement>);
    get active(): boolean;
    activate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNodeLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTreeNodeLink, ".clr-treenode-link", never, {}, {}, never, never, false, never>;
}

declare class ClrTreeNode<T> implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    private platformId;
    featuresService: TreeFeaturesService<T>;
    expandService: IfExpandService;
    commonStrings: ClrCommonStringsService;
    private focusManager;
    private elementRef;
    expandable: boolean | undefined;
    selectedChange: EventEmitter<ClrSelectedState>;
    expandedChange: EventEmitter<boolean>;
    STATES: typeof ClrSelectedState;
    isModelLoading: boolean;
    nodeId: string;
    contentContainerTabindex: number;
    _model: TreeNodeModel<T>;
    private skipEmitChange;
    private typeAheadKeyBuffer;
    private typeAheadKeyEvent;
    private subscriptions;
    private contentContainer;
    private treeNodeLinkList;
    constructor(platformId: any, parent: ClrTreeNode<T>, featuresService: TreeFeaturesService<T>, expandService: IfExpandService, commonStrings: ClrCommonStringsService, focusManager: TreeFocusManagerService<T>, elementRef: ElementRef<HTMLElement>, injector: Injector);
    get disabled(): boolean;
    set disabled(value: boolean);
    get selected(): ClrSelectedState | boolean;
    set selected(value: ClrSelectedState | boolean);
    get expanded(): boolean;
    set expanded(value: boolean);
    set clrForTypeAhead(value: string);
    get ariaSelected(): boolean;
    get treeNodeLink(): ClrTreeNodeLink;
    private get isParent();
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    isExpandable(): boolean;
    isSelectable(): boolean;
    focusTreeNode(): void;
    broadcastFocusOnContainer(): void;
    onKeyDown(event: KeyboardEvent): void;
    private setTabIndex;
    private checkTabIndex;
    private toggleExpandOrTriggerDefault;
    private expandOrFocusFirstChild;
    private collapseOrFocusParent;
    private triggerDefaultAction;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeNode<any>, [null, { optional: true; skipSelf: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTreeNode<any>, "clr-tree-node", never, { "expandable": { "alias": "clrExpandable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; "selected": { "alias": "clrSelected"; "required": false; }; "expanded": { "alias": "clrExpanded"; "required": false; }; "clrForTypeAhead": { "alias": "clrForTypeAhead"; "required": false; }; }, { "selectedChange": "clrSelectedChange"; "expandedChange": "clrExpandedChange"; }, ["treeNodeLinkList"], ["*", "clr-tree-node", "[clrIfExpanded]"], false, never>;
}

declare class RecursiveChildren<T> {
    featuresService: TreeFeaturesService<T>;
    private expandService;
    parent: TreeNodeModel<T>;
    children: TreeNodeModel<T>[];
    subscription: Subscription;
    role: string;
    constructor(featuresService: TreeFeaturesService<T>, expandService: IfExpandService);
    ngAfterContentInit(): void;
    shouldRender(): boolean;
    getContext(node: TreeNodeModel<T>): ClrRecursiveForOfContext<T>;
    ngOnDestroy(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecursiveChildren<any>, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecursiveChildren<any>, "clr-recursive-children", never, { "parent": { "alias": "parent"; "required": false; }; "children": { "alias": "children"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_TREE_VIEW_DIRECTIVES: Type<any>[];
declare class ClrTreeViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTreeViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTreeViewModule, [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink, typeof RecursiveChildren], [typeof i6.CommonModule, typeof i40.ClrIcon, typeof i39.ClrLoadingModule], [typeof ClrTree, typeof ClrTreeNode, typeof ClrRecursiveForOf, typeof ClrTreeNodeLink]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTreeViewModule>;
}

declare class ClrStackView {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackView, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackView, "clr-stack-view", never, {}, {}, never, ["clr-stack-header", "*"], false, never>;
}

declare class ClrStackHeader {
    stackView: ClrStackView;
    /**
     * Depth of the stack view header starting from 1 for first level
     */
    ariaLevel: HeadingLevel;
    constructor(stackView: ClrStackView);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackHeader, "clr-stack-header", never, { "ariaLevel": { "alias": "clrStackHeaderLevel"; "required": false; }; }, {}, never, ["*", ".stack-action"], false, never>;
}

declare class ClrStackBlock implements OnInit {
    private parent;
    commonStrings: ClrCommonStringsService;
    expanded: boolean;
    expandable: boolean;
    /**
     * Depth of the stack view starting from 1 for first level
     */
    ariaLevel: HeadingLevel;
    expandedChange: EventEmitter<boolean>;
    stackBlockTitle: any;
    focused: boolean;
    uniqueId: string;
    private _changedChildren;
    private _fullyInitialized;
    private _changed;
    constructor(parent: ClrStackBlock, commonStrings: ClrCommonStringsService);
    set setChangedValue(value: boolean);
    get getChangedValue(): boolean;
    get onStackLabelFocus(): boolean;
    get labelledById(): any;
    get caretDirection(): string;
    get role(): string;
    get tabIndex(): string;
    get ariaExpanded(): string;
    ngOnInit(): void;
    addChild(): void;
    toggleExpand(event?: Event): void;
    getStackChildrenId(): string;
    protected preventDefaultIfNotInputEvent(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackBlock, [{ optional: true; skipSelf: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackBlock, "clr-stack-block", never, { "expanded": { "alias": "clrSbExpanded"; "required": false; }; "expandable": { "alias": "clrSbExpandable"; "required": false; }; "ariaLevel": { "alias": "clrStackViewLevel"; "required": false; }; "setChangedValue": { "alias": "clrSbNotifyChange"; "required": false; }; }, { "expandedChange": "clrSbExpandedChange"; }, ["stackBlockTitle"], ["clr-stack-label", "*", "clr-stack-block"], false, never>;
}

declare class ClrStackContentInput {
    uniqueId: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackContentInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackContentInput, "[clrStackInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrStackViewCustomTags {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewCustomTags, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStackViewCustomTags, "clr-stack-content", never, {}, {}, never, never, false, never>;
}
declare class ClrStackViewLabel implements OnInit {
    private _generatedId;
    private _id;
    get id(): string;
    set id(val: string);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStackViewLabel, "clr-stack-label", never, { "id": { "alias": "id"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const CLR_STACK_VIEW_DIRECTIVES: Type<any>[];
declare class ClrStackViewModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStackViewModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStackViewModule, [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags], [typeof i6.CommonModule, typeof i46.FormsModule, typeof i40.ClrIcon, typeof i39.ClrExpandableAnimationModule], [typeof ClrStackView, typeof ClrStackHeader, typeof ClrStackBlock, typeof ClrStackContentInput, typeof ClrStackViewLabel, typeof ClrStackViewCustomTags]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStackViewModule>;
}

export { CLR_DATAGRID_DIRECTIVES, CLR_STACK_VIEW_DIRECTIVES, CLR_TREE_VIEW_DIRECTIVES, ClrDataModule, ClrDatagrid, ClrDatagridActionBar, ClrDatagridActionOverflow, ClrDatagridAriaSortOrder, ClrDatagridCell, ClrDatagridColumn, ClrDatagridColumnSeparator, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton, ClrDatagridDetail, ClrDatagridDetailBody, ClrDatagridDetailHeader, ClrDatagridFilter, ClrDatagridFooter, ClrDatagridHideableColumn, ClrDatagridItems, ClrDatagridModule, ClrDatagridPageSize, ClrDatagridPagination, ClrDatagridPlaceholder, ClrDatagridRow, ClrDatagridRowDetail, ClrDatagridSortOrder, ClrIfDetail, ClrRecursiveForOf, ClrSelectedState, ClrStackBlock, ClrStackContentInput, ClrStackHeader, ClrStackView, ClrStackViewCustomTags, ClrStackViewLabel, ClrStackViewModule, ClrTree, ClrTreeNode, ClrTreeNodeLink, ClrTreeViewModule, DatagridNumericFilter, DatagridPropertyComparator, DatagridPropertyNumericFilter, DatagridPropertyStringFilter, DatagridStringFilter, Selection, ActionableOompaLoompa as ÇlrActionableOompaLoompa, DatagridCellRenderer as ÇlrDatagridCellRenderer, DatagridDetailRegisterer as ÇlrDatagridDetailRegisterer, DatagridHeaderRenderer as ÇlrDatagridHeaderRenderer, DatagridMainRenderer as ÇlrDatagridMainRenderer, DatagridRowDetailRenderer as ÇlrDatagridRowDetailRenderer, DatagridRowRenderer as ÇlrDatagridRowRenderer, ClrDatagridSelectionCellDirective as ÇlrDatagridSelectionCellDirective, ClrDatagridSingleSelectionValueAccessor as ÇlrDatagridSingleSelectionValueAccessor, ClrDatagridVirtualScrollDirective as ÇlrDatagridVirtualScrollDirective, DatagridWillyWonka as ÇlrDatagridWillyWonka, ExpandableOompaLoompa as ÇlrExpandableOompaLoompa, WrappedCell as ÇlrWrappedCell, WrappedColumn as ÇlrWrappedColumn, WrappedRow as ÇlrWrappedRow };
export type { ClrDatagridComparatorInterface, ClrDatagridFilterInterface, ClrDatagridItemsIdentityFunction, ClrDatagridNumericFilterInterface, ClrDatagridStateInterface, ClrDatagridStringFilterInterface, ClrDatagridVirtualScrollRangeInterface, ClrRecursiveForOfContext };
