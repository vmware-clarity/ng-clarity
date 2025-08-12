import { AfterContentChecked, OnDestroy, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { ClrPopoverPosition } from './interfaces/popover-position.interface';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverPositionService } from './providers/popover-position.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import * as i0 from "@angular/core";
/** @dynamic */
export declare class ClrPopoverContent implements AfterContentChecked, OnDestroy {
    private document;
    private container;
    private template;
    private renderer;
    private smartPositionService;
    private smartEventsService;
    private smartOpenService;
    private view;
    private subscriptions;
    private removeClickListenerFn;
    private shouldRealign;
    private previousContentHeight;
    private checkCollector;
    constructor(document: Document, container: ViewContainerRef, template: TemplateRef<any>, renderer: Renderer2, smartPositionService: ClrPopoverPositionService, smartEventsService: ClrPopoverEventsService, smartOpenService: ClrPopoverToggleService);
    set open(value: boolean);
    set contentAt(position: ClrPopoverPosition);
    set outsideClickClose(clickToClose: boolean);
    set scrollToClose(scrollToClose: boolean);
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * TODO(matt): investigate why DebugElement retains a reference to the nodes and causes a memory leak.
     * A note about the use of appendChild/removeChild
     * The DebugElement is keeping a reference to the detached node and its unclear why.
     * This does warrant further investigation. But, since it doesn't happen in production mode
     * it is a low priority issue for now.
     */
    private addContent;
    private removeContent;
    private alignContent;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPopoverContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPopoverContent, "[clrPopoverContent]", never, { "open": "clrPopoverContent"; "contentAt": "clrPopoverContentAt"; "outsideClickClose": "clrPopoverContentOutsideClickToClose"; "scrollToClose": "clrPopoverContentScrollToClose"; }, {}, never, never, false, never>;
}
