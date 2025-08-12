import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { RowActionService } from '../providers/row-action-service';
import { DatagridWillyWonka } from './datagrid-willy-wonka';
import * as i0 from "@angular/core";
export declare class ActionableOompaLoompa extends OompaLoompa {
    private rowActions;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, rowActions: RowActionService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActionableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ActionableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}
