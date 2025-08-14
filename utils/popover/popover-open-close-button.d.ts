import { EventEmitter, OnDestroy } from '@angular/core';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class ClrPopoverOpenCloseButton implements OnDestroy {
    private smartOpenService;
    openCloseChange: EventEmitter<boolean>;
    private subscriptions;
    constructor(smartOpenService: ClrPopoverToggleService);
    handleClick(event: MouseEvent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverOpenCloseButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverOpenCloseButton, "[clrPopoverOpenCloseButton]", never, {}, { "openCloseChange": "clrPopoverOpenCloseChange"; }, never, never, false, never>;
}
