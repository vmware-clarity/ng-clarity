import { EventEmitter, OnDestroy } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { RowActionService } from './providers/row-action-service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridActionOverflow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridActionOverflow, "clr-dg-action-overflow", never, { "buttonLabel": "clrDgActionOverflowButtonLabel"; "open": "clrDgActionOverflowOpen"; }, { "openChange": "clrDgActionOverflowOpenChange"; }, never, ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}
