import { ElementRef, OnDestroy } from '@angular/core';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrSignpostTrigger implements OnDestroy {
    private toggleService;
    private el;
    private signpostIdService;
    private signpostFocusManager;
    private platformId;
    ariaExpanded: boolean;
    ariaControl: string;
    isOpen: boolean;
    private document;
    private subscriptions;
    constructor(toggleService: ClrPopoverToggleService, el: ElementRef<HTMLElement>, signpostIdService: SignpostIdService, signpostFocusManager: SignpostFocusManager, document: any, platformId: any);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event: Event): void;
    private focusOnClose;
}
