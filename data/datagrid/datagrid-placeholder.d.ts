import { Items } from './providers/items';
import * as i0 from "@angular/core";
export declare class ClrDatagridPlaceholder<T = any> {
    private items;
    constructor(items: Items<T>);
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPlaceholder<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPlaceholder<any>, "clr-dg-placeholder", never, {}, {}, never, ["*"], false, never>;
}
