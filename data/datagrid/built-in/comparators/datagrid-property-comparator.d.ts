import { ClrDatagridComparatorInterface } from '../../interfaces/comparator.interface';
export declare class DatagridPropertyComparator<T = any> implements ClrDatagridComparatorInterface<T> {
    prop: string;
    private nestedProp;
    constructor(prop: string);
    compare(a: T, b: T): number;
}
