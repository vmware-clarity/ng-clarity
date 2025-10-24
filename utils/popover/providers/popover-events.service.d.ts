import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ClrPopoverToggleService } from './popover-toggle.service';
import * as i0 from "@angular/core";
/** @dynamic */
export declare class ClrPopoverEventsService implements OnDestroy {
    private renderer;
    private smartOpenService;
    private document;
    outsideClickClose: boolean;
    scrollToClose: boolean;
    ignoredEvent: any;
    anchorButtonRef: ElementRef<HTMLButtonElement>;
    closeButtonRef: ElementRef<HTMLButtonElement>;
    contentRef: ElementRef<HTMLElement>;
    private documentClickListener;
    private escapeListener;
    private scrollSubscription;
    private subscriptions;
    private documentScroller;
    constructor(renderer: Renderer2, smartOpenService: ClrPopoverToggleService, document: HTMLDocument);
    ngOnDestroy(): void;
    addScrollListener(): void;
    removeScrollListener(): void;
    addClickListener(): void;
    removeClickListener(): void;
    addEscapeListener(): void;
    removeEscapeListener(): void;
    setCloseFocus(): void;
    setAnchorFocus(): void;
    private testForSmartPopoverContentContainer;
    private removeAllEventListeners;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverEventsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrPopoverEventsService>;
}
