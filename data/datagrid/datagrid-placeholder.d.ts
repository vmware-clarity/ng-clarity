import { Items } from './providers/items';
export declare class ClrDatagridPlaceholder<T = any> {
    private items;
    constructor(items: Items<T>);
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid(): boolean;
}
