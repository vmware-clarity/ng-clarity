import { ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Allows modal overflow area to be scrollable via keyboard.
 * The modal body will focus with keyboard navigation only.
 * This allows inner focusable items to be focused without
 * the overflow scroll being focused.
 */
export declare class ClrModalBody implements OnDestroy {
    private readonly renderer;
    private readonly host;
    private tabindex;
    private unlisteners;
    private observer;
    constructor(renderer: Renderer2, host: ElementRef<HTMLElement>, ngZone: NgZone);
    ngOnDestroy(): void;
    private addTabIndex;
    private removeTabIndex;
    private addOrRemoveTabIndex;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrModalBody, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrModalBody, ".modal-body", never, {}, {}, never, never, false, never>;
}
