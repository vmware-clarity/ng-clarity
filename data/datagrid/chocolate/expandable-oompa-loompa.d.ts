import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ExpandableRowsCount } from '../providers/global-expandable-rows';
import { DatagridWillyWonka } from './datagrid-willy-wonka';
import * as i0 from "@angular/core";
export declare class ExpandableOompaLoompa extends OompaLoompa {
    private expandableCount;
    constructor(cdr: ChangeDetectorRef, willyWonka: DatagridWillyWonka, expandableCount: ExpandableRowsCount);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ExpandableOompaLoompa, "clr-datagrid, clr-dg-row", never, {}, {}, never, never, false, never>;
}
