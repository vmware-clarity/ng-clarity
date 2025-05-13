import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
export declare class DatagridPropertyStringFilter<T = any> implements ClrDatagridStringFilterInterface<T> {
    prop: string;
    exact: boolean;
    private nestedProp;
    constructor(prop: string, exact?: boolean);
    accepts(item: T, search: string): boolean;
}
