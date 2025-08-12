import { Observable } from 'rxjs';
import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';
import { Page } from './page';
import { StateDebouncer } from './state-debouncer.provider';
import * as i0 from "@angular/core";
export declare class FiltersProvider<T = any> {
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
export declare class RegisteredFilter<T, F extends ClrDatagridFilterInterface<T>> {
    filter: F;
    unregister: () => void;
    constructor(filter: F, unregister: () => void);
}
