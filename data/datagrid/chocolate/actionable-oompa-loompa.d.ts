import { ChangeDetectorRef } from '@angular/core';
import { DatagridWillyWonka } from './datagrid-willy-wonka';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { RowActionService } from '../providers/row-action-service';
export declare class ActionableOompaLoompa extends OompaLoompa {
    private rowActions;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, rowActions: RowActionService);
    get flavor(): boolean;
}
