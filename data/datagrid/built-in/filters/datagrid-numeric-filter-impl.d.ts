import { Observable } from 'rxjs';
import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';
export declare class DatagridNumericFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridNumericFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Internal values and accessor
     */
    private _low;
    private _high;
    constructor(filterFn: ClrDatagridNumericFilterInterface<T>);
    get changes(): Observable<[number, number]>;
    get value(): [number, number];
    set value(vals: [number, number]);
    get low(): number;
    set low(low: number);
    get high(): number;
    set high(high: number);
    get state(): this | {
        property: string;
        low: number;
        high: number;
    };
    /**
     * Indicates if the filter is currently active, (at least one input is set)
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}
