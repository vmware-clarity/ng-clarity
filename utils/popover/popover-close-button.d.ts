import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class ClrPopoverCloseButton implements OnDestroy, AfterViewInit {
    private elementRef;
    private smartEventsService;
    private smartOpenService;
    closeChange: EventEmitter<void>;
    private subscriptions;
    constructor(elementRef: ElementRef<HTMLButtonElement>, smartEventsService: ClrPopoverEventsService, smartOpenService: ClrPopoverToggleService);
    handleClick(event: MouseEvent): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverCloseButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverCloseButton, "[clrPopoverCloseButton]", never, {}, { "closeChange": "clrPopoverOnCloseChange"; }, never, never, false, never>;
}
