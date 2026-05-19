import { AfterContentInit, OnDestroy, QueryList } from '@angular/core';
import { ColumnsService } from '../providers/columns.service';
import { DatagridCellRenderer } from './cell-renderer';
import { DatagridRowDetailRenderer } from './row-detail-renderer';
import * as i0 from "@angular/core";
export declare class DatagridRowRenderer implements AfterContentInit, OnDestroy {
    private columnsService;
    cells: QueryList<DatagridCellRenderer>;
    expandableRows: DatagridRowDetailRenderer[];
    private subscriptions;
    constructor(columnsService: ColumnsService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setCellsState(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowRenderer, "clr-dg-row", never, {}, {}, ["cells"], never, false, never>;
}
