import { ExpandableRowsCount } from './providers/global-expandable-rows';
import * as i0 from "@angular/core";
export declare class DatagridDetailRegisterer {
    private expandableRowsCount;
    constructor(expandableRowsCount: ExpandableRowsCount);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridDetailRegisterer, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridDetailRegisterer, "[clrIfExpanded]", never, {}, {}, never, never, false, never>;
}
