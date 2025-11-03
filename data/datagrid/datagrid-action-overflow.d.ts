import { EventEmitter, OnDestroy } from '@angular/core';
import { RowActionService } from './providers/row-action-service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrDatagridActionOverflow implements OnDestroy {
    private rowActionService;
    commonStrings: ClrCommonStringsService;
    private platformId;
    private smartToggleService;
    buttonLabel: string;
    openChange: EventEmitter<boolean>;
    popoverId: string;
    smartPosition: ClrPopoverPosition;
    private readonly keyFocus;
    private _open;
    private subscriptions;
    constructor(rowActionService: RowActionService, commonStrings: ClrCommonStringsService, platformId: any, smartToggleService: ClrPopoverToggleService);
    get open(): boolean;
    set open(open: boolean);
    ngOnDestroy(): void;
    closeOverflowContent(event: Event): void;
    private initializeFocus;
}
