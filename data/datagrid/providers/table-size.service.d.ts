import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
export declare class TableSizeService {
    private platformId;
    private _tableRef;
    constructor(platformId: any);
    get tableRef(): HTMLElement;
    set tableRef(element: HTMLElement);
    set table(table: ElementRef<HTMLElement>);
    getColumnDragHeight(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TableSizeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TableSizeService>;
}
