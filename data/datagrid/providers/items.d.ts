import { Observable } from 'rxjs';
import { FiltersProvider } from './filters';
import { Page } from './page';
import { Sort } from './sort';
import * as i0 from "@angular/core";
export declare type ClrDatagridItemsTrackByFunction<T> = (item: T) => any;
export declare class Items<T = any> {
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
    trackBy: ClrDatagridItemsTrackByFunction<T>;
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
