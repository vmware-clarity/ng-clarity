import { AfterContentInit, OnDestroy, QueryList } from '@angular/core';
import { DatagridCellRenderer } from './cell-renderer';
import { DatagridRowDetailRenderer } from './row-detail-renderer';
import { ColumnsService } from '../providers/columns.service';
export declare class DatagridRowRenderer implements AfterContentInit, OnDestroy {
    private columnsService;
    cells: QueryList<DatagridCellRenderer>;
    expandableRows: DatagridRowDetailRenderer[];
    private subscriptions;
    constructor(columnsService: ColumnsService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setCellsState(): void;
}
