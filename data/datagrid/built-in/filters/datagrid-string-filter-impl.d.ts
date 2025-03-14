import { Observable } from 'rxjs';
import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
export declare class DatagridStringFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
    filterFn: ClrDatagridStringFilterInterface<T>;
    /**
     * The Observable required as part of the Filter interface
     */
    private _changes;
    /**
     * Input value converted to lowercase
     */
    private _lowerCaseValue;
    /**
     * Raw input value
     */
    private _rawValue;
    constructor(filterFn: ClrDatagridStringFilterInterface<T>);
    get changes(): Observable<string>;
    get lowerCaseValue(): string;
    get state(): this | {
        property: string;
        value: string;
    };
    get value(): string;
    /**
     * Common setter for the input value
     */
    set value(value: string);
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    isActive(): boolean;
    /**
     * Tests if an item matches a search text
     */
    accepts(item: T): boolean;
    equals(other: ClrDatagridFilterInterface<T, any>): boolean;
}
