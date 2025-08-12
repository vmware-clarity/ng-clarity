import { Observable } from 'rxjs';
import { StateDebouncer } from './state-debouncer.provider';
import * as i0 from "@angular/core";
export declare class Page {
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
