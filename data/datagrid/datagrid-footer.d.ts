import { ClrCommonStringsService } from '../../utils';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { Selection } from './providers/selection';
import * as i0 from "@angular/core";
export declare class ClrDatagridFooter<T = any> {
    selection: Selection<T>;
    detailService: DetailService;
    private columnsService;
    commonStrings: ClrCommonStringsService;
    SELECTION_TYPE: typeof SelectionType;
    constructor(selection: Selection<T>, detailService: DetailService, columnsService: ColumnsService, commonStrings: ClrCommonStringsService);
    get hasHideableColumns(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridFooter<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridFooter<any>, "clr-dg-footer", never, {}, {}, never, ["*", "clr-dg-pagination"], false, never>;
}
