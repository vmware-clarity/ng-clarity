import { OnDestroy } from '@angular/core';
import { DatagridRowRenderer } from './row-renderer';
import { ColumnsService } from '../providers/columns.service';
export declare class DatagridRowDetailRenderer extends DatagridRowRenderer implements OnDestroy {
    private parentRow;
    constructor(parentRow: DatagridRowRenderer, columnsService: ColumnsService);
    ngOnDestroy(): void;
}
