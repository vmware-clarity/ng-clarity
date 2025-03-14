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
ClrWizard.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizard, selector: "clr-wizard", inputs: { stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"], size: ["clrWizardSize", "size"], closable: ["clrWizardClosable", "closable"], _stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"], forceForward: ["clrWizardForceForwardNavigation", "forceForward"], clrWizardOpen: "clrWizardOpen", stopNext: ["clrWizardPreventDefaultNext", "stopNext"], stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"], stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"], disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"] }, outputs: { _openChanged: "clrWizardOpenChange", onCancel: "clrWizardOnCancel", wizardFinished: "clrWizardOnFinish", onReset: "clrWizardOnReset", currentPageChanged: "clrWizardCurrentPageChanged", onMoveNext: "clrWizardOnNext", onMovePrevious: "clrWizardOnPrevious" }, host: { properties: { "class.clr-wizard": "true", "class.wizard-md": "size == 'md'", "class.wizard-lg": "size == 'lg'", "class.wizard-xl": "size == 'xl'", "class.lastPage": "navService.currentPageIsLast" } }, providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], queries: [{ propertyName: "wizardTitle", first: true, predicate: ClrWizardTitle, descendants: true }, { propertyName: "pages", predicate: ClrWizardPage, descendants: true }, { propertyName: "headerActions", predicate: ClrWizardHeaderAction }], viewQueries: [{ propertyName: "pageTitle", first: true, predicate: ["pageTitle"], descendants: true }, { propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n    <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle.headingLevel || 1\">\n      <ng-content select=\"clr-wizard-title\"></ng-content>\n    </div>\n    <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n  </div>\n\n  <div class=\"modal-title\" role=\"heading\" [attr.aria-level]=\"navService.currentPage?.pageTitle.headingLevel || 2\">\n    <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n      <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n    </span>\n\n    <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n      <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n        <ng-content select=\"clr-wizard-header-action\"></ng-content>\n      </div>\n      <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"modal-body\">\n    <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n      <ng-content></ng-content>\n    </main>\n  </div>\n  <div class=\"modal-footer clr-wizard-footer\">\n    <div class=\"clr-wizard-footer-buttons\">\n      <div\n        *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-content select=\"clr-wizard-button\"></ng-content>\n      </div>\n      <div\n        *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n        class=\"clr-wizard-footer-buttons-wrapper\"\n      >\n        <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n      </div>\n    </div>\n  </div>\n</clr-modal>\n", dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i7.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i8.ClrModalBody, selector: ".modal-body" }, { kind: "component", type: i9.ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: ["label"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-wizard', providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], host: {
                        '[class.clr-wizard]': 'true',
                        '[class.wizard-md]': "size == 'md'",
                        '[class.wizard-lg]': "size == 'lg'",
                        '[class.wizard-xl]': "size == 'xl'",
                        '[class.lastPage]': 'navService.currentPageIsLast',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvd2l6YXJkL3dpemFyZC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFFTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUVYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7QUFjaEQsTUFBTSxPQUFPLFNBQVM7SUF1RnBCLFlBQytCLFVBQWUsRUFDcEMsYUFBc0MsRUFDdkMsVUFBbUMsRUFDbkMsY0FBcUMsRUFDckMsYUFB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O3VCQUFDLDRCQUE0QjtnQkFpQi9CLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyTW9kYWwgfSBmcm9tICcuLi9tb2RhbC9tb2RhbCc7XG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBCdXR0b25IdWJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvYnV0dG9uLWh1Yi5zZXJ2aWNlJztcbmltcG9ydCB7IEhlYWRlckFjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9oZWFkZXItYWN0aW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IFBhZ2VDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UtY29sbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvd2l6YXJkLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDbHJXaXphcmRIZWFkZXJBY3Rpb24gfSBmcm9tICcuL3dpemFyZC1oZWFkZXItYWN0aW9uJztcbmltcG9ydCB7IENscldpemFyZFBhZ2UgfSBmcm9tICcuL3dpemFyZC1wYWdlJztcbmltcG9ydCB7IENscldpemFyZFRpdGxlIH0gZnJvbSAnLi93aXphcmQtdGl0bGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItd2l6YXJkJyxcbiAgcHJvdmlkZXJzOiBbV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UsIFBhZ2VDb2xsZWN0aW9uU2VydmljZSwgQnV0dG9uSHViU2VydmljZSwgSGVhZGVyQWN0aW9uU2VydmljZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci13aXphcmRdJzogJ3RydWUnLFxuICAgICdbY2xhc3Mud2l6YXJkLW1kXSc6IFwic2l6ZSA9PSAnbWQnXCIsXG4gICAgJ1tjbGFzcy53aXphcmQtbGddJzogXCJzaXplID09ICdsZydcIixcbiAgICAnW2NsYXNzLndpemFyZC14bF0nOiBcInNpemUgPT0gJ3hsJ1wiLFxuICAgICdbY2xhc3MubGFzdFBhZ2VdJzogJ25hdlNlcnZpY2UuY3VycmVudFBhZ2VJc0xhc3QnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2sge1xuICAvKipcbiAgICogU2V0IHRoZSBhcmlhLWxhYmVsIGZvciB0aGUgc3RlcG5hdiBzZWN0aW9uIG9mIHRoZSB3aXphcmQuIFNldCB1c2luZyBgW2NscldpemFyZFN0ZXBuYXZBcmlhTGFiZWxdYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkU3RlcG5hdkFyaWFMYWJlbCcpIHN0ZXBuYXZBcmlhTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy53aXphcmRTdGVwbmF2QXJpYUxhYmVsO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1vZGFsIHNpemUgb2YgdGhlIHdpemFyZC4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkU2l6ZV1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRTaXplJykgc2l6ZSA9ICd4bCc7XG5cbiAgLyoqXG4gICAqIFRlbGxzIHRoZSBtb2RhbCBwYXJ0IG9mIHRoZSB3aXphcmQgd2hldGhlciBpdCBzaG91bGQgaGF2ZSBhIGNsb3NlIFwiWFwiXG4gICAqIGluIHRoZSB0b3AgcmlnaHQgY29ybmVyLiBTZXQgdXNpbmcgYFtjbHJXaXphcmRDbG9zYWJsZV1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRDbG9zYWJsZScpIGNsb3NhYmxlID0gdHJ1ZTtcblxuICAvKipcbiAgICogVXNlZCB0byBjb21tdW5pY2F0ZSB0byB0aGUgdW5kZXJseWluZyBtb2RhbCB0aGF0IGFuaW1hdGlvbnMgYXJlIG5vdFxuICAgKiB3YW50ZWQuIFByaW1hcnkgdXNlIGlzIGZvciB0aGUgZGlzcGxheSBvZiBzdGF0aWMvaW5saW5lIHdpemFyZHMuXG4gICAqIFNldCB1c2luZyBgW2NscldpemFyZFByZXZlbnRNb2RhbEFuaW1hdGlvbl1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRQcmV2ZW50TW9kYWxBbmltYXRpb24nKSBfc3RvcE1vZGFsQW5pbWF0aW9ucyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgaXMgb3BlbmVkIG9yIGNsb3NlZC5cbiAgICogTGlzdGVuIHZpYSBgKGNscldpemFyZE9wZW5DaGFuZ2UpYCBldmVudC5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9wZW5DaGFuZ2UnKSBfb3BlbkNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIGlzIGNhbmNlbGVkLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25DYW5jZWwpYCBldmVudC5cbiAgICogQ2FuIGJlIGNvbWJpbmVkIHdpdGggdGhlIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHRDYW5jZWxdYCBpbnB1dCB0byBjcmVhdGVcbiAgICogd2l6YXJkLWxldmVsIGN1c3RvbSBjYW5jZWwgcm91dGluZXMuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPbkNhbmNlbCcpIG9uQ2FuY2VsID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIGlzIGNvbXBsZXRlZC4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uRmluaXNoKWAgZXZlbnQuXG4gICAqIENhbiBiZSBjb21iaW5lZCB3aXRoIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gIGlucHV0IHRvIGNyZWF0ZVxuICAgKiB3aXphcmQtbGV2ZWwgY3VzdG9tIGNvbXBsZXRpb24gcm91dGluZXMuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPbkZpbmlzaCcpIHdpemFyZEZpbmlzaGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIGlzIHJlc2V0LiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25SZXNldClgIGV2ZW50LlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25SZXNldCcpIG9uUmVzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50IHBhZ2UgaGFzIGNoYW5nZWQuIExpc3RlbiB2aWEgYChjbHJXaXphcmRDdXJyZW50UGFnZUNoYW5nZWQpYCBldmVudC5cbiAgICogb3V0cHV0LiBVc2VmdWwgZm9yIG5vbi1ibG9ja2luZyB2YWxpZGF0aW9uLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkQ3VycmVudFBhZ2VDaGFuZ2VkJykgY3VycmVudFBhZ2VDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIG1vdmVzIHRvIHRoZSBuZXh0IHBhZ2UuIExpc3RlbiB2aWEgYChjbHJXaXphcmRPbk5leHQpYCBldmVudC5cbiAgICogQ2FuIGJlIGNvbWJpbmVkIHdpdGggdGhlIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0XWAgaW5wdXQgdG8gY3JlYXRlXG4gICAqIHdpemFyZC1sZXZlbCBjdXN0b20gbmF2aWdhdGlvbiByb3V0aW5lcywgd2hpY2ggYXJlIHVzZWZ1bCBmb3IgdmFsaWRhdGlvbi5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uTmV4dCcpIG9uTW92ZU5leHQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgbW92ZXMgdG8gdGhlIHByZXZpb3VzIHBhZ2UuIENhbiBiZSB1c2VmdWwgZm9yIHZhbGlkYXRpb24uXG4gICAqIExpc3RlbiB2aWEgYChjbHJXaXphcmRPblByZXZpb3VzKWAgZXZlbnQuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPblByZXZpb3VzJykgb25Nb3ZlUHJldmlvdXMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIEBWaWV3Q2hpbGQoJ3BhZ2VUaXRsZScpIHBhZ2VUaXRsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyV2l6YXJkUGFnZSwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBwYWdlczogUXVlcnlMaXN0PENscldpemFyZFBhZ2U+O1xuICBAQ29udGVudENoaWxkcmVuKENscldpemFyZEhlYWRlckFjdGlvbikgaGVhZGVyQWN0aW9uczogUXVlcnlMaXN0PENscldpemFyZEhlYWRlckFjdGlvbj47XG5cbiAgX29wZW4gPSBmYWxzZTtcbiAgd2l6YXJkSWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcblxuICBAQ29udGVudENoaWxkKENscldpemFyZFRpdGxlKSBwcm90ZWN0ZWQgd2l6YXJkVGl0bGU6IENscldpemFyZFRpdGxlO1xuXG4gIHByaXZhdGUgX2ZvcmNlRm9yd2FyZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wTmV4dCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wQ2FuY2VsID0gZmFsc2U7XG4gIHByaXZhdGUgX3N0b3BOYXZpZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVTdGVwbmF2ID0gZmFsc2U7XG4gIHByaXZhdGUgZGlmZmVyOiBhbnk7IC8vIGZvciBtYXJraW5nIHdoZW4gdGhlIGNvbGxlY3Rpb24gb2Ygd2l6YXJkIHBhZ2VzIGhhcyBiZWVuIGFkZGVkIHRvIG9yIGRlbGV0ZWQgZnJvbVxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgQFZpZXdDaGlsZChDbHJNb2RhbCkgcHJpdmF0ZSByZWFkb25seSBtb2RhbDogQ2xyTW9kYWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHJpdmF0ZSBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwdWJsaWMgbmF2U2VydmljZTogV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgcHVibGljIHBhZ2VDb2xsZWN0aW9uOiBQYWdlQ29sbGVjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGJ1dHRvblNlcnZpY2U6IEJ1dHRvbkh1YlNlcnZpY2UsXG4gICAgcHVibGljIGhlYWRlckFjdGlvblNlcnZpY2U6IEhlYWRlckFjdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnNcbiAgKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmxpc3RlbkZvck5leHRQYWdlQ2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JQcmV2aW91c1BhZ2VDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvckNhbmNlbENoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yRmluaXNoZWRDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvclBhZ2VDaGFuZ2VzKClcbiAgICApO1xuXG4gICAgdGhpcy5kaWZmZXIgPSBkaWZmZXJzLmZpbmQoW10pLmNyZWF0ZShudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgcGFnZSBjb21wbGV0ZWQgc3RhdGVzIHdoZW4gbmF2aWdhdGluZyBiYWNrd2FyZHMuXG4gICAqIFNldCB1c2luZyBgW2NscldpemFyZEZvcmNlRm9yd2FyZE5hdmlnYXRpb25dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkRm9yY2VGb3J3YXJkTmF2aWdhdGlvbicpXG4gIGdldCBmb3JjZUZvcndhcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvcmNlRm9yd2FyZDtcbiAgfVxuICBzZXQgZm9yY2VGb3J3YXJkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZm9yY2VGb3J3YXJkID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZm9yY2VGb3J3YXJkTmF2aWdhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgb3Blbi9jbG9zZSBvZiB0aGUgd2l6YXJkIGNvbXBvbmVudC5cbiAgICogU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZE9wZW5dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkT3BlbicpXG4gIHNldCBjbHJXaXphcmRPcGVuKG9wZW46IGJvb2xlYW4pIHtcbiAgICBpZiAob3Blbikge1xuICAgICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX29wZW4gPSBvcGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIENscldpemFyZCBmcm9tIG1vdmluZyB0byB0aGUgbmV4dCBwYWdlIG9yIGNsb3NpbmcgaXRzZWxmIG9uIGZpbmlzaGluZy5cbiAgICogU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gIGlucHV0LiBOb3RlIHRoYXQgdXNpbmcgc3RvcE5leHRcbiAgICogd2lsbCByZXF1aXJlIHlvdSB0byBjcmVhdGUgeW91ciBvd24gY2FsbHMgdG8gLm5leHQoKSBhbmQgLmZpbmlzaCgpIGluIHlvdXJcbiAgICogaG9zdCBjb21wb25lbnQgdG8gbWFrZSB0aGUgQ2xyV2l6YXJkIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dCcpXG4gIGdldCBzdG9wTmV4dCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcE5leHQ7XG4gIH1cbiAgc2V0IHN0b3BOZXh0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RvcE5leHQgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmRIYXNBbHROZXh0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgQ2xyV2l6YXJkIGZyb20gY2xvc2luZyB3aGVuIHRoZSBjYW5jZWwgYnV0dG9uIG9yIGNsb3NlIFwiWFwiIGlzIGNsaWNrZWQuXG4gICAqIFNldCB1c2luZyB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbF1gIGlucHV0LlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdXNpbmcgc3RvcENhbmNlbCB3aWxsIHJlcXVpcmUgeW91IHRvIGNyZWF0ZSB5b3VyIG93biBjYWxscyB0byBgY2xvc2UoKWAgaW4geW91ciBob3N0IGNvbXBvbmVgbnRcbiAgICogdG8gbWFrZSB0aGUgQ2xyV2l6YXJkIHdvcmsgYXMgZXhwZWN0ZWQuIFVzZWZ1bCBmb3IgZG9pbmcgY2hlY2tzIG9yIHByb21wdHNcbiAgICogYmVmb3JlIGNsb3NpbmcgYSBDbHJXaXphcmQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnREZWZhdWx0Q2FuY2VsJylcbiAgZ2V0IHN0b3BDYW5jZWwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BDYW5jZWw7XG4gIH1cbiAgc2V0IHN0b3BDYW5jZWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdG9wQ2FuY2VsID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkSGFzQWx0Q2FuY2VsID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgQ2xyV2l6YXJkIGZyb20gcGVyZm9ybWluZyBhbnkgZm9ybSBvZiBuYXZpZ2F0aW9uIGF3YXkgZnJvbSB0aGUgY3VycmVudFxuICAgKiBwYWdlLiBTZXQgdXNpbmcgdGhlIGBbY2xyV2l6YXJkUHJldmVudE5hdmlnYXRpb25dYCBpbnB1dC5cbiAgICogTm90ZSB0aGF0IHN0b3BOYXZpZ2F0aW9uIGlzIG1lYW50IHRvIGZyZWV6ZSB0aGUgd2l6YXJkIGluIHBsYWNlLCB0eXBpY2FsbHlcbiAgICogZHVyaW5nIGEgbG9uZyB2YWxpZGF0aW9uIG9yIGJhY2tncm91bmQgYWN0aW9uIHdoZXJlIHlvdSB3YW50IHRoZSB3aXphcmQgdG9cbiAgICogZGlzcGxheSBsb2FkaW5nIGNvbnRlbnQgYnV0IG5vdCBhbGxvdyB0aGUgdXNlciB0byBleGVjdXRlIG5hdmlnYXRpb24gaW5cbiAgICogdGhlIHN0ZXBuYXYsIGNsb3NlIFgsIG9yIHRoZSAgYmFjaywgZmluaXNoLCBvciBuZXh0IGJ1dHRvbnMuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnROYXZpZ2F0aW9uJylcbiAgZ2V0IHN0b3BOYXZpZ2F0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wTmF2aWdhdGlvbjtcbiAgfVxuICBzZXQgc3RvcE5hdmlnYXRpb24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdG9wTmF2aWdhdGlvbiA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLndpemFyZFN0b3BOYXZpZ2F0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgY2xpY2tzIG9uIHRoZSBsaW5rcyBpbiB0aGUgc3RlcG5hdiBmcm9tIHdvcmtpbmcuXG4gICAqIFNldCB1c2luZyBgW2NscldpemFyZERpc2FibGVTdGVwbmF2XWAgaW5wdXQuXG4gICAqIEEgbW9yZSBncmFudWxhciBieXBhc3Npbmcgb2YgbmF2aWdhdGlvbiB3aGljaCBjYW4gYmUgdXNlZnVsIHdoZW4geW91clxuICAgKiBDbHJXaXphcmQgaXMgaW4gYSBzdGF0ZSBvZiBjb21wbGV0aW9uIGFuZCB5b3UgZG9uJ3Qgd2FudCB1c2VycyB0byBiZVxuICAgKiBhYmxlIHRvIGp1bXAgYmFja3dhcmRzIGFuZCBjaGFuZ2UgdGhpbmdzLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmREaXNhYmxlU3RlcG5hdicpXG4gIGdldCBkaXNhYmxlU3RlcG5hdigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVN0ZXBuYXY7XG4gIH1cbiAgc2V0IGRpc2FibGVTdGVwbmF2KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZVN0ZXBuYXYgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmREaXNhYmxlU3RlcG5hdiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQYWdlKCk6IENscldpemFyZFBhZ2Uge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2U7XG4gIH1cbiAgc2V0IGN1cnJlbnRQYWdlKHBhZ2U6IENscldpemFyZFBhZ2UpIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29UbyhwYWdlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBpc0xhc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZUlzTGFzdDtcbiAgfVxuXG4gIGdldCBpc0ZpcnN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VJc0ZpcnN0O1xuICB9XG5cbiAgZ2V0IGlzSW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsci13aXphcmQtLWlubGluZScpO1xuICB9XG5cbiAgZ2V0IHN0b3BNb2RhbEFuaW1hdGlvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BNb2RhbEFuaW1hdGlvbnM7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYWdlQ29sbGVjdGlvbi5wYWdlcyA9IHRoaXMucGFnZXM7XG4gICAgdGhpcy5oZWFkZXJBY3Rpb25TZXJ2aWNlLndpemFyZEhlYWRlckFjdGlvbnMgPSB0aGlzLmhlYWRlckFjdGlvbnM7XG4gICAgdGhpcy5pbml0aWFsaXplQnV0dG9ucygpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlTmF2T25QYWdlQ2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIFdpemFyZCBhcyBmaW5pc2hlZC4gQnkgZGVmYXVsdCBpdCBkb2VzIG5vdCBleGVjdXRlIGV2ZW50XG4gICAqIGVtaXNzaW9ucyBvciBjaGVja3MgYmVmb3JlIGNvbXBsZXRpbmcgYW5kIGNsb3NpbmcuIFRoaXMgbWV0aG9kIGlzIGNvbW1vbmx5XG4gICAqIHVzZWQgYXMgcGFydCBvZiBhbiBhbHRlcm5hdGl2ZSBuYXZpZ2F0aW9uIHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYC5cbiAgICpcbiAgICogSWYgYHNraXBDaGVja3NBbmRFbWl0c2AgaXMgdHJ1ZSwgdGhlIHdpemFyZCB3aWxsIGNvbXBsZXRlIGFuZCBjbG9zZVxuICAgKiByZWdhcmRsZXNzIG9mIHRoZSBzdGF0ZSBvZiBpdHMgY3VycmVudCBwYWdlLiBUaGlzIGlzIHVzZWZ1bCBmb3IgYWx0ZXJuYXRpdmVcbiAgICogbmF2aWdhdGlvbiB3aGVyZSBldmVudCBlbWlzc2lvbnMgaGF2ZSBhbHJlYWR5IGJlZW4gZG9uZSBhbmQgZmlyaW5nIHRoZW0gYWdhaW5cbiAgICogbWF5IGNhdXNlIGFuIGV2ZW50IGxvb3AuXG4gICAqL1xuICBmaW5pc2goc2tpcENoZWNrc0FuZEVtaXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChza2lwQ2hlY2tzQW5kRW1pdHMpIHtcbiAgICAgIHRoaXMuZm9yY2VGaW5pc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLmZpbmlzaCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgd2l6YXJkIGFzIGZpbmlzaGVkIGJ1dCBkb2VzIHJ1biBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogR29vZCBmb3IgYSBsYXN0IHN0ZXAgaW4gYW4gYWx0ZXJuYXRlIHdvcmtmbG93LiBEb2VzIHRoZSBzYW1lIHRoaW5nIGFzXG4gICAqIGNhbGxpbmcgYENscldpemFyZC5maW5pc2godHJ1ZSlgIG9yIGBDbHJXaXphcmQuZmluaXNoKClgIHdpdGhvdXQgYSBwYXJhbWV0ZXIuXG4gICAqL1xuICBmb3JjZUZpbmlzaCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgd2l6YXJkLiBJZiB0aGVyZSBpcyBubyBjdXJyZW50IHBhZ2UgZGVmaW5lZCwgc2V0cyB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgd2l6YXJkIHRvIGJlIGN1cnJlbnQuXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuX29wZW4gPSB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlKSB7XG4gICAgICB0aGlzLm5hdlNlcnZpY2Uuc2V0Rmlyc3RQYWdlQ3VycmVudCgpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgcmVuZGVyIGJ1dHRvbnMgd2hlbiB3aXphcmQgaXMgb3BlbmVkLCB0byBhdm9pZCBjaG9jb2xhdGUgZXJyb3JzXG4gICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSA9IHRydWU7XG5cbiAgICB0aGlzLl9vcGVuQ2hhbmdlZC5lbWl0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgd2l6YXJkLiBDYWxsIHRoaXMgZGlyZWN0bHkgaW5zdGVhZCBvZiBgY2FuY2VsKClgIHRvIGltcGxlbWVudCBhbHRlcm5hdGl2ZSBjYW5jZWwgZnVuY3Rpb25hbGl0eS5cbiAgICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuX29wZW5DaGFuZ2VkLmVtaXQoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gb3BlbiBhbmQgY2xvc2UgdGhlIHdpemFyZC4gQnkgZGVmYXVsdCB0aGUgd2l6YXJkIHdpbGxcbiAgICogY2xvc2UgaWYgaW52b2tlZCB3aXRoIG5vIHBhcmFtZXRlci4gSWYgcGFyYW1ldGVyIGlzIHRydWUgd2l6YXJkIHdpbGwgb3BlblxuICAgKiBlbHNlIGlmIGZhbHNlIHdpbGwgY2xvc2UuXG4gICAqL1xuICB0b2dnbGUob3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgd2l6YXJkIHRvIHRoZSBwcmV2aW91cyBwYWdlLlxuICAgKi9cbiAgcHJldmlvdXMoKTogdm9pZCB7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLnByZXZpb3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgYG5leHQoKWAgZG9lcyBub3QgZXhlY3V0ZSBldmVudCBlbWlzc2lvbnMuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNvbW1vbmx5IGNhbGxlZCBhcyBwYXJ0IG9mIGFuIGFsdGVybmF0aXZlIG5hdmlnYXRpb25cbiAgICogd2l0aCBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gLiBUaGUgd2l6YXJkIHdpbGwgbW92ZSB0byB0aGUgbmV4dCBwYWdlXG4gICAqIHJlZ2FyZGxlc3Mgb2YgdGhlIHN0YXRlIG9mIGl0cyBjdXJyZW50IHBhZ2UuIFRoaXMgaXMgdXNlZnVsIGZvciBhbHRlcm5hdGl2ZVxuICAgKiBuYXZpZ2F0aW9uIHdoZXJlIGV2ZW50IGVtaXNzaW9ucyBoYXZlIGFscmVhZHkgYmVlbiBkb25lIGFuZCBmaXJpbmcgdGhlbSBhZ2FpblxuICAgKiBtYXkgY2F1c2UgYW4gZXZlbnQgbG9vcC5cbiAgICpcbiAgICogSWYgYHNraXBDaGVja3NBbmRFbWl0c2AgaXMgZmFsc2UsIHRoZSB3aXphcmQgd2lsbCBleGVjdXRlIGRlZmF1bHQgY2hlY2tzXG4gICAqIGFuZCBlbWl0IGV2ZW50cyBhcyBub3JtYWwuIFRoaXMgaXMgdXNlZnVsIGZvciBjdXN0b20gYnV0dG9ucyBvciBwcm9ncmFtbWF0aWNcbiAgICogd29ya2Zsb3dzIHRoYXQgYXJlIG5vdCBleGVjdXRpbmcgdGhlIHdpemFyZHMgZGVmYXVsdCBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogSXQgaXMgYW5vdGhlciB3YXkgdG8gbmF2aWdhdGUgd2l0aG91dCBoYXZpbmcgdG8gcmV3cml0ZSB0aGUgd2l6YXJk4oCZcyBkZWZhdWx0XG4gICAqIGZ1bmN0aW9uYWxpdHkgZnJvbSBzY3JhdGNoLlxuICAgKi9cbiAgbmV4dChza2lwQ2hlY2tzQW5kRW1pdHMgPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHNraXBDaGVja3NBbmRFbWl0cykge1xuICAgICAgdGhpcy5mb3JjZU5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHdpemFyZCB0byB0aGUgbmV4dCBwYWdlIHdpdGhvdXQgdGhlIGNoZWNrcyBhbmQgZW1pc3Npb25zLlxuICAgKiBHb29kIGZvciBhIGxhc3Qgc3RlcCBpbiBhbiBhbHRlcm5hdGUgd29ya2Zsb3cuXG4gICAqIEFsaWFzIGZvciBgQ2xyV2l6YXJkLm5leHQodHJ1ZSlgIG9yIGBDbHJXaXphcmQubmV4dCgpYFxuICAgKi9cbiAgZm9yY2VOZXh0KCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5mb3JjZU5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFuZCBjbG9zZXMgdGhlIHdpemFyZC4gRG8gbm90IHVzZSB0aGlzIGZvciBhbiBvdmVycmlkZSBvZiB0aGUgY2FuY2VsXG4gICAqIHRoZSBmdW5jdGlvbmFsaXR5IHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbF1gLCBgW2NscldpemFyZFByZXZlbnRQYWdlRGVmYXVsdENhbmNlbF1gLFxuICAgKiBvciBgW2NscldpemFyZFBhZ2VQcmV2ZW50RGVmYXVsdF1gIGJlY2F1c2UgaXQgd2lsbCBpbml0aWF0ZSB0aGUgc2FtZSBjaGVja3NcbiAgICogYW5kIGV2ZW50IGVtaXNzaW9ucyB0aGF0IGludm9rZWQgeW91ciBldmVudCBoYW5kbGVyLiBVc2UgYENscldpemFyZC5jbG9zZSgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5jYW5jZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgYmVoYXZpb3Igb2YgdGhlIHVuZGVybHlpbmcgbW9kYWwgdG8gYXZvaWQgY29sbGlzaW9ucyB3aXRoXG4gICAqIGFsdGVybmF0aXZlIGNhbmNlbCBmdW5jdGlvbmFsaXR5LiBJbiBtb3N0IGNhc2VzLCB1c2UgYENscldpemFyZC5jYW5jZWwoKWAgaW5zdGVhZC5cbiAgICovXG4gIG1vZGFsQ2FuY2VsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb3NhYmxlKSB7XG4gICAgICB0aGlzLmNoZWNrQW5kQ2FuY2VsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYWx0ZXJuYXRpdmUgY2FuY2VsIGZsb3dzIGRlZmluZWQgYXQgdGhlIGN1cnJlbnQgcGFnZSBvclxuICAgKiB3aXphcmQgbGV2ZWwuIFBlcmZvcm1zIGEgY2FuY2VsZWQgaWYgbm90LiBFbWl0cyBldmVudHMgdGhhdCBpbml0aWF0ZVxuICAgKiB0aGUgYWx0ZXJuYXRpdmUgY2FuY2VsIG91dHB1dHMgYChjbHJXaXphcmRQYWdlT25DYW5jZWwpYCBhbmQgYChjbHJXaXphcmRPbkNhbmNlbClgLlxuICAgKi9cbiAgY2hlY2tBbmRDYW5jZWwoKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzID0gY3VycmVudFBhZ2Uuc3RvcENhbmNlbCB8fCBjdXJyZW50UGFnZS5wcmV2ZW50RGVmYXVsdDtcblxuICAgIGlmICh0aGlzLnN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudFBhZ2UucGFnZU9uQ2FuY2VsLmVtaXQoKTtcbiAgICBpZiAoIWN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzKSB7XG4gICAgICB0aGlzLm9uQ2FuY2VsLmVtaXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RvcENhbmNlbCAmJiAhY3VycmVudFBhZ2VIYXNPdmVycmlkZXMpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvIGEgZ2l2ZW4gcGFnZSBpbiB0aGUgV2l6YXJkLiBOYXZpZ2F0aW9uIHdpbGwgaW52b2tlIHRoZSB3aXphcmTigJlzIGRlZmF1bHRcbiAgICogY2hlY2tzIGFuZCBldmVudCBlbWlzc2lvbnMuXG4gICAqXG4gICAqIFRoZSBmb3JtYXQgb2YgdGhlIGV4cGVjdGVkIElEIHBhcmFtZXRlciBjYW4gYmUgZm91bmQgaW4gdGhlIHJldHVybiBvZiB0aGVcbiAgICogQ2xyV2l6YXJkUGFnZS5pZCBnZXR0ZXIsIHVzdWFsbHkgcHJlZml4ZWQgd2l0aCBgY2xyLXdpemFyZC1wYWdlLWAgYW5kIHRoZW4gZWl0aGVyIGFcbiAgICogbnVtZXJpYyBJRCBvciB0aGUgSUQgc3BlY2lmaWVkIGZvciB0aGUgYENscldpemFyZFBhZ2VgIGNvbXBvbmVudOKAmXMgYGlkYCBpbnB1dC5cbiAgICovXG4gIGdvVG8ocGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXBhZ2VJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29UbyhwYWdlSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHNldHMgYWxsIFdpemFyZFBhZ2VzIHRvIGluY29tcGxldGUgYW5kIHNldHMgdGhlIGZpcnN0IHBhZ2UgaW4gdGhlIGBDbHJXaXphcmRgIHRvXG4gICAqIGJlIHRoZSBjdXJyZW50IHBhZ2UsIHJlc2V0dGluZyB0aGUgd2l6YXJkIG5hdmlnYXRpb24uXG4gICAqIFVzZSBgKGNscldpemFyZE9uUmVzZXQpYCBldmVudCB0byByZXNldCB0aGUgZGF0YSBvciBtb2RlbCBvZiB5b3VyIHdpemFyZC5cbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMucGFnZUNvbGxlY3Rpb24ucmVzZXQoKTtcbiAgICB0aGlzLm9uUmVzZXQuZW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JOZXh0UGFnZUNoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLm1vdmVkVG9OZXh0UGFnZS5waXBlKGZpbHRlcigoKSA9PiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25Nb3ZlTmV4dC5lbWl0KCk7XG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JQcmV2aW91c1BhZ2VDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5tb3ZlZFRvUHJldmlvdXNQYWdlLnBpcGUoZmlsdGVyKCgpID0+IGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5vbk1vdmVQcmV2aW91cy5lbWl0KCk7XG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JDYW5jZWxDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5ub3RpZnlXaXphcmRDYW5jZWwuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hlY2tBbmRDYW5jZWwoKSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckZpbmlzaGVkQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkRmluaXNoZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMuZW1pdFdpemFyZEZpbmlzaGVkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JQYWdlQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBBZGRlZCB0byBhZGRyZXNzIFZQQVQtNzQ5OlxuICAgICAgLy8gICBXaGVuIGNsaWNraW5nIG9uIGEgd2l6YXJkIHRhYiwgZm9jdXMgc2hvdWxkIG1vdmUgdG8gdGhhdFxuICAgICAgLy8gICB0YWJzIGNvbnRlbnQgdG8gbWFrZSB0aGUgd2l6YXJkIG1vcmUgYWNjZXNzaWJsZS5cbiAgICAgIHRoaXMucGFnZVRpdGxlPy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZC5lbWl0KCk7XG5cbiAgICAgIC8vIHNjcm9sbCB0byB0b3Agb2YgcGFnZSBpbiBjYXNlIHRoZXJlIGlzIGxvbmcgcGFnZSBjb250ZW50XG4gICAgICB0aGlzLm1vZGFsPy5zY3JvbGxUb3AoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTmF2T25QYWdlQ2hhbmdlcygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5kaWZmZXIuZGlmZih0aGlzLnBhZ2VzKTtcbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgY2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKCgpID0+IHRoaXMubmF2U2VydmljZS51cGRhdGVOYXZpZ2F0aW9uKCkpO1xuICAgICAgY2hhbmdlcy5mb3JFYWNoUmVtb3ZlZEl0ZW0oKCkgPT4gdGhpcy5uYXZTZXJ2aWNlLnVwZGF0ZU5hdmlnYXRpb24oKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQnV0dG9ucygpOiB2b2lkIHtcbiAgICAvLyBPbmx5IHRyaWdnZXIgYnV0dG9ucyByZWFkeSBpZiBkZWZhdWx0IGlzIG9wZW4gKGlubGluZWQpXG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdFdpemFyZEZpbmlzaGVkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdG9wTmV4dCkge1xuICAgICAgdGhpcy5mb3JjZUZpbmlzaCgpO1xuICAgIH1cbiAgICB0aGlzLndpemFyZEZpbmlzaGVkLmVtaXQoKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxjbHItbW9kYWxcbiAgW2Nsck1vZGFsT3Blbl09XCJfb3BlblwiXG4gIFtjbHJNb2RhbFNpemVdPVwic2l6ZVwiXG4gIFtjbHJNb2RhbENsb3NhYmxlXT1cImNsb3NhYmxlXCJcbiAgW2Nsck1vZGFsU3RhdGljQmFja2Ryb3BdPVwidHJ1ZVwiXG4gIFtjbHJNb2RhbFNraXBBbmltYXRpb25dPVwic3RvcE1vZGFsQW5pbWF0aW9uc1wiXG4gIFtjbHJNb2RhbE92ZXJyaWRlU2Nyb2xsU2VydmljZV09XCJpc0lubGluZVwiXG4gIFtjbHJNb2RhbFByZXZlbnRDbG9zZV09XCJ0cnVlXCJcbiAgKGNsck1vZGFsQWx0ZXJuYXRlQ2xvc2UpPVwibW9kYWxDYW5jZWwoKVwiXG4gIFtjbHJNb2RhbExhYmVsbGVkQnlJZF09XCJ3aXphcmRJZFwiXG4+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1uYXYgY2xyLXdpemFyZC1zdGVwbmF2LXdyYXBwZXJcIiByb2xlPVwicmVnaW9uXCI+XG4gICAgPGRpdiBjbGFzcz1cImNsci13aXphcmQtdGl0bGVcIiBbaWRdPVwid2l6YXJkSWRcIiByb2xlPVwiaGVhZGluZ1wiIFthdHRyLmFyaWEtbGV2ZWxdPVwid2l6YXJkVGl0bGUuaGVhZGluZ0xldmVsIHx8IDFcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci13aXphcmQtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gICAgPGNsci13aXphcmQtc3RlcG5hdiBbbGFiZWxdPVwic3RlcG5hdkFyaWFMYWJlbFwiPjwvY2xyLXdpemFyZC1zdGVwbmF2PlxuICA8L2Rpdj5cblxuICA8ZGl2IGNsYXNzPVwibW9kYWwtdGl0bGVcIiByb2xlPVwiaGVhZGluZ1wiIFthdHRyLmFyaWEtbGV2ZWxdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZT8ucGFnZVRpdGxlLmhlYWRpbmdMZXZlbCB8fCAyXCI+XG4gICAgPHNwYW4gdGFiaW5kZXg9XCItMVwiICNwYWdlVGl0bGUgY2xhc3M9XCJtb2RhbC10aXRsZS10ZXh0XCI+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZVRpdGxlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L3NwYW4+XG5cbiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyLWFjdGlvbnMtd3JhcHBlclwiICpuZ0lmPVwiaGVhZGVyQWN0aW9uU2VydmljZS5kaXNwbGF5SGVhZGVyQWN0aW9uc1dyYXBwZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJoZWFkZXJBY3Rpb25TZXJ2aWNlLnNob3dXaXphcmRIZWFkZXJBY3Rpb25zXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci13aXphcmQtaGVhZGVyLWFjdGlvblwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cImhlYWRlckFjdGlvblNlcnZpY2UuY3VycmVudFBhZ2VIYXNIZWFkZXJBY3Rpb25zXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJuYXZTZXJ2aWNlLmN1cnJlbnRQYWdlLmhlYWRlckFjdGlvbnNcIj48L25nLXRlbXBsYXRlPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgPG1haW4gY2xyLXdpemFyZC1wYWdlcy13cmFwcGVyIGNsYXNzPVwiY2xyLXdpemFyZC1jb250ZW50XCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9tYWluPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlciBjbHItd2l6YXJkLWZvb3RlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItd2l6YXJkLWZvb3Rlci1idXR0b25zXCI+XG4gICAgICA8ZGl2XG4gICAgICAgICpuZ0lmPVwibmF2U2VydmljZS5jdXJyZW50UGFnZSAmJiAhbmF2U2VydmljZS5jdXJyZW50UGFnZS5oYXNCdXR0b25zXCJcbiAgICAgICAgY2xhc3M9XCJjbHItd2l6YXJkLWZvb3Rlci1idXR0b25zLXdyYXBwZXJcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItd2l6YXJkLWJ1dHRvblwiPjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UgJiYgbmF2U2VydmljZS5jdXJyZW50UGFnZS5oYXNCdXR0b25zXCJcbiAgICAgICAgY2xhc3M9XCJjbHItd2l6YXJkLWZvb3Rlci1idXR0b25zLXdyYXBwZXJcIlxuICAgICAgPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZS5idXR0b25zXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvY2xyLW1vZGFsPlxuIl19