/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild, } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ClrModal } from '../modal/modal';
import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ButtonHubService } from './providers/button-hub.service';
import { HeaderActionService } from './providers/header-actions.service';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardHeaderAction } from './wizard-header-action';
import { ClrWizardPage } from './wizard-page';
import { ClrWizardTitle } from './wizard-title';
import * as i0 from "@angular/core";
import * as i1 from "../utils";
import * as i2 from "./providers/wizard-navigation.service";
import * as i3 from "./providers/page-collection.service";
import * as i4 from "./providers/button-hub.service";
import * as i5 from "./providers/header-actions.service";
import * as i6 from "@angular/common";
import * as i7 from "../modal/modal";
import * as i8 from "../modal/modal-body";
import * as i9 from "./wizard-stepnav";
export class ClrWizard {
    constructor(platformId, commonStrings, navService, pageCollection, buttonService, headerActionService, elementRef, differs) {
        this.platformId = platformId;
        this.commonStrings = commonStrings;
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        this.headerActionService = headerActionService;
        this.elementRef = elementRef;
        /**
         * Set the aria-label for the stepnav section of the wizard. Set using `[clrWizardStepnavAriaLabel]` input.
         */
        this.stepnavAriaLabel = this.commonStrings.keys.wizardStepnavAriaLabel;
        /**
         * Set the modal size of the wizard. Set using `[clrWizardSize]` input.
         */
        this.size = 'xl';
        /**
         * Tells the modal part of the wizard whether it should have a close "X"
         * in the top right corner. Set using `[clrWizardClosable]` input.
         */
        this.closable = true;
        /**
         * Used to communicate to the underlying modal that animations are not
         * wanted. Primary use is for the display of static/inline wizards.
         * Set using `[clrWizardPreventModalAnimation]` input.
         */
        this._stopModalAnimations = false;
        /**
         * Emits when the wizard is opened or closed.
         * Listen via `(clrWizardOpenChange)` event.
         */
        this._openChanged = new EventEmitter(false);
        /**
         * Emits when the wizard is canceled. Listen via `(clrWizardOnCancel)` event.
         * Can be combined with the `[clrWizardPreventDefaultCancel]` input to create
         * wizard-level custom cancel routines.
         */
        this.onCancel = new EventEmitter(false);
        /**
         * Emits when the wizard is completed. Listen via `(clrWizardOnFinish)` event.
         * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
         * wizard-level custom completion routines.
         */
        this.wizardFinished = new EventEmitter(false);
        /**
         * Emits when the wizard is reset. Listen via `(clrWizardOnReset)` event.
         */
        this.onReset = new EventEmitter(false);
        /**
         * Emits when the current page has changed. Listen via `(clrWizardCurrentPageChanged)` event.
         * output. Useful for non-blocking validation.
         */
        this.currentPageChanged = new EventEmitter(false);
        /**
         * Emits when the wizard moves to the next page. Listen via `(clrWizardOnNext)` event.
         * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
         * wizard-level custom navigation routines, which are useful for validation.
         */
        this.onMoveNext = new EventEmitter(false);
        /**
         * Emits when the wizard moves to the previous page. Can be useful for validation.
         * Listen via `(clrWizardOnPrevious)` event.
         */
        this.onMovePrevious = new EventEmitter(false);
        this._open = false;
        this.wizardId = uniqueIdFactory();
        this._forceForward = false;
        this._stopNext = false;
        this._stopCancel = false;
        this._stopNavigation = false;
        this._disableStepnav = false;
        this.subscriptions = [];
        this.subscriptions.push(this.listenForNextPageChanges(), this.listenForPreviousPageChanges(), this.listenForCancelChanges(), this.listenForFinishedChanges(), this.listenForPageChanges());
        this.differ = differs.find([]).create(null);
    }
    /**
     * Resets page completed states when navigating backwards.
     * Set using `[clrWizardForceForwardNavigation]` input.
     */
    get forceForward() {
        return this._forceForward;
    }
    set forceForward(value) {
        this._forceForward = !!value;
        this.navService.forceForwardNavigation = value;
    }
    /**
     * Toggles open/close of the wizard component.
     * Set using the `[clrWizardOpen]` input.
     */
    set clrWizardOpen(open) {
        if (open) {
            this.buttonService.buttonsReady = true;
        }
        this._open = open;
    }
    /**
     * Prevents ClrWizard from moving to the next page or closing itself on finishing.
     * Set using the `[clrWizardPreventDefaultNext]` input. Note that using stopNext
     * will require you to create your own calls to .next() and .finish() in your
     * host component to make the ClrWizard work as expected.
     */
    get stopNext() {
        return this._stopNext;
    }
    set stopNext(value) {
        this._stopNext = !!value;
        this.navService.wizardHasAltNext = value;
    }
    /**
     * Prevents ClrWizard from closing when the cancel button or close "X" is clicked.
     * Set using the `[clrWizardPreventDefaultCancel]` input.
     *
     * Note that using stopCancel will require you to create your own calls to `close()` in your host compone`nt
     * to make the ClrWizard work as expected. Useful for doing checks or prompts
     * before closing a ClrWizard.
     */
    get stopCancel() {
        return this._stopCancel;
    }
    set stopCancel(value) {
        this._stopCancel = !!value;
        this.navService.wizardHasAltCancel = value;
    }
    /**
     * Prevents ClrWizard from performing any form of navigation away from the current
     * page. Set using the `[clrWizardPreventNavigation]` input.
     * Note that stopNavigation is meant to freeze the wizard in place, typically
     * during a long validation or background action where you want the wizard to
     * display loading content but not allow the user to execute navigation in
     * the stepnav, close X, or the  back, finish, or next buttons.
     */
    get stopNavigation() {
        return this._stopNavigation;
    }
    set stopNavigation(value) {
        this._stopNavigation = !!value;
        this.navService.wizardStopNavigation = value;
    }
    /**
     * Prevents clicks on the links in the stepnav from working.
     * Set using `[clrWizardDisableStepnav]` input.
     * A more granular bypassing of navigation which can be useful when your
     * ClrWizard is in a state of completion and you don't want users to be
     * able to jump backwards and change things.
     */
    get disableStepnav() {
        return this._disableStepnav;
    }
    set disableStepnav(value) {
        this._disableStepnav = !!value;
        this.navService.wizardDisableStepnav = value;
    }
    get currentPage() {
        return this.navService.currentPage;
    }
    set currentPage(page) {
        this.navService.goTo(page, true);
    }
    get isLast() {
        return this.navService.currentPageIsLast;
    }
    get isFirst() {
        return this.navService.currentPageIsFirst;
    }
    get isInline() {
        return this.elementRef.nativeElement.classList.contains('clr-wizard--inline');
    }
    get stopModalAnimations() {
        return this._stopModalAnimations;
    }
    ngAfterContentInit() {
        this.pageCollection.pages = this.pages;
        this.headerActionService.wizardHeaderActions = this.headerActions;
        this.initializeButtons();
    }
    ngDoCheck() {
        this.updateNavOnPageChanges();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    /**
     * Marks Wizard as finished. By default it does not execute event
     * emissions or checks before completing and closing. This method is commonly
     * used as part of an alternative navigation with `[clrWizardPreventDefaultNext]`.
     *
     * If `skipChecksAndEmits` is true, the wizard will complete and close
     * regardless of the state of its current page. This is useful for alternative
     * navigation where event emissions have already been done and firing them again
     * may cause an event loop.
     */
    finish(skipChecksAndEmits = true) {
        if (skipChecksAndEmits) {
            this.forceFinish();
        }
        else {
            this.navService.finish();
        }
    }
    /**
     * Marks the wizard as finished but does run checks and emissions.
     * Good for a last step in an alternate workflow. Does the same thing as
     * calling `ClrWizard.finish(true)` or `ClrWizard.finish()` without a parameter.
     */
    forceFinish() {
        if (this.stopNavigation) {
            return;
        }
        this.close();
    }
    /**
     * Opens the wizard. If there is no current page defined, sets the first page in the wizard to be current.
     */
    open() {
        this._open = true;
        if (!this.currentPage) {
            this.navService.setFirstPageCurrent();
        }
        // Only render buttons when wizard is opened, to avoid chocolate errors
        this.buttonService.buttonsReady = true;
        this._openChanged.emit(true);
    }
    /**
     * Closes the wizard. Call this directly instead of `cancel()` to implement alternative cancel functionality.
     */
    close() {
        if (this.stopNavigation) {
            return;
        }
        this._open = false;
        this._openChanged.emit(false);
    }
    /**
     * Used to open and close the wizard. By default the wizard will
     * close if invoked with no parameter. If parameter is true wizard will open
     * else if false will close.
     */
    toggle(open) {
        if (open) {
            this.open();
        }
        else {
            this.close();
        }
    }
    /**
     * Moves the wizard to the previous page.
     */
    previous() {
        this.navService.previous();
    }
    /**
     * By default, `next()` does not execute event emissions.
     * This method is commonly called as part of an alternative navigation
     * with `[clrWizardPreventDefaultNext]`. The wizard will move to the next page
     * regardless of the state of its current page. This is useful for alternative
     * navigation where event emissions have already been done and firing them again
     * may cause an event loop.
     *
     * If `skipChecksAndEmits` is false, the wizard will execute default checks
     * and emit events as normal. This is useful for custom buttons or programmatic
     * workflows that are not executing the wizards default checks and emissions.
     * It is another way to navigate without having to rewrite the wizard’s default
     * functionality from scratch.
     */
    next(skipChecksAndEmits = true) {
        if (skipChecksAndEmits) {
            this.forceNext();
        }
        else {
            this.navService.next();
        }
    }
    /**
     * Moves the wizard to the next page without the checks and emissions.
     * Good for a last step in an alternate workflow.
     * Alias for `ClrWizard.next(true)` or `ClrWizard.next()`
     */
    forceNext() {
        this.navService.forceNext();
    }
    /**
     * Cancels and closes the wizard. Do not use this for an override of the cancel
     * the functionality with `[clrWizardPreventDefaultCancel]`, `[clrWizardPreventPageDefaultCancel]`,
     * or `[clrWizardPagePreventDefault]` because it will initiate the same checks
     * and event emissions that invoked your event handler. Use `ClrWizard.close()` instead.
     */
    cancel() {
        this.navService.cancel();
    }
    /**
     * Overrides behavior of the underlying modal to avoid collisions with
     * alternative cancel functionality. In most cases, use `ClrWizard.cancel()` instead.
     */
    modalCancel() {
        if (this.closable) {
            this.checkAndCancel();
        }
    }
    /**
     * Checks for alternative cancel flows defined at the current page or
     * wizard level. Performs a canceled if not. Emits events that initiate
     * the alternative cancel outputs `(clrWizardPageOnCancel)` and `(clrWizardOnCancel)`.
     */
    checkAndCancel() {
        const currentPage = this.currentPage;
        const currentPageHasOverrides = currentPage.stopCancel || currentPage.preventDefault;
        if (this.stopNavigation) {
            return;
        }
        currentPage.pageOnCancel.emit();
        if (!currentPageHasOverrides) {
            this.onCancel.emit();
        }
        if (!this.stopCancel && !currentPageHasOverrides) {
            this.close();
        }
    }
    /**
     * Navigates to a given page in the Wizard. Navigation will invoke the wizard’s default
     * checks and event emissions.
     *
     * The format of the expected ID parameter can be found in the return of the
     * ClrWizardPage.id getter, usually prefixed with `clr-wizard-page-` and then either a
     * numeric ID or the ID specified for the `ClrWizardPage` component’s `id` input.
     */
    goTo(pageId) {
        if (!pageId) {
            return;
        }
        this.navService.goTo(pageId);
    }
    /**
     * Reset sets all WizardPages to incomplete and sets the first page in the `ClrWizard` to
     * be the current page, resetting the wizard navigation.
     * Use `(clrWizardOnReset)` event to reset the data or model of your wizard.
     */
    reset() {
        this.pageCollection.reset();
        this.onReset.emit();
    }
    listenForNextPageChanges() {
        return this.navService.movedToNextPage.pipe(filter(() => isPlatformBrowser(this.platformId))).subscribe(() => {
            this.onMoveNext.emit();
            this.pageTitle?.nativeElement.focus();
        });
    }
    listenForPreviousPageChanges() {
        return this.navService.movedToPreviousPage.pipe(filter(() => isPlatformBrowser(this.platformId))).subscribe(() => {
            this.onMovePrevious.emit();
            this.pageTitle?.nativeElement.focus();
        });
    }
    listenForCancelChanges() {
        return this.navService.notifyWizardCancel.subscribe(() => this.checkAndCancel());
    }
    listenForFinishedChanges() {
        return this.navService.wizardFinished.subscribe(() => this.emitWizardFinished());
    }
    listenForPageChanges() {
        return this.navService.currentPageChanged.subscribe(() => {
            // Added to address VPAT-749:
            //   When clicking on a wizard tab, focus should move to that
            //   tabs content to make the wizard more accessible.
            this.pageTitle?.nativeElement.focus();
            this.currentPageChanged.emit();
            // scroll to top of page in case there is long page content
            this.modal?.scrollTop();
        });
    }
    updateNavOnPageChanges() {
        const changes = this.differ.diff(this.pages);
        if (changes) {
            changes.forEachAddedItem(() => this.navService.updateNavigation());
            changes.forEachRemovedItem(() => this.navService.updateNavigation());
        }
    }
    initializeButtons() {
        // Only trigger buttons ready if default is open (inlined)
        if (this._open) {
            this.buttonService.buttonsReady = true;
        }
    }
    emitWizardFinished() {
        if (!this.stopNext) {
            this.forceFinish();
        }
        this.wizardFinished.emit();
    }
}
ClrWizard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizard, deps: [{ token: PLATFORM_ID }, { token: i1.ClrCommonStringsService }, { token: i2.WizardNavigationService }, { token: i3.PageCollectionService }, { token: i4.ButtonHubService }, { token: i5.HeaderActionService }, { token: i0.ElementRef }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Component });
ClrWizard.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizard, selector: "clr-wizard", inputs: { stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"], size: ["clrWizardSize", "size"], closable: ["clrWizardClosable", "closable"], _stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"], forceForward: ["clrWizardForceForwardNavigation", "forceForward"], clrWizardOpen: "clrWizardOpen", stopNext: ["clrWizardPreventDefaultNext", "stopNext"], stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"], stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"], disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"] }, outputs: { _openChanged: "clrWizardOpenChange", onCancel: "clrWizardOnCancel", wizardFinished: "clrWizardOnFinish", onReset: "clrWizardOnReset", currentPageChanged: "clrWizardCurrentPageChanged", onMoveNext: "clrWizardOnNext", onMovePrevious: "clrWizardOnPrevious" }, host: { properties: { "class.clr-wizard": "true", "class.wizard-md": "size == 'md'", "class.wizard-lg": "size == 'lg'", "class.wizard-xl": "size == 'xl'" } }, providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], queries: [{ propertyName: "wizardTitle", first: true, predicate: ClrWizardTitle, descendants: true }, { propertyName: "pages", predicate: ClrWizardPage, descendants: true }, { propertyName: "headerActions", predicate: ClrWizardHeaderAction }], viewQueries: [{ propertyName: "pageTitle", first: true, predicate: ["pageTitle"], descendants: true }, { propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n    <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle.headingLevel || 1\">\n      <ng-content select=\"clr-wizard-title\"></ng-content>\n    </div>\n    <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n  </div>\n\n  <div class=\"modal-title\" role=\"heading\" [attr.aria-level]=\"navService.currentPage?.pageTitle.headingLevel || 2\">\n    <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n      <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n    </span>\n\n    <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n      <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n        <ng-content select=\"clr-wizard-header-action\"></ng-content>\n      </div>\n      <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"modal-body\">\n    <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n      <ng-content></ng-content>\n    </main>\n  </div>\n  <div class=\"modal-footer clr-wizard-footer\">\n    <div class=\"clr-wizard-footer-buttons\">\n      <div\n        *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-content select=\"clr-wizard-button\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n      </div>\n    </div>\n  </div>\n</clr-modal>\n", dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i7.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i8.ClrModalBody, selector: ".modal-body" }, { kind: "component", type: i9.ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: ["label"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-wizard', providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], host: {
                        '[class.clr-wizard]': 'true',
                        '[class.wizard-md]': "size == 'md'",
                        '[class.wizard-lg]': "size == 'lg'",
                        '[class.wizard-xl]': "size == 'xl'",
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n    <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle.headingLevel || 1\">\n      <ng-content select=\"clr-wizard-title\"></ng-content>\n    </div>\n    <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n  </div>\n\n  <div class=\"modal-title\" role=\"heading\" [attr.aria-level]=\"navService.currentPage?.pageTitle.headingLevel || 2\">\n    <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n      <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n    </span>\n\n    <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n      <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n        <ng-content select=\"clr-wizard-header-action\"></ng-content>\n      </div>\n      <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"modal-body\">\n    <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n      <ng-content></ng-content>\n    </main>\n  </div>\n  <div class=\"modal-footer clr-wizard-footer\">\n    <div class=\"clr-wizard-footer-buttons\">\n      <div\n        *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-content select=\"clr-wizard-button\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n      </div>\n    </div>\n  </div>\n</clr-modal>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.ClrCommonStringsService }, { type: i2.WizardNavigationService }, { type: i3.PageCollectionService }, { type: i4.ButtonHubService }, { type: i5.HeaderActionService }, { type: i0.ElementRef }, { type: i0.IterableDiffers }]; }, propDecorators: { stepnavAriaLabel: [{
                type: Input,
                args: ['clrWizardStepnavAriaLabel']
            }], size: [{
                type: Input,
                args: ['clrWizardSize']
            }], closable: [{
                type: Input,
                args: ['clrWizardClosable']
            }], _stopModalAnimations: [{
                type: Input,
                args: ['clrWizardPreventModalAnimation']
            }], _openChanged: [{
                type: Output,
                args: ['clrWizardOpenChange']
            }], onCancel: [{
                type: Output,
                args: ['clrWizardOnCancel']
            }], wizardFinished: [{
                type: Output,
                args: ['clrWizardOnFinish']
            }], onReset: [{
                type: Output,
                args: ['clrWizardOnReset']
            }], currentPageChanged: [{
                type: Output,
                args: ['clrWizardCurrentPageChanged']
            }], onMoveNext: [{
                type: Output,
                args: ['clrWizardOnNext']
            }], onMovePrevious: [{
                type: Output,
                args: ['clrWizardOnPrevious']
            }], pageTitle: [{
                type: ViewChild,
                args: ['pageTitle']
            }], pages: [{
                type: ContentChildren,
                args: [ClrWizardPage, { descendants: true }]
            }], headerActions: [{
                type: ContentChildren,
                args: [ClrWizardHeaderAction]
            }], wizardTitle: [{
                type: ContentChild,
                args: [ClrWizardTitle]
            }], modal: [{
                type: ViewChild,
                args: [ClrModal]
            }], forceForward: [{
                type: Input,
                args: ['clrWizardForceForwardNavigation']
            }], clrWizardOpen: [{
                type: Input,
                args: ['clrWizardOpen']
            }], stopNext: [{
                type: Input,
                args: ['clrWizardPreventDefaultNext']
            }], stopCancel: [{
                type: Input,
                args: ['clrWizardPreventDefaultCancel']
            }], stopNavigation: [{
                type: Input,
                args: ['clrWizardPreventNavigation']
            }], disableStepnav: [{
                type: Input,
                args: ['clrWizardDisableStepnav']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvd2l6YXJkL3dpemFyZC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFFTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUVYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFhaEQsTUFBTSxPQUFPLFNBQVM7SUF1RnBCLFlBQytCLFVBQWUsRUFDcEMsYUFBc0MsRUFDdkMsVUFBbUMsRUFDbkMsY0FBcUMsRUFDckMsYUFB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O3NCQURqQixLQUFLO3VCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENsck1vZGFsIH0gZnJvbSAnLi4vbW9kYWwvbW9kYWwnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyB1bmlxdWVJZEZhY3RvcnkgfSBmcm9tICcuLi91dGlscy9pZC1nZW5lcmF0b3IvaWQtZ2VuZXJhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgQnV0dG9uSHViU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2J1dHRvbi1odWIuc2VydmljZSc7XG5pbXBvcnQgeyBIZWFkZXJBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvaGVhZGVyLWFjdGlvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBQYWdlQ29sbGVjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wYWdlLWNvbGxlY3Rpb24uc2VydmljZSc7XG5pbXBvcnQgeyBXaXphcmROYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3dpemFyZC1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkSGVhZGVyQWN0aW9uIH0gZnJvbSAnLi93aXphcmQtaGVhZGVyLWFjdGlvbic7XG5pbXBvcnQgeyBDbHJXaXphcmRQYWdlIH0gZnJvbSAnLi93aXphcmQtcGFnZSc7XG5pbXBvcnQgeyBDbHJXaXphcmRUaXRsZSB9IGZyb20gJy4vd2l6YXJkLXRpdGxlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXdpemFyZCcsXG4gIHByb3ZpZGVyczogW1dpemFyZE5hdmlnYXRpb25TZXJ2aWNlLCBQYWdlQ29sbGVjdGlvblNlcnZpY2UsIEJ1dHRvbkh1YlNlcnZpY2UsIEhlYWRlckFjdGlvblNlcnZpY2VdLFxuICB0ZW1wbGF0ZVVybDogJy4vd2l6YXJkLmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5jbHItd2l6YXJkXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLndpemFyZC1tZF0nOiBcInNpemUgPT0gJ21kJ1wiLFxuICAgICdbY2xhc3Mud2l6YXJkLWxnXSc6IFwic2l6ZSA9PSAnbGcnXCIsXG4gICAgJ1tjbGFzcy53aXphcmQteGxdJzogXCJzaXplID09ICd4bCdcIixcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyV2l6YXJkIGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0LCBEb0NoZWNrIHtcbiAgLyoqXG4gICAqIFNldCB0aGUgYXJpYS1sYWJlbCBmb3IgdGhlIHN0ZXBuYXYgc2VjdGlvbiBvZiB0aGUgd2l6YXJkLiBTZXQgdXNpbmcgYFtjbHJXaXphcmRTdGVwbmF2QXJpYUxhYmVsXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFN0ZXBuYXZBcmlhTGFiZWwnKSBzdGVwbmF2QXJpYUxhYmVsID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMud2l6YXJkU3RlcG5hdkFyaWFMYWJlbDtcblxuICAvKipcbiAgICogU2V0IHRoZSBtb2RhbCBzaXplIG9mIHRoZSB3aXphcmQuIFNldCB1c2luZyBgW2NscldpemFyZFNpemVdYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkU2l6ZScpIHNpemUgPSAneGwnO1xuXG4gIC8qKlxuICAgKiBUZWxscyB0aGUgbW9kYWwgcGFydCBvZiB0aGUgd2l6YXJkIHdoZXRoZXIgaXQgc2hvdWxkIGhhdmUgYSBjbG9zZSBcIlhcIlxuICAgKiBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lci4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkQ2xvc2FibGVdYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkQ2xvc2FibGUnKSBjbG9zYWJsZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gY29tbXVuaWNhdGUgdG8gdGhlIHVuZGVybHlpbmcgbW9kYWwgdGhhdCBhbmltYXRpb25zIGFyZSBub3RcbiAgICogd2FudGVkLiBQcmltYXJ5IHVzZSBpcyBmb3IgdGhlIGRpc3BsYXkgb2Ygc3RhdGljL2lubGluZSB3aXphcmRzLlxuICAgKiBTZXQgdXNpbmcgYFtjbHJXaXphcmRQcmV2ZW50TW9kYWxBbmltYXRpb25dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUHJldmVudE1vZGFsQW5pbWF0aW9uJykgX3N0b3BNb2RhbEFuaW1hdGlvbnMgPSBmYWxzZTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIGlzIG9wZW5lZCBvciBjbG9zZWQuXG4gICAqIExpc3RlbiB2aWEgYChjbHJXaXphcmRPcGVuQ2hhbmdlKWAgZXZlbnQuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPcGVuQ2hhbmdlJykgX29wZW5DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyBjYW5jZWxlZC4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uQ2FuY2VsKWAgZXZlbnQuXG4gICAqIENhbiBiZSBjb21iaW5lZCB3aXRoIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0Q2FuY2VsXWAgaW5wdXQgdG8gY3JlYXRlXG4gICAqIHdpemFyZC1sZXZlbCBjdXN0b20gY2FuY2VsIHJvdXRpbmVzLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25DYW5jZWwnKSBvbkNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyBjb21wbGV0ZWQuIExpc3RlbiB2aWEgYChjbHJXaXphcmRPbkZpbmlzaClgIGV2ZW50LlxuICAgKiBDYW4gYmUgY29tYmluZWQgd2l0aCB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYCBpbnB1dCB0byBjcmVhdGVcbiAgICogd2l6YXJkLWxldmVsIGN1c3RvbSBjb21wbGV0aW9uIHJvdXRpbmVzLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25GaW5pc2gnKSB3aXphcmRGaW5pc2hlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyByZXNldC4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uUmVzZXQpYCBldmVudC5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uUmVzZXQnKSBvblJlc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgY3VycmVudCBwYWdlIGhhcyBjaGFuZ2VkLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkQ3VycmVudFBhZ2VDaGFuZ2VkKWAgZXZlbnQuXG4gICAqIG91dHB1dC4gVXNlZnVsIGZvciBub24tYmxvY2tpbmcgdmFsaWRhdGlvbi5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZEN1cnJlbnRQYWdlQ2hhbmdlZCcpIGN1cnJlbnRQYWdlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBtb3ZlcyB0byB0aGUgbmV4dCBwYWdlLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25OZXh0KWAgZXZlbnQuXG4gICAqIENhbiBiZSBjb21iaW5lZCB3aXRoIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gIGlucHV0IHRvIGNyZWF0ZVxuICAgKiB3aXphcmQtbGV2ZWwgY3VzdG9tIG5hdmlnYXRpb24gcm91dGluZXMsIHdoaWNoIGFyZSB1c2VmdWwgZm9yIHZhbGlkYXRpb24uXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPbk5leHQnKSBvbk1vdmVOZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIG1vdmVzIHRvIHRoZSBwcmV2aW91cyBwYWdlLiBDYW4gYmUgdXNlZnVsIGZvciB2YWxpZGF0aW9uLlxuICAgKiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25QcmV2aW91cylgIGV2ZW50LlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25QcmV2aW91cycpIG9uTW92ZVByZXZpb3VzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICBAVmlld0NoaWxkKCdwYWdlVGl0bGUnKSBwYWdlVGl0bGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAQ29udGVudENoaWxkcmVuKENscldpemFyZFBhZ2UsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgcGFnZXM6IFF1ZXJ5TGlzdDxDbHJXaXphcmRQYWdlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihDbHJXaXphcmRIZWFkZXJBY3Rpb24pIGhlYWRlckFjdGlvbnM6IFF1ZXJ5TGlzdDxDbHJXaXphcmRIZWFkZXJBY3Rpb24+O1xuXG4gIF9vcGVuID0gZmFsc2U7XG4gIHdpemFyZElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgQENvbnRlbnRDaGlsZChDbHJXaXphcmRUaXRsZSkgcHJvdGVjdGVkIHdpemFyZFRpdGxlOiBDbHJXaXphcmRUaXRsZTtcblxuICBwcml2YXRlIF9mb3JjZUZvcndhcmQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc3RvcE5leHQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc3RvcENhbmNlbCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wTmF2aWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlU3RlcG5hdiA9IGZhbHNlO1xuICBwcml2YXRlIGRpZmZlcjogYW55OyAvLyBmb3IgbWFya2luZyB3aGVuIHRoZSBjb2xsZWN0aW9uIG9mIHdpemFyZCBwYWdlcyBoYXMgYmVlbiBhZGRlZCB0byBvciBkZWxldGVkIGZyb21cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIEBWaWV3Q2hpbGQoQ2xyTW9kYWwpIHByaXZhdGUgcmVhZG9ubHkgbW9kYWw6IENsck1vZGFsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LFxuICAgIHByaXZhdGUgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHVibGljIG5hdlNlcnZpY2U6IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBwYWdlQ29sbGVjdGlvbjogUGFnZUNvbGxlY3Rpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBidXR0b25TZXJ2aWNlOiBCdXR0b25IdWJTZXJ2aWNlLFxuICAgIHB1YmxpYyBoZWFkZXJBY3Rpb25TZXJ2aWNlOiBIZWFkZXJBY3Rpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZGlmZmVyczogSXRlcmFibGVEaWZmZXJzXG4gICkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXh0UGFnZUNoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yUHJldmlvdXNQYWdlQ2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JDYW5jZWxDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvckZpbmlzaGVkQ2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JQYWdlQ2hhbmdlcygpXG4gICAgKTtcblxuICAgIHRoaXMuZGlmZmVyID0gZGlmZmVycy5maW5kKFtdKS5jcmVhdGUobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHBhZ2UgY29tcGxldGVkIHN0YXRlcyB3aGVuIG5hdmlnYXRpbmcgYmFja3dhcmRzLlxuICAgKiBTZXQgdXNpbmcgYFtjbHJXaXphcmRGb3JjZUZvcndhcmROYXZpZ2F0aW9uXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZEZvcmNlRm9yd2FyZE5hdmlnYXRpb24nKVxuICBnZXQgZm9yY2VGb3J3YXJkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb3JjZUZvcndhcmQ7XG4gIH1cbiAgc2V0IGZvcmNlRm9yd2FyZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ZvcmNlRm9yd2FyZCA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLmZvcmNlRm9yd2FyZE5hdmlnYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIG9wZW4vY2xvc2Ugb2YgdGhlIHdpemFyZCBjb21wb25lbnQuXG4gICAqIFNldCB1c2luZyB0aGUgYFtjbHJXaXphcmRPcGVuXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZE9wZW4nKVxuICBzZXQgY2xyV2l6YXJkT3BlbihvcGVuOiBib29sZWFuKSB7XG4gICAgaWYgKG9wZW4pIHtcbiAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLl9vcGVuID0gb3BlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBDbHJXaXphcmQgZnJvbSBtb3ZpbmcgdG8gdGhlIG5leHQgcGFnZSBvciBjbG9zaW5nIGl0c2VsZiBvbiBmaW5pc2hpbmcuXG4gICAqIFNldCB1c2luZyB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYCBpbnB1dC4gTm90ZSB0aGF0IHVzaW5nIHN0b3BOZXh0XG4gICAqIHdpbGwgcmVxdWlyZSB5b3UgdG8gY3JlYXRlIHlvdXIgb3duIGNhbGxzIHRvIC5uZXh0KCkgYW5kIC5maW5pc2goKSBpbiB5b3VyXG4gICAqIGhvc3QgY29tcG9uZW50IHRvIG1ha2UgdGhlIENscldpemFyZCB3b3JrIGFzIGV4cGVjdGVkLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHQnKVxuICBnZXQgc3RvcE5leHQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BOZXh0O1xuICB9XG4gIHNldCBzdG9wTmV4dCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3N0b3BOZXh0ID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkSGFzQWx0TmV4dCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIENscldpemFyZCBmcm9tIGNsb3Npbmcgd2hlbiB0aGUgY2FuY2VsIGJ1dHRvbiBvciBjbG9zZSBcIlhcIiBpcyBjbGlja2VkLlxuICAgKiBTZXQgdXNpbmcgdGhlIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHRDYW5jZWxdYCBpbnB1dC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHVzaW5nIHN0b3BDYW5jZWwgd2lsbCByZXF1aXJlIHlvdSB0byBjcmVhdGUgeW91ciBvd24gY2FsbHMgdG8gYGNsb3NlKClgIGluIHlvdXIgaG9zdCBjb21wb25lYG50XG4gICAqIHRvIG1ha2UgdGhlIENscldpemFyZCB3b3JrIGFzIGV4cGVjdGVkLiBVc2VmdWwgZm9yIGRvaW5nIGNoZWNrcyBvciBwcm9tcHRzXG4gICAqIGJlZm9yZSBjbG9zaW5nIGEgQ2xyV2l6YXJkLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbCcpXG4gIGdldCBzdG9wQ2FuY2VsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wQ2FuY2VsO1xuICB9XG4gIHNldCBzdG9wQ2FuY2VsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RvcENhbmNlbCA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLndpemFyZEhhc0FsdENhbmNlbCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIENscldpemFyZCBmcm9tIHBlcmZvcm1pbmcgYW55IGZvcm0gb2YgbmF2aWdhdGlvbiBhd2F5IGZyb20gdGhlIGN1cnJlbnRcbiAgICogcGFnZS4gU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZFByZXZlbnROYXZpZ2F0aW9uXWAgaW5wdXQuXG4gICAqIE5vdGUgdGhhdCBzdG9wTmF2aWdhdGlvbiBpcyBtZWFudCB0byBmcmVlemUgdGhlIHdpemFyZCBpbiBwbGFjZSwgdHlwaWNhbGx5XG4gICAqIGR1cmluZyBhIGxvbmcgdmFsaWRhdGlvbiBvciBiYWNrZ3JvdW5kIGFjdGlvbiB3aGVyZSB5b3Ugd2FudCB0aGUgd2l6YXJkIHRvXG4gICAqIGRpc3BsYXkgbG9hZGluZyBjb250ZW50IGJ1dCBub3QgYWxsb3cgdGhlIHVzZXIgdG8gZXhlY3V0ZSBuYXZpZ2F0aW9uIGluXG4gICAqIHRoZSBzdGVwbmF2LCBjbG9zZSBYLCBvciB0aGUgIGJhY2ssIGZpbmlzaCwgb3IgbmV4dCBidXR0b25zLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRQcmV2ZW50TmF2aWdhdGlvbicpXG4gIGdldCBzdG9wTmF2aWdhdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcE5hdmlnYXRpb247XG4gIH1cbiAgc2V0IHN0b3BOYXZpZ2F0aW9uKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RvcE5hdmlnYXRpb24gPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmRTdG9wTmF2aWdhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIGNsaWNrcyBvbiB0aGUgbGlua3MgaW4gdGhlIHN0ZXBuYXYgZnJvbSB3b3JraW5nLlxuICAgKiBTZXQgdXNpbmcgYFtjbHJXaXphcmREaXNhYmxlU3RlcG5hdl1gIGlucHV0LlxuICAgKiBBIG1vcmUgZ3JhbnVsYXIgYnlwYXNzaW5nIG9mIG5hdmlnYXRpb24gd2hpY2ggY2FuIGJlIHVzZWZ1bCB3aGVuIHlvdXJcbiAgICogQ2xyV2l6YXJkIGlzIGluIGEgc3RhdGUgb2YgY29tcGxldGlvbiBhbmQgeW91IGRvbid0IHdhbnQgdXNlcnMgdG8gYmVcbiAgICogYWJsZSB0byBqdW1wIGJhY2t3YXJkcyBhbmQgY2hhbmdlIHRoaW5ncy5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkRGlzYWJsZVN0ZXBuYXYnKVxuICBnZXQgZGlzYWJsZVN0ZXBuYXYoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVTdGVwbmF2O1xuICB9XG4gIHNldCBkaXNhYmxlU3RlcG5hdih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVTdGVwbmF2ID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkRGlzYWJsZVN0ZXBuYXYgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjdXJyZW50UGFnZSgpOiBDbHJXaXphcmRQYWdlIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlO1xuICB9XG4gIHNldCBjdXJyZW50UGFnZShwYWdlOiBDbHJXaXphcmRQYWdlKSB7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLmdvVG8ocGFnZSwgdHJ1ZSk7XG4gIH1cblxuICBnZXQgaXNMYXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VJc0xhc3Q7XG4gIH1cblxuICBnZXQgaXNGaXJzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlSXNGaXJzdDtcbiAgfVxuXG4gIGdldCBpc0lubGluZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbHItd2l6YXJkLS1pbmxpbmUnKTtcbiAgfVxuXG4gIGdldCBzdG9wTW9kYWxBbmltYXRpb25zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wTW9kYWxBbmltYXRpb25zO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMucGFnZUNvbGxlY3Rpb24ucGFnZXMgPSB0aGlzLnBhZ2VzO1xuICAgIHRoaXMuaGVhZGVyQWN0aW9uU2VydmljZS53aXphcmRIZWFkZXJBY3Rpb25zID0gdGhpcy5oZWFkZXJBY3Rpb25zO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUJ1dHRvbnMoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZU5hdk9uUGFnZUNoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHMgPT4gcy51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyBXaXphcmQgYXMgZmluaXNoZWQuIEJ5IGRlZmF1bHQgaXQgZG9lcyBub3QgZXhlY3V0ZSBldmVudFxuICAgKiBlbWlzc2lvbnMgb3IgY2hlY2tzIGJlZm9yZSBjb21wbGV0aW5nIGFuZCBjbG9zaW5nLiBUaGlzIG1ldGhvZCBpcyBjb21tb25seVxuICAgKiB1c2VkIGFzIHBhcnQgb2YgYW4gYWx0ZXJuYXRpdmUgbmF2aWdhdGlvbiB3aXRoIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0XWAuXG4gICAqXG4gICAqIElmIGBza2lwQ2hlY2tzQW5kRW1pdHNgIGlzIHRydWUsIHRoZSB3aXphcmQgd2lsbCBjb21wbGV0ZSBhbmQgY2xvc2VcbiAgICogcmVnYXJkbGVzcyBvZiB0aGUgc3RhdGUgb2YgaXRzIGN1cnJlbnQgcGFnZS4gVGhpcyBpcyB1c2VmdWwgZm9yIGFsdGVybmF0aXZlXG4gICAqIG5hdmlnYXRpb24gd2hlcmUgZXZlbnQgZW1pc3Npb25zIGhhdmUgYWxyZWFkeSBiZWVuIGRvbmUgYW5kIGZpcmluZyB0aGVtIGFnYWluXG4gICAqIG1heSBjYXVzZSBhbiBldmVudCBsb29wLlxuICAgKi9cbiAgZmluaXNoKHNraXBDaGVja3NBbmRFbWl0cyA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAoc2tpcENoZWNrc0FuZEVtaXRzKSB7XG4gICAgICB0aGlzLmZvcmNlRmluaXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF2U2VydmljZS5maW5pc2goKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIHdpemFyZCBhcyBmaW5pc2hlZCBidXQgZG9lcyBydW4gY2hlY2tzIGFuZCBlbWlzc2lvbnMuXG4gICAqIEdvb2QgZm9yIGEgbGFzdCBzdGVwIGluIGFuIGFsdGVybmF0ZSB3b3JrZmxvdy4gRG9lcyB0aGUgc2FtZSB0aGluZyBhc1xuICAgKiBjYWxsaW5nIGBDbHJXaXphcmQuZmluaXNoKHRydWUpYCBvciBgQ2xyV2l6YXJkLmZpbmlzaCgpYCB3aXRob3V0IGEgcGFyYW1ldGVyLlxuICAgKi9cbiAgZm9yY2VGaW5pc2goKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RvcE5hdmlnYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIHdpemFyZC4gSWYgdGhlcmUgaXMgbm8gY3VycmVudCBwYWdlIGRlZmluZWQsIHNldHMgdGhlIGZpcnN0IHBhZ2UgaW4gdGhlIHdpemFyZCB0byBiZSBjdXJyZW50LlxuICAgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9vcGVuID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5jdXJyZW50UGFnZSkge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLnNldEZpcnN0UGFnZUN1cnJlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJlbmRlciBidXR0b25zIHdoZW4gd2l6YXJkIGlzIG9wZW5lZCwgdG8gYXZvaWQgY2hvY29sYXRlIGVycm9yc1xuICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkgPSB0cnVlO1xuXG4gICAgdGhpcy5fb3BlbkNoYW5nZWQuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHdpemFyZC4gQ2FsbCB0aGlzIGRpcmVjdGx5IGluc3RlYWQgb2YgYGNhbmNlbCgpYCB0byBpbXBsZW1lbnQgYWx0ZXJuYXRpdmUgY2FuY2VsIGZ1bmN0aW9uYWxpdHkuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICB0aGlzLl9vcGVuQ2hhbmdlZC5lbWl0KGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIG9wZW4gYW5kIGNsb3NlIHRoZSB3aXphcmQuIEJ5IGRlZmF1bHQgdGhlIHdpemFyZCB3aWxsXG4gICAqIGNsb3NlIGlmIGludm9rZWQgd2l0aCBubyBwYXJhbWV0ZXIuIElmIHBhcmFtZXRlciBpcyB0cnVlIHdpemFyZCB3aWxsIG9wZW5cbiAgICogZWxzZSBpZiBmYWxzZSB3aWxsIGNsb3NlLlxuICAgKi9cbiAgdG9nZ2xlKG9wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAob3Blbikge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHdpemFyZCB0byB0aGUgcHJldmlvdXMgcGFnZS5cbiAgICovXG4gIHByZXZpb3VzKCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5wcmV2aW91cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIGBuZXh0KClgIGRvZXMgbm90IGV4ZWN1dGUgZXZlbnQgZW1pc3Npb25zLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjb21tb25seSBjYWxsZWQgYXMgcGFydCBvZiBhbiBhbHRlcm5hdGl2ZSBuYXZpZ2F0aW9uXG4gICAqIHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYC4gVGhlIHdpemFyZCB3aWxsIG1vdmUgdG8gdGhlIG5leHQgcGFnZVxuICAgKiByZWdhcmRsZXNzIG9mIHRoZSBzdGF0ZSBvZiBpdHMgY3VycmVudCBwYWdlLiBUaGlzIGlzIHVzZWZ1bCBmb3IgYWx0ZXJuYXRpdmVcbiAgICogbmF2aWdhdGlvbiB3aGVyZSBldmVudCBlbWlzc2lvbnMgaGF2ZSBhbHJlYWR5IGJlZW4gZG9uZSBhbmQgZmlyaW5nIHRoZW0gYWdhaW5cbiAgICogbWF5IGNhdXNlIGFuIGV2ZW50IGxvb3AuXG4gICAqXG4gICAqIElmIGBza2lwQ2hlY2tzQW5kRW1pdHNgIGlzIGZhbHNlLCB0aGUgd2l6YXJkIHdpbGwgZXhlY3V0ZSBkZWZhdWx0IGNoZWNrc1xuICAgKiBhbmQgZW1pdCBldmVudHMgYXMgbm9ybWFsLiBUaGlzIGlzIHVzZWZ1bCBmb3IgY3VzdG9tIGJ1dHRvbnMgb3IgcHJvZ3JhbW1hdGljXG4gICAqIHdvcmtmbG93cyB0aGF0IGFyZSBub3QgZXhlY3V0aW5nIHRoZSB3aXphcmRzIGRlZmF1bHQgY2hlY2tzIGFuZCBlbWlzc2lvbnMuXG4gICAqIEl0IGlzIGFub3RoZXIgd2F5IHRvIG5hdmlnYXRlIHdpdGhvdXQgaGF2aW5nIHRvIHJld3JpdGUgdGhlIHdpemFyZOKAmXMgZGVmYXVsdFxuICAgKiBmdW5jdGlvbmFsaXR5IGZyb20gc2NyYXRjaC5cbiAgICovXG4gIG5leHQoc2tpcENoZWNrc0FuZEVtaXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChza2lwQ2hlY2tzQW5kRW1pdHMpIHtcbiAgICAgIHRoaXMuZm9yY2VOZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF2U2VydmljZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB3aXphcmQgdG8gdGhlIG5leHQgcGFnZSB3aXRob3V0IHRoZSBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogR29vZCBmb3IgYSBsYXN0IHN0ZXAgaW4gYW4gYWx0ZXJuYXRlIHdvcmtmbG93LlxuICAgKiBBbGlhcyBmb3IgYENscldpemFyZC5uZXh0KHRydWUpYCBvciBgQ2xyV2l6YXJkLm5leHQoKWBcbiAgICovXG4gIGZvcmNlTmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZm9yY2VOZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbmQgY2xvc2VzIHRoZSB3aXphcmQuIERvIG5vdCB1c2UgdGhpcyBmb3IgYW4gb3ZlcnJpZGUgb2YgdGhlIGNhbmNlbFxuICAgKiB0aGUgZnVuY3Rpb25hbGl0eSB3aXRoIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHRDYW5jZWxdYCwgYFtjbHJXaXphcmRQcmV2ZW50UGFnZURlZmF1bHRDYW5jZWxdYCxcbiAgICogb3IgYFtjbHJXaXphcmRQYWdlUHJldmVudERlZmF1bHRdYCBiZWNhdXNlIGl0IHdpbGwgaW5pdGlhdGUgdGhlIHNhbWUgY2hlY2tzXG4gICAqIGFuZCBldmVudCBlbWlzc2lvbnMgdGhhdCBpbnZva2VkIHlvdXIgZXZlbnQgaGFuZGxlci4gVXNlIGBDbHJXaXphcmQuY2xvc2UoKWAgaW5zdGVhZC5cbiAgICovXG4gIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuY2FuY2VsKCk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGJlaGF2aW9yIG9mIHRoZSB1bmRlcmx5aW5nIG1vZGFsIHRvIGF2b2lkIGNvbGxpc2lvbnMgd2l0aFxuICAgKiBhbHRlcm5hdGl2ZSBjYW5jZWwgZnVuY3Rpb25hbGl0eS4gSW4gbW9zdCBjYXNlcywgdXNlIGBDbHJXaXphcmQuY2FuY2VsKClgIGluc3RlYWQuXG4gICAqL1xuICBtb2RhbENhbmNlbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zYWJsZSkge1xuICAgICAgdGhpcy5jaGVja0FuZENhbmNlbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGFsdGVybmF0aXZlIGNhbmNlbCBmbG93cyBkZWZpbmVkIGF0IHRoZSBjdXJyZW50IHBhZ2Ugb3JcbiAgICogd2l6YXJkIGxldmVsLiBQZXJmb3JtcyBhIGNhbmNlbGVkIGlmIG5vdC4gRW1pdHMgZXZlbnRzIHRoYXQgaW5pdGlhdGVcbiAgICogdGhlIGFsdGVybmF0aXZlIGNhbmNlbCBvdXRwdXRzIGAoY2xyV2l6YXJkUGFnZU9uQ2FuY2VsKWAgYW5kIGAoY2xyV2l6YXJkT25DYW5jZWwpYC5cbiAgICovXG4gIGNoZWNrQW5kQ2FuY2VsKCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcbiAgICBjb25zdCBjdXJyZW50UGFnZUhhc092ZXJyaWRlcyA9IGN1cnJlbnRQYWdlLnN0b3BDYW5jZWwgfHwgY3VycmVudFBhZ2UucHJldmVudERlZmF1bHQ7XG5cbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRQYWdlLnBhZ2VPbkNhbmNlbC5lbWl0KCk7XG4gICAgaWYgKCFjdXJyZW50UGFnZUhhc092ZXJyaWRlcykge1xuICAgICAgdGhpcy5vbkNhbmNlbC5lbWl0KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0b3BDYW5jZWwgJiYgIWN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byBhIGdpdmVuIHBhZ2UgaW4gdGhlIFdpemFyZC4gTmF2aWdhdGlvbiB3aWxsIGludm9rZSB0aGUgd2l6YXJk4oCZcyBkZWZhdWx0XG4gICAqIGNoZWNrcyBhbmQgZXZlbnQgZW1pc3Npb25zLlxuICAgKlxuICAgKiBUaGUgZm9ybWF0IG9mIHRoZSBleHBlY3RlZCBJRCBwYXJhbWV0ZXIgY2FuIGJlIGZvdW5kIGluIHRoZSByZXR1cm4gb2YgdGhlXG4gICAqIENscldpemFyZFBhZ2UuaWQgZ2V0dGVyLCB1c3VhbGx5IHByZWZpeGVkIHdpdGggYGNsci13aXphcmQtcGFnZS1gIGFuZCB0aGVuIGVpdGhlciBhXG4gICAqIG51bWVyaWMgSUQgb3IgdGhlIElEIHNwZWNpZmllZCBmb3IgdGhlIGBDbHJXaXphcmRQYWdlYCBjb21wb25lbnTigJlzIGBpZGAgaW5wdXQuXG4gICAqL1xuICBnb1RvKHBhZ2VJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFwYWdlSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYXZTZXJ2aWNlLmdvVG8ocGFnZUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBzZXRzIGFsbCBXaXphcmRQYWdlcyB0byBpbmNvbXBsZXRlIGFuZCBzZXRzIHRoZSBmaXJzdCBwYWdlIGluIHRoZSBgQ2xyV2l6YXJkYCB0b1xuICAgKiBiZSB0aGUgY3VycmVudCBwYWdlLCByZXNldHRpbmcgdGhlIHdpemFyZCBuYXZpZ2F0aW9uLlxuICAgKiBVc2UgYChjbHJXaXphcmRPblJlc2V0KWAgZXZlbnQgdG8gcmVzZXQgdGhlIGRhdGEgb3IgbW9kZWwgb2YgeW91ciB3aXphcmQuXG4gICAqL1xuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLnJlc2V0KCk7XG4gICAgdGhpcy5vblJlc2V0LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yTmV4dFBhZ2VDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5tb3ZlZFRvTmV4dFBhZ2UucGlwZShmaWx0ZXIoKCkgPT4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm9uTW92ZU5leHQuZW1pdCgpO1xuICAgICAgdGhpcy5wYWdlVGl0bGU/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yUHJldmlvdXNQYWdlQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UubW92ZWRUb1ByZXZpb3VzUGFnZS5waXBlKGZpbHRlcigoKSA9PiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25Nb3ZlUHJldmlvdXMuZW1pdCgpO1xuICAgICAgdGhpcy5wYWdlVGl0bGU/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yQ2FuY2VsQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2Uubm90aWZ5V2l6YXJkQ2FuY2VsLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNoZWNrQW5kQ2FuY2VsKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JGaW5pc2hlZENoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLndpemFyZEZpbmlzaGVkLnN1YnNjcmliZSgoKSA9PiB0aGlzLmVtaXRXaXphcmRGaW5pc2hlZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yUGFnZUNoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQWRkZWQgdG8gYWRkcmVzcyBWUEFULTc0OTpcbiAgICAgIC8vICAgV2hlbiBjbGlja2luZyBvbiBhIHdpemFyZCB0YWIsIGZvY3VzIHNob3VsZCBtb3ZlIHRvIHRoYXRcbiAgICAgIC8vICAgdGFicyBjb250ZW50IHRvIG1ha2UgdGhlIHdpemFyZCBtb3JlIGFjY2Vzc2libGUuXG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5jdXJyZW50UGFnZUNoYW5nZWQuZW1pdCgpO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gdG9wIG9mIHBhZ2UgaW4gY2FzZSB0aGVyZSBpcyBsb25nIHBhZ2UgY29udGVudFxuICAgICAgdGhpcy5tb2RhbD8uc2Nyb2xsVG9wKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU5hdk9uUGFnZUNoYW5nZXMoKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuZGlmZmVyLmRpZmYodGhpcy5wYWdlcyk7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbSgoKSA9PiB0aGlzLm5hdlNlcnZpY2UudXBkYXRlTmF2aWdhdGlvbigpKTtcbiAgICAgIGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKCgpID0+IHRoaXMubmF2U2VydmljZS51cGRhdGVOYXZpZ2F0aW9uKCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUJ1dHRvbnMoKTogdm9pZCB7XG4gICAgLy8gT25seSB0cmlnZ2VyIGJ1dHRvbnMgcmVhZHkgaWYgZGVmYXVsdCBpcyBvcGVuIChpbmxpbmVkKVxuICAgIGlmICh0aGlzLl9vcGVuKSB7XG4gICAgICB0aGlzLmJ1dHRvblNlcnZpY2UuYnV0dG9uc1JlYWR5ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVtaXRXaXphcmRGaW5pc2hlZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc3RvcE5leHQpIHtcbiAgICAgIHRoaXMuZm9yY2VGaW5pc2goKTtcbiAgICB9XG4gICAgdGhpcy53aXphcmRGaW5pc2hlZC5lbWl0KCk7XG4gIH1cbn1cbiIsIjwhLS1cbiAgfiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgfiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gIH4gVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAgfiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gIC0tPlxuXG48Y2xyLW1vZGFsXG4gIFtjbHJNb2RhbE9wZW5dPVwiX29wZW5cIlxuICBbY2xyTW9kYWxTaXplXT1cInNpemVcIlxuICBbY2xyTW9kYWxDbG9zYWJsZV09XCJjbG9zYWJsZVwiXG4gIFtjbHJNb2RhbFN0YXRpY0JhY2tkcm9wXT1cInRydWVcIlxuICBbY2xyTW9kYWxTa2lwQW5pbWF0aW9uXT1cInN0b3BNb2RhbEFuaW1hdGlvbnNcIlxuICBbY2xyTW9kYWxPdmVycmlkZVNjcm9sbFNlcnZpY2VdPVwiaXNJbmxpbmVcIlxuICBbY2xyTW9kYWxQcmV2ZW50Q2xvc2VdPVwidHJ1ZVwiXG4gIChjbHJNb2RhbEFsdGVybmF0ZUNsb3NlKT1cIm1vZGFsQ2FuY2VsKClcIlxuICBbY2xyTW9kYWxMYWJlbGxlZEJ5SWRdPVwid2l6YXJkSWRcIlxuPlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtbmF2IGNsci13aXphcmQtc3RlcG5hdi13cmFwcGVyXCIgcm9sZT1cInJlZ2lvblwiPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItd2l6YXJkLXRpdGxlXCIgW2lkXT1cIndpemFyZElkXCIgcm9sZT1cImhlYWRpbmdcIiBbYXR0ci5hcmlhLWxldmVsXT1cIndpemFyZFRpdGxlLmhlYWRpbmdMZXZlbCB8fCAxXCI+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItd2l6YXJkLXRpdGxlXCI+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICAgIDxjbHItd2l6YXJkLXN0ZXBuYXYgW2xhYmVsXT1cInN0ZXBuYXZBcmlhTGFiZWxcIj48L2Nsci13aXphcmQtc3RlcG5hdj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgcm9sZT1cImhlYWRpbmdcIiBbYXR0ci5hcmlhLWxldmVsXT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2U/LnBhZ2VUaXRsZS5oZWFkaW5nTGV2ZWwgfHwgMlwiPlxuICAgIDxzcGFuIHRhYmluZGV4PVwiLTFcIiAjcGFnZVRpdGxlIGNsYXNzPVwibW9kYWwtdGl0bGUtdGV4dFwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2VUaXRsZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9zcGFuPlxuXG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlci1hY3Rpb25zLXdyYXBwZXJcIiAqbmdJZj1cImhlYWRlckFjdGlvblNlcnZpY2UuZGlzcGxheUhlYWRlckFjdGlvbnNXcmFwcGVyXCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwiaGVhZGVyQWN0aW9uU2VydmljZS5zaG93V2l6YXJkSGVhZGVyQWN0aW9uc1wiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItd2l6YXJkLWhlYWRlci1hY3Rpb25cIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgKm5nSWY9XCJoZWFkZXJBY3Rpb25TZXJ2aWNlLmN1cnJlbnRQYWdlSGFzSGVhZGVyQWN0aW9uc1wiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZS5oZWFkZXJBY3Rpb25zXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgIDxtYWluIGNsci13aXphcmQtcGFnZXMtd3JhcHBlciBjbGFzcz1cImNsci13aXphcmQtY29udGVudFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvbWFpbj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXIgY2xyLXdpemFyZC1mb290ZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9uc1wiPlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UgJiYgIW5hdlNlcnZpY2UuY3VycmVudFBhZ2UuaGFzQnV0dG9uc1wiXG4gICAgICAgIGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9ucy13cmFwcGVyXCJcbiAgICAgID5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLXdpemFyZC1idXR0b25cIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgKm5nSWY9XCJuYXZTZXJ2aWNlLmN1cnJlbnRQYWdlICYmIG5hdlNlcnZpY2UuY3VycmVudFBhZ2UuaGFzQnV0dG9uc1wiXG4gICAgICAgIGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9ucy13cmFwcGVyXCJcbiAgICAgID5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UuYnV0dG9uc1wiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Nsci1tb2RhbD5cbiJdfQ==