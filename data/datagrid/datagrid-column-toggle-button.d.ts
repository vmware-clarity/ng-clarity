import { Observable } from 'rxjs';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ColumnsService } from './providers/columns.service';
import * as i0 from "@angular/core";
export declare class ClrDatagridColumnToggleButton {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    private allSelected;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService);
    get clrAllSelected(): Observable<boolean>;
    get allHideablesVisible(): boolean;
    selectAll(): void;
    private hideableColumns;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridColumnToggleButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridColumnToggleButton, "clr-dg-column-toggle-button", never, {}, { "clrAllSelected": "clrAllSelected"; }, never, never, false, never>;
}
