import { EventEmitter, OnDestroy } from '@angular/core';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
export declare class ClrPopoverOpenCloseButton implements OnDestroy {
    private smartOpenService;
    openCloseChange: EventEmitter<boolean>;
    private subscriptions;
    constructor(smartOpenService: ClrPopoverToggleService);
    handleClick(event: MouseEvent): void;
    ngOnDestroy(): void;
}
