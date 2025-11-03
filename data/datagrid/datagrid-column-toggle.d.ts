import { OnDestroy } from '@angular/core';
import { ColumnState } from './interfaces/column-state.interface';
import { ColumnsService } from './providers/columns.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrDatagridColumnToggle implements OnDestroy {
    commonStrings: ClrCommonStringsService;
    private columnsService;
    popoverId: string;
    openState: boolean;
    smartPosition: ClrPopoverPosition;
    readonly trackByFn: import("@angular/core").TrackByFunction<ColumnState>;
    private _allColumnsVisible;
    private subscription;
    private allSelectedElement;
    constructor(commonStrings: ClrCommonStringsService, columnsService: ColumnsService, popoverToggleService: ClrPopoverToggleService);
    get allColumnsVisible(): boolean;
    set allColumnsVisible(value: boolean);
    get hideableColumnStates(): ColumnState[];
    get hasOnlyOneVisibleColumn(): boolean;
    ngOnDestroy(): void;
    toggleColumnState(columnState: ColumnState, event: boolean): void;
    toggleSwitchPanel(): void;
    allColumnsSelected(): void;
}
