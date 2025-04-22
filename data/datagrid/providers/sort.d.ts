import { Observable } from 'rxjs';
import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';
import { StateDebouncer } from './state-debouncer.provider';
import * as i0 from "@angular/core";
export declare class Sort<T = any> {
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
