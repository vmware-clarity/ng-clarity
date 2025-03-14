import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';
export declare class DatagridPropertyNumericFilter<T = any> implements ClrDatagridNumericFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, low: number, high: number): boolean;
}
