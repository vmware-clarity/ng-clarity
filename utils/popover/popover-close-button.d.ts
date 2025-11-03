import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
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
}
