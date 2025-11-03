import { ClrCommonStringsService } from '../../utils';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { Selection } from './providers/selection';
export declare class ClrDatagridFooter<T = any> {
    selection: Selection<T>;
    detailService: DetailService;
    private columnsService;
    commonStrings: ClrCommonStringsService;
    SELECTION_TYPE: typeof SelectionType;
    constructor(selection: Selection<T>, detailService: DetailService, columnsService: ColumnsService, commonStrings: ClrCommonStringsService);
    get hasHideableColumns(): boolean;
}
