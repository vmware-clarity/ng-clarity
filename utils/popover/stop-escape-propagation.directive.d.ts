import { OnDestroy, OnInit } from '@angular/core';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
export declare class ClrStopEscapePropagationDirective implements OnInit, OnDestroy {
    private toggleService;
    private subscription;
    private lastOpenChange;
    constructor(toggleService: ClrPopoverToggleService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onEscapeKey(event: KeyboardEvent): void;
}
