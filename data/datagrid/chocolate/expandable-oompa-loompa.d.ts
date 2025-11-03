import { ChangeDetectorRef } from '@angular/core';
import { DatagridWillyWonka } from './datagrid-willy-wonka';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ExpandableRowsCount } from '../providers/global-expandable-rows';
export declare class ExpandableOompaLoompa extends OompaLoompa {
    private expandableCount;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, expandableCount: ExpandableRowsCount);
    get flavor(): boolean;
}
