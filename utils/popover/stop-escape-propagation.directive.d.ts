import { OnDestroy, OnInit } from '@angular/core';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class ClrStopEscapePropagationDirective implements OnInit, OnDestroy {
    private toggleService;
    private subscription;
    private lastOpenChange;
    constructor(toggleService: ClrPopoverToggleService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onEscapeKey(event: KeyboardEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStopEscapePropagationDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStopEscapePropagationDirective, never, never, {}, {}, never, never, true, never>;
}
