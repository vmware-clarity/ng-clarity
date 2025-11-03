import { Observable } from 'rxjs';
import { ColumnsService } from './providers/columns.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
export declare class ClrDatagridColumnToggleButton {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    private allSelected;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService);
    get clrAllSelected(): Observable<boolean>;
    get allHideablesVisible(): boolean;
    selectAll(): void;
    private hideableColumns;
}
