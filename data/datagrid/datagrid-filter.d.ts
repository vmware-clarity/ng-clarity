import { ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';
import { CustomFilter } from './providers/custom-filter';
import { FiltersProvider, RegisteredFilter } from './providers/filters';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import * as i0 from "@angular/core";
/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
export declare class ClrDatagridFilter<T = any> extends DatagridFilterRegistrar<T, ClrDatagridFilterInterface<T>> implements CustomFilter, OnDestroy {
    commonStrings: ClrCommonStringsService;
    private smartToggleService;
    private platformId;
    private elementRef;
    private keyNavigation;
    openChange: EventEmitter<boolean>;
    ariaExpanded: boolean;
    popoverId: string;
    smartPosition: ClrPopoverPosition;
    anchor: ElementRef<HTMLButtonElement>;
    private _open;
    private subs;
    constructor(_filters: FiltersProvider<T>, commonStrings: ClrCommonStringsService, smartToggleService: ClrPopoverToggleService, platformId: any, elementRef: ElementRef<HTMLElement>, keyNavigation: KeyNavigationGridController);
    get open(): boolean;
    set open(open: boolean);
    set customFilter(filter: ClrDatagridFilterInterface<T> | RegisteredFilter<T, ClrDatagridFilterInterface<T>>);
    /**
     * Indicates if the filter is currently active
     */
    get active(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFilter<any>, [null, null, null, null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFilter<any>, "clr-dg-filter", never, { "open": "clrDgFilterOpen"; "customFilter": "clrDgFilter"; }, { "openChange": "clrDgFilterOpenChange"; }, never, ["*"], false, never>;
}
