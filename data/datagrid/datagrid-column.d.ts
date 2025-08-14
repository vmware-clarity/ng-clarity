import { ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { ClrDatagridComparatorInterface } from './interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { DetailService } from './providers/detail.service';
import { FiltersProvider } from './providers/filters';
import { Sort } from './providers/sort';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
export declare class ClrDatagridColumn<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements OnDestroy, OnInit, OnChanges {
    private el;
    private _sort;
    private vcr;
    private detailService;
    private changeDetectorRef;
    private commonStrings;
    filterStringPlaceholder: string;
    filterNumberMaxPlaceholder: string;
    filterNumberMinPlaceholder: string;
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
    get colType(): 'string' | 'number';
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
    get ariaSort(): "none" | "ascending" | "descending";
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumn<any>, "clr-dg-column", never, { "filterStringPlaceholder": "clrFilterStringPlaceholder"; "filterNumberMaxPlaceholder": "clrFilterNumberMaxPlaceholder"; "filterNumberMinPlaceholder": "clrFilterNumberMinPlaceholder"; "colType": "clrDgColType"; "field": "clrDgField"; "sortBy": "clrDgSortBy"; "sortOrder": "clrDgSortOrder"; "updateFilterValue": "clrFilterValue"; }, { "sortOrderChange": "clrDgSortOrderChange"; "filterValueChange": "clrFilterValueChange"; }, ["projectedFilter"], ["clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter", "*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}
