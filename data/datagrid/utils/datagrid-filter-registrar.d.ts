import { OnDestroy } from '@angular/core';
import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';
import { FiltersProvider, RegisteredFilter } from '../providers/filters';
export declare abstract class DatagridFilterRegistrar<T, F extends ClrDatagridFilterInterface<T>> implements OnDestroy {
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
}
