/**
 * Generic accessor for deep object properties
 * that can be specified as simple dot-separated strings.
 */
export declare class NestedProperty<T = any> {
    private prop;
    private splitProp;
    constructor(prop: string);
    getPropValue(item: T): any;
}
