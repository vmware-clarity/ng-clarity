import * as i0 from '@angular/core';
import { Injectable, DOCUMENT, PLATFORM_ID, HostListener, Inject, Directive, ContentChild, Input, Component, ElementRef, HostBinding, ViewChild, Optional, NgModule } from '@angular/core';
import * as i4 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective, ClrPopoverPosition, ClrPopoverType, SIGNPOST_POSITIONS, POPOVER_HOST_ORIGIN, ClrPopoverContent, ClrIfOpen, ClrPopoverModuleNext } from '@clr/angular/popover/common';
import { Subject } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i1 from '@clr/angular/utils';
import { uniqueIdFactory, ClrFocusOnViewInitModule } from '@clr/angular/utils';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, windowCloseIcon, infoCircleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class SignpostFocusManager {
    set triggerEl(value) {
        this._triggerEl = value;
    }
    focusTrigger() {
        if (this._triggerEl) {
            this._triggerEl.focus();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class SignpostIdService {
    constructor() {
        this._id = new Subject();
    }
    get id() {
        return this._id.asObservable();
    }
    setId(id) {
        this._id.next(id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*********
 *
 * @description
 * A Directive added to the ClrSignpost Trigger button that will call the ClrSignpost.toggle() function to hide/show the
 * ClrSignpostContent.
 *
 */
class ClrSignpostTrigger {
    constructor(popoverService, el, signpostIdService, signpostFocusManager, document, platformId) {
        this.popoverService = popoverService;
        this.el = el;
        this.signpostIdService = signpostIdService;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.ariaExpanded = false;
        this.subscriptions = [];
        this.document = document;
    }
    ngOnInit() {
        this.popoverService.origin = this.el;
        this.signpostFocusManager.triggerEl = this.el.nativeElement;
        this.subscriptions.push(this.popoverService.openChange.subscribe((isOpen) => {
            this.ariaExpanded = isOpen;
            const prevIsOpen = this.isOpen;
            this.isOpen = isOpen;
            // openChange fires false on initialization because signpost starts as closed by default
            // but we shouldn't focus on that initial false value
            // we should focus back only if it's closed after being opened
            if (!this.isOpen && prevIsOpen) {
                this.focusOnClose();
            }
        }), this.signpostIdService.id.subscribe(idChange => (this.ariaControl = idChange)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event) {
        this.popoverService.toggleWithEvent(event);
    }
    focusOnClose() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // we have to set the focus back on the trigger only if the focus is reset back to the body element
        // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
        if (!this.isOpen && this.document.activeElement === this.document.body) {
            this.signpostFocusManager.focusTrigger();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTrigger, deps: [{ token: i4.ClrPopoverService }, { token: i0.ElementRef }, { token: SignpostIdService }, { token: SignpostFocusManager }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostTrigger, isStandalone: false, selector: "[clrSignpostTrigger]", host: { listeners: { "click": "onSignpostTriggerClick($event)" }, properties: { "attr.aria-expanded": "ariaExpanded", "attr.aria-controls": "ariaControl", "class.active": "isOpen" }, classAttribute: "signpost-trigger" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSignpostTrigger]',
                    host: {
                        class: 'signpost-trigger',
                        '[attr.aria-expanded]': 'ariaExpanded',
                        '[attr.aria-controls]': 'ariaControl',
                        '[class.active]': 'isOpen',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i4.ClrPopoverService }, { type: i0.ElementRef }, { type: SignpostIdService }, { type: SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { onSignpostTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*********
 *
 * @class ClrSignpost
 *
 * @description
 * Class used to configure and control the state of a ClrSignpost and its associated ClrSignpostContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
class ClrSignpost {
    constructor(commonStrings, popoverService) {
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        /**********
         * @property useCustomTrigger
         *
         * @description
         * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
         *
         */
        this.useCustomTrigger = false;
        /**
         * Hides the default trigger button. Use when the signpost is opened
         * programmatically via `openAtPoint()` and no trigger icon is needed.
         */
        this.hideTrigger = false;
    }
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger) {
        this.useCustomTrigger = !!trigger;
    }
    get showDefaultTrigger() {
        return !this.useCustomTrigger && !this.hideTrigger;
    }
    openAtPoint(point) {
        this.popoverService.openAtPoint(point);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpost, deps: [{ token: i1.ClrCommonStringsService }, { token: i4.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrSignpost, isStandalone: false, selector: "clr-signpost", inputs: { signpostTriggerAriaLabel: ["clrSignpostTriggerAriaLabel", "signpostTriggerAriaLabel"], hideTrigger: ["clrSignpostHideTrigger", "hideTrigger"] }, host: { properties: { "class.signpost": "true" } }, providers: [SignpostFocusManager, SignpostIdService], queries: [{ propertyName: "customTrigger", first: true, predicate: ClrSignpostTrigger, descendants: true }], hostDirectives: [{ directive: i4.ClrPopoverHostDirective }], ngImport: i0, template: `
    @if (showDefaultTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: ClrSignpostTrigger, selector: "[clrSignpostTrigger]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpost, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost',
                    template: `
    @if (showDefaultTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `,
                    host: { '[class.signpost]': 'true' },
                    providers: [SignpostFocusManager, SignpostIdService],
                    hostDirectives: [ClrPopoverHostDirective],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ClrCommonStringsService }, { type: i4.ClrPopoverService }], propDecorators: { signpostTriggerAriaLabel: [{
                type: Input,
                args: ['clrSignpostTriggerAriaLabel']
            }], hideTrigger: [{
                type: Input,
                args: ['clrSignpostHideTrigger']
            }], customTrigger: [{
                type: ContentChild,
                args: [ClrSignpostTrigger]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSignpostContent {
    constructor(parentHost, element, commonStrings, signpostIdService, signpostFocusManager, platformId, document, popoverService, popoverContent) {
        this.element = element;
        this.commonStrings = commonStrings;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.document = document;
        this.popoverService = popoverService;
        this.popoverContent = popoverContent;
        this.signpostContentId = uniqueIdFactory();
        this._position = ClrPopoverPosition.RIGHT_MIDDLE;
        if (!parentHost) {
            throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
        }
        // Defaults
        signpostIdService.setId(this.signpostContentId);
        popoverService.panelClass.push('clr-signpost-container');
        popoverContent.contentType = ClrPopoverType.SIGNPOST;
    }
    /*********
     *
     * @description
     * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
     * - originPoint - where on the trigger to position the content
     * - popoverPoint - where on the content container to align with the origin
     * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
     * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
     * There are 12 possible positions to place a ClrSignpostContent container:
     * - top-left
     * - top-middle
     * - top-right
     * - right-top
     * - right-middle
     * - right-bottom
     * - bottom-right
     * - bottom-middle
     * - bottom-left
     * - left-bottom
     * - left-middle
     * - left-top
     *
     * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
     * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
     * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
     * linking the SignpostContent to the trigger points down at the horizontal center of the trigger icon.
     *
     * @param newPosition
     */
    get position() {
        return this._position;
    }
    set position(position) {
        const posIndex = SIGNPOST_POSITIONS.indexOf(position);
        this._position = position && posIndex > -1 ? SIGNPOST_POSITIONS[posIndex] : ClrPopoverPosition.RIGHT_MIDDLE;
        this.popoverContent.contentAt = this._position;
    }
    /*
     * Fallback to hide when *clrIfOpen is not being used
     */
    get isOffScreen() {
        return !this.popoverService.open;
    }
    /**********
     *
     * @description
     * Close function that uses the signpost instance to toggle the state of the content popover.
     *
     */
    close() {
        this.popoverService.open = false;
    }
    ngAfterViewInit() {
        this.popoverService.closeButtonRef = this.closeButton;
        this.closeButton.nativeElement.focus();
    }
    onKeyDown(event) {
        if (event.key === 'Tab') {
            const focusableElements = this.getFocusableElements(this.element.nativeElement);
            // take the first element when SHIFT+TAB or last when only TAB
            const focusableElementIndex = event.shiftKey ? 0 : focusableElements.length - 1;
            if (document.activeElement === focusableElements[focusableElementIndex]) {
                event.preventDefault();
                this.popoverService.open = false;
            }
        }
    }
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
            this.signpostFocusManager.focusTrigger();
        }
    }
    getFocusableElements(element) {
        return Array.from(element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostContent, deps: [{ token: POPOVER_HOST_ORIGIN, optional: true }, { token: i0.ElementRef }, { token: i1.ClrCommonStringsService }, { token: SignpostIdService }, { token: SignpostFocusManager }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: i4.ClrPopoverService }, { token: i4.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostContent, isStandalone: false, selector: "clr-signpost-content", inputs: { signpostCloseAriaLabel: ["clrSignpostCloseAriaLabel", "signpostCloseAriaLabel"], position: ["clrPosition", "position"] }, host: { attributes: { "role": "dialog" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.signpost-content": "true", "id": "signpostContentId", "class.is-off-screen": "this.isOffScreen" } }, viewQueries: [{ propertyName: "closeButton", first: true, predicate: ["closeButton"], descendants: true, read: ElementRef }], hostDirectives: [{ directive: i4.ClrPopoverContent }], ngImport: i0, template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost-content',
                    template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
                    host: {
                        '[class.signpost-content]': 'true',
                        '[id]': 'signpostContentId',
                        role: 'dialog',
                    },
                    standalone: false,
                    hostDirectives: [ClrPopoverContent],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ORIGIN]
                }] }, { type: i0.ElementRef }, { type: i1.ClrCommonStringsService }, { type: SignpostIdService }, { type: SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i4.ClrPopoverService }, { type: i4.ClrPopoverContent }], propDecorators: { signpostCloseAriaLabel: [{
                type: Input,
                args: ['clrSignpostCloseAriaLabel']
            }], closeButton: [{
                type: ViewChild,
                args: ['closeButton', { read: ElementRef }]
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }], isOffScreen: [{
                type: HostBinding,
                args: ['class.is-off-screen']
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSignpostTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostTitle, isStandalone: false, selector: "clr-signpost-title", host: { properties: { "class.signpost-title": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.signpost-title]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_SIGNPOST_DIRECTIVES = [
    ClrSignpost,
    ClrSignpostContent,
    ClrSignpostTrigger,
    ClrSignpostTitle,
];
class ClrSignpostModule {
    constructor() {
        ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, declarations: [ClrSignpost,
            ClrSignpostContent,
            ClrSignpostTrigger,
            ClrSignpostTitle], imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, ClrPopoverModuleNext, ClrIfOpen], exports: [ClrSignpost,
            ClrSignpostContent,
            ClrSignpostTrigger,
            ClrSignpostTitle, ClrIfOpen] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, ClrPopoverModuleNext] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, ClrPopoverModuleNext, ClrIfOpen],
                    declarations: [CLR_SIGNPOST_DIRECTIVES],
                    exports: [CLR_SIGNPOST_DIRECTIVES, ClrIfOpen],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_SIGNPOST_DIRECTIVES, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger };
//# sourceMappingURL=clr-angular-popover-signpost.mjs.map
