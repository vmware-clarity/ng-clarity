import { AfterContentInit, AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy, QueryList, Renderer2, ViewContainerRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { SelectionType } from './enums/selection-type';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { DetailService } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { ClrDatagridItemsTrackByFunction, Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { StateProvider } from './providers/state.provider';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import * as i0 from "@angular/core";
export declare class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy {
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
     * Expose virtual scroll directive for applications to access its public methods
     */
    virtualScroll: ClrDatagridVirtualScrollDirective<any>;
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
    scrollableColumns: ViewContainerRef;
    _projectedDisplayColumns: ViewContainerRef;
    _projectedCalculationColumns: ViewContainerRef;
    _displayedRows: ViewContainerRef;
    _calculationRows: ViewContainerRef;
    selectAllId: string;
    SELECTION_TYPE: typeof SelectionType;
    /**
     * Subscriptions to all the services and queries changes
     */
    private _subscriptions;
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
    set trackBy(value: ClrDatagridItemsTrackByFunction<T>);
    /**
     * Indicates if all currently displayed items are selected
     */
    get allSelected(): boolean;
    set allSelected(_value: boolean);
    ngAfterContentInit(): void;
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    ngAfterViewInit(): void;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagrid<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagrid<any>, "clr-datagrid", never, { "loadingMoreItems": "clrLoadingMoreItems"; "clrDgSingleSelectionAriaLabel": "clrDgSingleSelectionAriaLabel"; "clrDgSingleActionableAriaLabel": "clrDgSingleActionableAriaLabel"; "clrDetailExpandableAriaLabel": "clrDetailExpandableAriaLabel"; "clrDgDisablePageFocus": "clrDgDisablePageFocus"; "loading": "clrDgLoading"; "selected": "clrDgSelected"; "singleSelected": "clrDgSingleSelected"; "clrDgPreserveSelection": "clrDgPreserveSelection"; "rowSelectionMode": "clrDgRowSelection"; "trackBy": "clrDgItemsTrackBy"; }, { "selectedChanged": "clrDgSelectedChange"; "singleSelectedChanged": "clrDgSingleSelectedChange"; "refresh": "clrDgRefresh"; }, ["virtualScroll", "iterator", "placeholder", "columns", "rows"], ["clr-dg-action-bar", "clr-dg-placeholder", "clr-dg-footer", "[clrIfDetail],clr-dg-detail"], false, never>;
}
