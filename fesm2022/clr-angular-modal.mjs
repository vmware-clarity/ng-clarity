import * as i0 from '@angular/core';
import { PLATFORM_ID, Inject, Injectable, EventEmitter, inject, Injector, afterNextRender, ViewChild, ContentChild, Input, Output, HostBinding, ChangeDetectionStrategy, Component, Directive, NgModule, HostListener } from '@angular/core';
import * as i1 from '@clr/angular/utils';
import { Keys, uniqueIdFactory, noopAnimations, ScrollingService, CdkTrapFocusModule } from '@clr/angular/utils';
import * as i4 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, windowCloseIcon, ClrIcon, pinIcon, unpinIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ModalStackService {
    constructor(platformId) {
        this.platformId = platformId;
        this.modalStack = [];
        this.keyUpEventListener = this.onKeyUp.bind(this);
    }
    trackModalOpen(openedModal) {
        if (this.modalStack.includes(openedModal) === false) {
            this.modalStack.unshift(openedModal);
        }
        if (isPlatformBrowser(this.platformId)) {
            document.body.addEventListener('keyup', this.keyUpEventListener);
        }
    }
    trackModalClose(closedModal) {
        const closedModalIndex = this.modalStack.indexOf(closedModal);
        if (closedModalIndex > -1) {
            this.modalStack.splice(closedModalIndex, 1);
        }
        if (this.modalStack.length === 0 && isPlatformBrowser(this.platformId)) {
            document.body.removeEventListener('keyup', this.keyUpEventListener);
        }
    }
    onKeyUp(event) {
        if (this.modalStack.length && event.key === Keys.Escape) {
            // We blur the active element because escaping with an input element in focus could cause
            // an ExpressionChangedAfterItHasBeenCheckedError for the touched state. (CDE-1662)
            document.activeElement.blur();
            this.modalStack[0].close();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ModalStackService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ModalStackService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ModalStackService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrModalConfigurationService {
    constructor() {
        this.fadeMove = 'fadeDown';
        this.backdrop = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalConfigurationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalConfigurationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalConfigurationService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Enter animation of the dialog for each supported `fadeMove` value. */
const FADE_MOVE_ENTER_CLASSES = {
    fadeDown: 'clr-fade-slide-down-enter',
    fadeLeft: 'clr-fade-slide-left-enter',
    fadeUp: 'clr-fade-slide-up-enter',
};
class ClrModal {
    constructor(_scrollingService, commonStrings, modalStackService, configuration) {
        this._scrollingService = _scrollingService;
        this.commonStrings = commonStrings;
        this.modalStackService = modalStackService;
        this.configuration = configuration;
        this.modalId = uniqueIdFactory();
        this._open = false;
        this._openChanged = new EventEmitter(false);
        this.closable = true;
        this.closeButtonAriaLabel = this.commonStrings.keys.close;
        this.size = 'md';
        this.staticBackdrop = true;
        this.skipAnimation = false;
        this.stopClose = false;
        this.altClose = new EventEmitter(false);
        // presently this is only used by inline wizards
        this.bypassScrollService = false;
        this.injector = inject(Injector);
        this.noopAnimations = noopAnimations();
        this.destroyed = false;
        /** Set when the modal closes, until it opens again: identifies the closing to notify. */
        this.closeRequest = null;
    }
    get fadeMove() {
        return this.skipAnimation ? '' : this.configuration.fadeMove;
    }
    set fadeMove(move) {
        this.configuration.fadeMove = move;
    }
    get backdrop() {
        return this.configuration.backdrop;
    }
    /** Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped or off. */
    get dialogEnterClass() {
        return this.noopAnimations ? '' : (FADE_MOVE_ENTER_CLASSES[this.fadeMove] ?? '');
    }
    /** Class animating the backdrop in, meant for its `animate.enter` binding. Empty when animations are off. */
    get backdropEnterClass() {
        return this.noopAnimations ? '' : 'clr-fade-enter';
    }
    // Track the opening and closing driven by the clrModalOpen input: page scrolling, the modal stack and the
    // clrModalOpenChange(false) notification (emitted on an input-driven close too, as before).
    ngOnChanges(changes) {
        if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
            if (changes._open.currentValue) {
                this.closeRequest = null;
                if (!this.bypassScrollService) {
                    this._scrollingService.stopScrolling();
                    this.modalStackService.trackModalOpen(this);
                }
            }
            else {
                this.notifyClosing();
                if (!this.bypassScrollService) {
                    this._scrollingService.resumeScrolling();
                }
            }
        }
    }
    ngOnDestroy() {
        this.destroyed = true;
        this._scrollingService.resumeScrolling();
        // A modal destroyed while open must not keep handling the Escape key.
        this.modalStackService.trackModalClose(this);
    }
    open() {
        if (this._open) {
            return;
        }
        this._open = true;
        this.closeRequest = null;
        this._openChanged.emit(true);
        this.modalStackService.trackModalOpen(this);
    }
    backdropClick() {
        if (this.staticBackdrop) {
            return;
        }
        this.close();
    }
    close() {
        if (this.stopClose) {
            this.altClose.emit(false);
            return;
        }
        if (!this.closable || !this._open) {
            return;
        }
        this._open = false;
        this.notifyClosing();
    }
    /** @deprecated No longer called: `clrModalOpenChange` is emitted when the modal closes. To be removed in a future major version. */
    fadeDone(_e) {
        // Nothing to do.
    }
    scrollTop() {
        this.bodyElementRef.nativeElement.scrollTo(0, 0);
    }
    /**
     * Emits `clrModalOpenChange(false)` after the closing render, once the dialog is removed and the focus trap has given
     * the focus back, so that a handler can move the focus elsewhere.
     * Once per closing, and not when the modal was not rendered, opens again in between, or is destroyed.
     */
    notifyClosing() {
        if (this.closeRequest || !this.dialogElementRef) {
            return;
        }
        const closeRequest = (this.closeRequest = {});
        afterNextRender(() => {
            if (closeRequest === this.closeRequest && !this.destroyed) {
                this._openChanged.emit(false);
                this.modalStackService.trackModalClose(this);
            }
        }, { injector: this.injector });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModal, deps: [{ token: i1.ScrollingService }, { token: i1.ClrCommonStringsService }, { token: ModalStackService }, { token: ClrModalConfigurationService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.1.2", type: ClrModal, isStandalone: false, selector: "clr-modal", inputs: { _open: ["clrModalOpen", "_open"], closable: ["clrModalClosable", "closable"], closeButtonAriaLabel: ["clrModalCloseButtonAriaLabel", "closeButtonAriaLabel"], size: ["clrModalSize", "size"], staticBackdrop: ["clrModalStaticBackdrop", "staticBackdrop"], skipAnimation: ["clrModalSkipAnimation", "skipAnimation"], stopClose: ["clrModalPreventClose", "stopClose"], labelledBy: ["clrModalLabelledById", "labelledBy"], bypassScrollService: ["clrModalOverrideScrollService", "bypassScrollService"] }, outputs: { _openChanged: "clrModalOpenChange", altClose: "clrModalAlternateClose" }, host: { properties: { "class.open": "this._open" } }, queries: [{ propertyName: "modalContentTemplate", first: true, predicate: ["clrInternalModalContentTemplate"], descendants: true }], viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }, { propertyName: "dialogElementRef", first: true, predicate: ["dialog"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (_open) {\n<div class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <div\n    #dialog\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [animate.enter]=\"dialogEnterClass\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    @if (!modalContentTemplate) {\n    <div class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          @if (closable) {\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n          }\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    } @else {\n    <ng-template [ngTemplateOutlet]=\"modalContentTemplate\"></ng-template>\n    }\n  </div>\n  <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  @if (backdrop) {\n  <div\n    [animate.enter]=\"backdropEnterClass\"\n    class=\"modal-backdrop\"\n    [class.static]=\"staticBackdrop\"\n    aria-hidden=\"true\"\n    (click)=\"backdropClick()\"\n  ></div>\n  }\n</div>\n}\n", styles: [":host{display:none}:host.open{display:inline}\n"], dependencies: [{ kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge", "innerOffset"] }], viewProviders: [ScrollingService], changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModal, decorators: [{
            type: Component,
            args: [{ selector: 'clr-modal', viewProviders: [ScrollingService], standalone: false, changeDetection: ChangeDetectionStrategy.Eager, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (_open) {\n<div class=\"modal\" [class.modal-full-screen]=\"size == 'full-screen'\">\n  <div\n    #dialog\n    cdkTrapFocus\n    [cdkTrapFocusAutoCapture]=\"true\"\n    [animate.enter]=\"dialogEnterClass\"\n    class=\"modal-dialog\"\n    [class.modal-sm]=\"size == 'sm'\"\n    [class.modal-lg]=\"size == 'lg'\"\n    [class.modal-xl]=\"size == 'xl'\"\n    role=\"dialog\"\n    aria-modal=\"true\"\n    [attr.aria-hidden]=\"!_open\"\n    [attr.aria-labelledby]=\"labelledBy || modalId\"\n  >\n    <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n    <!-- This wizard is tightly coupled to the modal styles, so changes here could require changes in the wizard. -->\n    @if (!modalContentTemplate) {\n    <div class=\"modal-content-wrapper\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header--accessible\">\n          <ng-content select=\".leading-button\"></ng-content>\n          <div class=\"modal-title-wrapper\" #title [id]=\"modalId\" cdkFocusInitial tabindex=\"-1\">\n            <ng-content select=\".modal-title\"></ng-content>\n          </div>\n          @if (closable) {\n          <button\n            type=\"button\"\n            [attr.aria-label]=\"closeButtonAriaLabel || commonStrings.keys.close\"\n            class=\"close\"\n            (click)=\"close()\"\n          >\n            <cds-icon shape=\"window-close\"></cds-icon>\n          </button>\n          }\n        </div>\n        <div #body class=\"modal-body-wrapper\">\n          <ng-content select=\".modal-body\"></ng-content>\n        </div>\n        <ng-content select=\".modal-footer\"></ng-content>\n      </div>\n    </div>\n    } @else {\n    <ng-template [ngTemplateOutlet]=\"modalContentTemplate\"></ng-template>\n    }\n  </div>\n  <div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n  @if (backdrop) {\n  <div\n    [animate.enter]=\"backdropEnterClass\"\n    class=\"modal-backdrop\"\n    [class.static]=\"staticBackdrop\"\n    aria-hidden=\"true\"\n    (click)=\"backdropClick()\"\n  ></div>\n  }\n</div>\n}\n", styles: [":host{display:none}:host.open{display:inline}\n"] }]
        }], ctorParameters: () => [{ type: i1.ScrollingService }, { type: i1.ClrCommonStringsService }, { type: ModalStackService }, { type: ClrModalConfigurationService }], propDecorators: { title: [{
                type: ViewChild,
                args: ['title']
            }], _open: [{
                type: Input,
                args: ['clrModalOpen']
            }, {
                type: HostBinding,
                args: ['class.open']
            }], _openChanged: [{
                type: Output,
                args: ['clrModalOpenChange']
            }], closable: [{
                type: Input,
                args: ['clrModalClosable']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['clrModalCloseButtonAriaLabel']
            }], size: [{
                type: Input,
                args: ['clrModalSize']
            }], staticBackdrop: [{
                type: Input,
                args: ['clrModalStaticBackdrop']
            }], skipAnimation: [{
                type: Input,
                args: ['clrModalSkipAnimation']
            }], stopClose: [{
                type: Input,
                args: ['clrModalPreventClose']
            }], altClose: [{
                type: Output,
                args: ['clrModalAlternateClose']
            }], labelledBy: [{
                type: Input,
                args: ['clrModalLabelledById']
            }], bypassScrollService: [{
                type: Input,
                args: ['clrModalOverrideScrollService']
            }], modalContentTemplate: [{
                type: ContentChild,
                args: ['clrInternalModalContentTemplate']
            }], bodyElementRef: [{
                type: ViewChild,
                args: ['body']
            }], dialogElementRef: [{
                type: ViewChild,
                args: ['dialog']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Allows modal overflow area to be scrollable via keyboard.
 * The modal body will focus with keyboard navigation only.
 * This allows inner focusable items to be focused without
 * the overflow scroll being focused.
 */
class ClrModalBody {
    constructor(renderer, host, ngZone) {
        this.renderer = renderer;
        this.host = host;
        this.tabindex = '0';
        this.unlisteners = [];
        ngZone.runOutsideAngular(() => {
            this.observer = new ResizeObserver(() => this.addOrRemoveTabIndex());
            this.observer.observe(host.nativeElement);
            this.unlisteners.push(renderer.listen(host.nativeElement, 'mouseup', () => {
                // set the tabindex binding back when click is completed with mouseup
                this.addOrRemoveTabIndex();
            }), renderer.listen(host.nativeElement, 'mousedown', () => {
                // tabindex = 0 binding should be removed
                // so it won't be focused when click starts with mousedown
                this.removeTabIndex();
            }));
        });
    }
    ngOnDestroy() {
        while (this.unlisteners.length) {
            this.unlisteners.pop()();
        }
        this.observer.disconnect();
        this.observer = null;
    }
    addTabIndex() {
        this.renderer.setAttribute(this.host.nativeElement, 'tabindex', this.tabindex);
    }
    removeTabIndex() {
        this.renderer.removeAttribute(this.host.nativeElement, 'tabindex');
    }
    addOrRemoveTabIndex() {
        const modalBody = this.host.nativeElement.parentElement;
        if (modalBody && modalBody.clientHeight < modalBody.scrollHeight) {
            this.addTabIndex();
        }
        else {
            this.removeTabIndex();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalBody, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrModalBody, isStandalone: false, selector: ".modal-body", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalBody, decorators: [{
            type: Directive,
            args: [{
                    selector: '.modal-body',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrModalHostComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalHostComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "22.1.2", type: ClrModalHostComponent, isStandalone: false, selector: "[clrModalHost]", host: { properties: { "class.clr-modal-host": "true" } }, ngImport: i0, template: `
    <div class="clr-modal-host-scrollable">
      <ng-content></ng-content>
    </div>
  `, isInline: true, changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalHostComponent, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrModalHost]',
                    host: { '[class.clr-modal-host]': 'true' },
                    template: `
    <div class="clr-modal-host-scrollable">
      <ng-content></ng-content>
    </div>
  `,
                    standalone: false,
                    changeDetection: ChangeDetectionStrategy.Eager,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_MODAL_DIRECTIVES = [ClrModal, ClrModalBody, ClrModalHostComponent];
class ClrModalModule {
    constructor() {
        ClarityIcons.addIcons(windowCloseIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrModalModule, declarations: [ClrModal, ClrModalBody, ClrModalHostComponent], imports: [CommonModule, CdkTrapFocusModule, ClrIcon], exports: [ClrModal, ClrModalBody, ClrModalHostComponent, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalModule, imports: [CommonModule, CdkTrapFocusModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrModalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, CdkTrapFocusModule, ClrIcon],
                    declarations: [CLR_MODAL_DIRECTIVES],
                    exports: [CLR_MODAL_DIRECTIVES, ClrIcon],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSidePanel {
    constructor(element, configuration, commonStrings) {
        this.element = element;
        this.configuration = configuration;
        this.commonStrings = commonStrings;
        this.openChange = new EventEmitter(false);
        this.skipAnimation = false;
        this.staticBackdrop = false;
        this.closable = true;
        this.preventClose = false;
        this.altClose = new EventEmitter(false);
        this._pinnable = false;
        this._pinned = false;
        this._position = 'right';
        this.__open = false;
        this._size = 'md';
    }
    get _open() {
        return this.__open;
    }
    set _open(open) {
        if (open !== this.__open) {
            this.__open = open;
            if (this.pinned) {
                this.updateModalState();
            }
        }
    }
    get size() {
        return this._size;
    }
    set size(value) {
        if (!value) {
            value = 'md';
        }
        if (this._size !== value) {
            this._size = value;
            if (this.pinned) {
                this.updateModalState();
            }
        }
    }
    get position() {
        return this._position;
    }
    set position(position) {
        if (position && position !== this._position) {
            this._position = position;
            if (this._position === 'right') {
                this.configuration.fadeMove = 'fadeLeft';
            }
            else if (this._position === 'bottom') {
                this.configuration.fadeMove = 'fadeUp';
            }
        }
    }
    get pinned() {
        return this._pinned;
    }
    set pinned(pinned) {
        this._pinned = pinned;
        if (this.modal) {
            this.updateModalState();
        }
    }
    get clrSidePanelBackdrop() {
        return this.configuration.backdrop;
    }
    set clrSidePanelBackdrop(backdrop) {
        if (backdrop !== undefined) {
            this.configuration.backdrop = backdrop;
        }
    }
    get clrSidePanelPinnable() {
        return this._pinnable;
    }
    set clrSidePanelPinnable(pinnable) {
        this._pinnable = pinnable;
    }
    get modal() {
        return this._modal;
    }
    set modal(modal) {
        this._modal = modal;
        this.originalStopClose = this.modal.stopClose;
        this.updateModalState();
    }
    get hostElement() {
        return this.element.nativeElement.closest('.clr-modal-host') || document.body;
    }
    get bottomPositionCssClass() {
        return this.position === 'bottom';
    }
    ngOnInit() {
        this.configuration.fadeMove = 'fadeLeft';
        if (this.position === 'bottom') {
            this.configuration.fadeMove = 'fadeUp';
        }
    }
    ngOnDestroy() {
        this.cleanupPinnedClasses();
    }
    handleModalOpen(open) {
        if (open) {
            this.updateModalState();
        }
        else {
            this.cleanupPinnedClasses();
        }
        this.openChange.emit(open);
    }
    open() {
        this.modal.open();
    }
    close() {
        this.modal.close();
    }
    togglePinned() {
        this.pinned = !this.pinned;
    }
    documentClick(event) {
        if (!this.element.nativeElement.contains(event.target) &&
            this.modal._open &&
            !this.configuration.backdrop) {
            this.modal.close();
        }
    }
    updateModalState() {
        if (!this.modal) {
            return;
        }
        if (this.pinned) {
            this.modal.stopClose = true;
            if (this.__open) {
                this.updatePinnedClasses();
            }
        }
        else {
            this.modal.stopClose = this.originalStopClose;
            this.cleanupPinnedClasses();
        }
    }
    cleanupPinnedClasses() {
        [this.hostElement, document.body].forEach(host => {
            host.classList.forEach(className => {
                if (className.startsWith('clr-side-panel-pinned-')) {
                    host.classList.remove(className);
                }
            });
        });
    }
    updatePinnedClasses() {
        this.cleanupPinnedClasses();
        this.hostElement.classList.add(`clr-side-panel-pinned-${this.position}-${this.size}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanel, deps: [{ token: i0.ElementRef }, { token: ClrModalConfigurationService }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.1.2", type: ClrSidePanel, isStandalone: false, selector: "clr-side-panel", inputs: { closeButtonAriaLabel: ["clrSidePanelCloseButtonAriaLabel", "closeButtonAriaLabel"], skipAnimation: ["clrSidePanelSkipAnimation", "skipAnimation"], labelledById: ["clrSidePanelLabelledById", "labelledById"], staticBackdrop: ["clrSidePanelStaticBackdrop", "staticBackdrop"], closable: ["clrSidePanelClosable", "closable"], preventClose: ["clrSidePanelPreventClose", "preventClose"], _open: ["clrSidePanelOpen", "_open"], size: ["clrSidePanelSize", "size"], position: ["clrSidePanelPosition", "position"], pinned: ["clrSidePanelPinned", "pinned"], clrSidePanelBackdrop: "clrSidePanelBackdrop", clrSidePanelPinnable: "clrSidePanelPinnable" }, outputs: { openChange: "clrSidePanelOpenChange", altClose: "clrSidePanelAlternateClose" }, host: { listeners: { "document:pointerup": "documentClick($event)" }, properties: { "class.side-panel": "true", "class.side-panel-bottom": "this.bottomPositionCssClass" } }, viewQueries: [{ propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  [clrModalClosable]=\"closable\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  @if (clrSidePanelPinnable) {\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  }\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge", "innerOffset"] }, { kind: "component", type: ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: ClrModalBody, selector: ".modal-body" }], changeDetection: i0.ChangeDetectionStrategy.Eager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanel, decorators: [{
            type: Component,
            args: [{ selector: 'clr-side-panel', host: {
                        '[class.side-panel]': 'true',
                    }, standalone: false, changeDetection: ChangeDetectionStrategy.Eager, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  (clrModalOpenChange)=\"handleModalOpen($event)\"\n  [clrModalCloseButtonAriaLabel]=\"closeButtonAriaLabel\"\n  [clrModalSize]=\"size\"\n  [clrModalSkipAnimation]=\"skipAnimation\"\n  [clrModalStaticBackdrop]=\"staticBackdrop\"\n  [clrModalLabelledById]=\"labelledById\"\n  [clrModalPreventClose]=\"preventClose\"\n  [clrModalClosable]=\"closable\"\n  (clrModalAlternateClose)=\"altClose.emit($event)\"\n  [clrModalOverrideScrollService]=\"true\"\n>\n  @if (clrSidePanelPinnable) {\n  <button\n    type=\"button\"\n    [attr.aria-label]=\"commonStrings.keys.sidePanelPin\"\n    class=\"leading-button pinnable\"\n    (click)=\"togglePinned()\"\n  >\n    <cds-icon [shape]=\"pinned ? 'unpin' : 'pin'\"></cds-icon>\n  </button>\n  }\n  <div class=\"modal-title\"><ng-content select=\".side-panel-title\"></ng-content></div>\n  <div class=\"modal-body\"><ng-content select=\".side-panel-body\"></ng-content></div>\n  <div class=\"modal-footer\"><ng-content select=\".side-panel-footer\"></ng-content></div>\n</clr-modal>\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ClrModalConfigurationService }, { type: i1.ClrCommonStringsService }], propDecorators: { openChange: [{
                type: Output,
                args: ['clrSidePanelOpenChange']
            }], closeButtonAriaLabel: [{
                type: Input,
                args: ['clrSidePanelCloseButtonAriaLabel']
            }], skipAnimation: [{
                type: Input,
                args: ['clrSidePanelSkipAnimation']
            }], labelledById: [{
                type: Input,
                args: ['clrSidePanelLabelledById']
            }], staticBackdrop: [{
                type: Input,
                args: ['clrSidePanelStaticBackdrop']
            }], closable: [{
                type: Input,
                args: ['clrSidePanelClosable']
            }], preventClose: [{
                type: Input,
                args: ['clrSidePanelPreventClose']
            }], altClose: [{
                type: Output,
                args: ['clrSidePanelAlternateClose']
            }], _open: [{
                type: Input,
                args: ['clrSidePanelOpen']
            }], size: [{
                type: Input,
                args: ['clrSidePanelSize']
            }], position: [{
                type: Input,
                args: ['clrSidePanelPosition']
            }], pinned: [{
                type: Input,
                args: ['clrSidePanelPinned']
            }], clrSidePanelBackdrop: [{
                type: Input
            }], clrSidePanelPinnable: [{
                type: Input
            }], modal: [{
                type: ViewChild,
                args: [ClrModal]
            }], bottomPositionCssClass: [{
                type: HostBinding,
                args: ['class.side-panel-bottom']
            }], documentClick: [{
                type: HostListener,
                args: ['document:pointerup', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_SIDEPANEL_DIRECTIVES = [ClrSidePanel];
class ClrSidePanelModule {
    constructor() {
        ClarityIcons.addIcons(pinIcon, unpinIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanelModule, declarations: [ClrSidePanel], imports: [CommonModule, CdkTrapFocusModule, ClrIcon, ClrModalModule], exports: [ClrSidePanel, ClrModalModule, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanelModule, imports: [CommonModule, CdkTrapFocusModule, ClrIcon, ClrModalModule, ClrModalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrSidePanelModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, CdkTrapFocusModule, ClrIcon, ClrModalModule],
                    declarations: [CLR_SIDEPANEL_DIRECTIVES],
                    exports: [CLR_SIDEPANEL_DIRECTIVES, ClrModalModule, ClrIcon],
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

export { CLR_MODAL_DIRECTIVES, CLR_SIDEPANEL_DIRECTIVES, ClrModal, ClrModalBody, ClrModalConfigurationService, ClrModalHostComponent, ClrModalModule, ClrSidePanel, ClrSidePanelModule, ModalStackService };
//# sourceMappingURL=clr-angular-modal.mjs.map
