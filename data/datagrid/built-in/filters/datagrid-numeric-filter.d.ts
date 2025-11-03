import { AfterViewInit, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { DatagridNumericFilterImpl } from './datagrid-numeric-filter-impl';
import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrCommonStringsService } from '../../../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
export declare class DatagridNumericFilter<T = any> extends DatagridFilterRegistrar<T, DatagridNumericFilterImpl<T>> implements CustomFilter, AfterViewInit {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private popoverToggleService;
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
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, popoverToggleService: ClrPopoverToggleService, ngZone: NgZone);
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
}
