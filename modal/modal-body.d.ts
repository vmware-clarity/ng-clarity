import { ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
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
}
