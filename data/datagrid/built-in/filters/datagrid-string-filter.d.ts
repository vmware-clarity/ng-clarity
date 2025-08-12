import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { DomAdapter } from '../../../../utils/dom-adapter/dom-adapter';
import { ClrCommonStringsService } from '../../../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilter } from '../../datagrid-filter';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
import { CustomFilter } from '../../providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from '../../providers/filters';
import { DatagridFilterRegistrar } from '../../utils/datagrid-filter-registrar';
import { DatagridStringFilterImpl } from './datagrid-string-filter-impl';
import * as i0 from "@angular/core";
export declare class DatagridStringFilter<T = any> extends DatagridFilterRegistrar<T, DatagridStringFilterImpl<T>> implements CustomFilter, AfterViewInit, OnChanges, OnDestroy {
    private domAdapter;
    commonStrings: ClrCommonStringsService;
    private smartToggleService;
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
    constructor(filters: FiltersProvider<T>, domAdapter: DomAdapter, commonStrings: ClrCommonStringsService, smartToggleService: ClrPopoverToggleService, elementRef: ElementRef<HTMLElement>, cdr: ChangeDetectorRef, ngZone: NgZone);
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
    static ɵcmp: i0.ɵɵComponentDeclaration<DatagridStringFilter<any>, "clr-dg-string-filter", never, { "placeholder": "clrFilterPlaceholder"; "label": "clrFilterLabel"; "customStringFilter": "clrDgStringFilter"; "value": "clrFilterValue"; }, { "filterValueChange": "clrFilterValueChange"; }, never, never, false, never>;
}
