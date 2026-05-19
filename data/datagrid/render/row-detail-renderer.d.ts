import { OnDestroy } from '@angular/core';
import { ColumnsService } from '../providers/columns.service';
import { DatagridRowRenderer } from './row-renderer';
import * as i0 from "@angular/core";
export declare class DatagridRowDetailRenderer extends DatagridRowRenderer implements OnDestroy {
    private parentRow;
    constructor(parentRow: DatagridRowRenderer, columnsService: ColumnsService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridRowDetailRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridRowDetailRenderer, "clr-dg-row-detail", never, {}, {}, never, never, false, never>;
}
