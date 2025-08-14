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
import * as i9 from "../icon/icon";
import * as i10 from "./wizard-stepnav";
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
         * Enable "in page" wizard. Set using `[clrWizardInPage]` input.
         */
        this.inPage = false;
        /**
         * Make an "in page" wizard fill the `.content-area`. Set using `[clrWizardInPageFillContentArea]` input.
         * If you can't use this option, you will likely need to provide custom CSS to set the wizard's height and margins.
         */
        this.inPageFillContentArea = false;
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
        if (this.inPage) {
            this.open();
        }
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
            this.bodyElementRef?.nativeElement.scrollTo(0, 0);
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
ClrWizard.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizard, selector: "clr-wizard", inputs: { stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"], size: ["clrWizardSize", "size"], inPage: ["clrWizardInPage", "inPage"], inPageFillContentArea: ["clrWizardInPageFillContentArea", "inPageFillContentArea"], closable: ["clrWizardClosable", "closable"], _stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"], forceForward: ["clrWizardForceForwardNavigation", "forceForward"], clrWizardOpen: "clrWizardOpen", stopNext: ["clrWizardPreventDefaultNext", "stopNext"], stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"], stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"], disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"] }, outputs: { _openChanged: "clrWizardOpenChange", onCancel: "clrWizardOnCancel", wizardFinished: "clrWizardOnFinish", onReset: "clrWizardOnReset", currentPageChanged: "clrWizardCurrentPageChanged", onMoveNext: "clrWizardOnNext", onMovePrevious: "clrWizardOnPrevious" }, host: { properties: { "class.clr-wizard": "true", "class.wizard-md": "size == 'md'", "class.wizard-lg": "size == 'lg'", "class.wizard-xl": "size == 'xl'", "class.wizard-in-page": "inPage", "class.wizard-in-page--fill-content-area": "inPage && inPageFillContentArea" } }, providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], queries: [{ propertyName: "wizardTitle", first: true, predicate: ClrWizardTitle, descendants: true }, { propertyName: "pages", predicate: ClrWizardPage, descendants: true }, { propertyName: "headerActions", predicate: ClrWizardHeaderAction }], viewQueries: [{ propertyName: "pageTitle", first: true, predicate: ["pageTitle"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }, { propertyName: "modal", first: true, predicate: ClrModal, descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-container *ngIf=\"inPage; then wizardTemplate; else wizardModalTemplate\"></ng-container>\n\n<ng-template #wizardModalTemplate>\n  <clr-modal\n    [clrModalOpen]=\"_open\"\n    [clrModalSize]=\"size\"\n    [clrModalClosable]=\"closable\"\n    [clrModalStaticBackdrop]=\"true\"\n    [clrModalSkipAnimation]=\"stopModalAnimations\"\n    [clrModalOverrideScrollService]=\"isInline\"\n    [clrModalPreventClose]=\"true\"\n    (clrModalAlternateClose)=\"modalCancel()\"\n    [clrModalLabelledById]=\"wizardId\"\n  >\n    <ng-template #clrInternalModalContentTemplate>\n      <ng-container [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n    </ng-template>\n  </clr-modal>\n</ng-template>\n\n<!-- This template is tightly coupled to the modal styles. -->\n<ng-template #wizardTemplate>\n  <div class=\"modal-content-wrapper\">\n    <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n      <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle.headingLevel || 1\">\n        <ng-content select=\"clr-wizard-title\"></ng-content>\n      </div>\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"modal-content\">\n      <div class=\"modal-header--accessible\">\n        <div class=\"modal-title-wrapper\" #title cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"modal-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n          <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n            <ng-content select=\"clr-wizard-header-action\"></ng-content>\n          </div>\n          <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n          </div>\n        </div>\n        <button\n          *ngIf=\"closable && !inPage\"\n          type=\"button\"\n          class=\"close\"\n          [attr.aria-label]=\"commonStrings.keys.close\"\n          (click)=\"modalCancel()\"\n        >\n          <cds-icon shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      <div #body class=\"modal-body-wrapper\">\n        <div class=\"modal-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n      <div class=\"modal-footer clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n          </div>\n          <div\n            *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i7.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i8.ClrModalBody, selector: ".modal-body" }, { kind: "directive", type: i9.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i10.ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: ["label"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-wizard', providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], host: {
                        '[class.clr-wizard]': 'true',
                        '[class.wizard-md]': "size == 'md'",
                        '[class.wizard-lg]': "size == 'lg'",
                        '[class.wizard-xl]': "size == 'xl'",
                        '[class.wizard-in-page]': 'inPage',
                        '[class.wizard-in-page--fill-content-area]': 'inPage && inPageFillContentArea',
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-container *ngIf=\"inPage; then wizardTemplate; else wizardModalTemplate\"></ng-container>\n\n<ng-template #wizardModalTemplate>\n  <clr-modal\n    [clrModalOpen]=\"_open\"\n    [clrModalSize]=\"size\"\n    [clrModalClosable]=\"closable\"\n    [clrModalStaticBackdrop]=\"true\"\n    [clrModalSkipAnimation]=\"stopModalAnimations\"\n    [clrModalOverrideScrollService]=\"isInline\"\n    [clrModalPreventClose]=\"true\"\n    (clrModalAlternateClose)=\"modalCancel()\"\n    [clrModalLabelledById]=\"wizardId\"\n  >\n    <ng-template #clrInternalModalContentTemplate>\n      <ng-container [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n    </ng-template>\n  </clr-modal>\n</ng-template>\n\n<!-- This template is tightly coupled to the modal styles. -->\n<ng-template #wizardTemplate>\n  <div class=\"modal-content-wrapper\">\n    <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n      <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle.headingLevel || 1\">\n        <ng-content select=\"clr-wizard-title\"></ng-content>\n      </div>\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"modal-content\">\n      <div class=\"modal-header--accessible\">\n        <div class=\"modal-title-wrapper\" #title cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"modal-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n          <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n            <ng-content select=\"clr-wizard-header-action\"></ng-content>\n          </div>\n          <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n          </div>\n        </div>\n        <button\n          *ngIf=\"closable && !inPage\"\n          type=\"button\"\n          class=\"close\"\n          [attr.aria-label]=\"commonStrings.keys.close\"\n          (click)=\"modalCancel()\"\n        >\n          <cds-icon shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      <div #body class=\"modal-body-wrapper\">\n        <div class=\"modal-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n      <div class=\"modal-footer clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n          </div>\n          <div\n            *ngIf=\"navService.currentPage && navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i1.ClrCommonStringsService }, { type: i2.WizardNavigationService }, { type: i3.PageCollectionService }, { type: i4.ButtonHubService }, { type: i5.HeaderActionService }, { type: i0.ElementRef }, { type: i0.IterableDiffers }]; }, propDecorators: { stepnavAriaLabel: [{
                type: Input,
                args: ['clrWizardStepnavAriaLabel']
            }], size: [{
                type: Input,
                args: ['clrWizardSize']
            }], inPage: [{
                type: Input,
                args: ['clrWizardInPage']
            }], inPageFillContentArea: [{
                type: Input,
                args: ['clrWizardInPageFillContentArea']
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
            }], bodyElementRef: [{
                type: ViewChild,
                args: ['body']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvd2l6YXJkL3dpemFyZC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFFTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUVYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7O0FBZWhELE1BQU0sT0FBTyxTQUFTO0lBbUdwQixZQUMrQixVQUFlLEVBQ3JDLGFBQXNDLEVBQ3RDLFVBQW1DLEVBQ25DLGNBQXFDLEVBQ3JDLGFB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QUFFO2dCQUNiLGFBQWE7c0JBQXBELGVBQWU7dUJBQUMscUJBQXFCO2dCQUtFLFdBQVc7c0JBQWxELFlBQVk7dUJBQUMsY0FBYztnQkFDUSxjQUFjO3NCQUFqRCxTQUFTO3VCQUFDLE1BQU07Z0JBVXFCLEtBQUs7c0JBQTFDLFNBQVM7dUJBQUMsUUFBUTtnQkE0QmYsWUFBWTtzQkFEZixLQUFLO3VCQUFDLGlDQUFpQztnQkFjcEMsYUFBYTtzQkFEaEIsS0FBSzt1QkFBQyxlQUFlO2dCQWVsQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsNkJBQTZCO2dCQWtCaEMsVUFBVTtzQkFEYixLQUFLO3VCQUFDLCtCQUErQjtnQkFrQmxDLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMsNEJBQTRCO2dCQWlCL0IsY0FBYztzQkFEakIsS0FBSzt1QkFBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbHJNb2RhbCB9IGZyb20gJy4uL21vZGFsL21vZGFsJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IEJ1dHRvbkh1YlNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9idXR0b24taHViLnNlcnZpY2UnO1xuaW1wb3J0IHsgSGVhZGVyQWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2hlYWRlci1hY3Rpb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy93aXphcmQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENscldpemFyZEhlYWRlckFjdGlvbiB9IGZyb20gJy4vd2l6YXJkLWhlYWRlci1hY3Rpb24nO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZSB9IGZyb20gJy4vd2l6YXJkLXBhZ2UnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkVGl0bGUgfSBmcm9tICcuL3dpemFyZC10aXRsZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci13aXphcmQnLFxuICBwcm92aWRlcnM6IFtXaXphcmROYXZpZ2F0aW9uU2VydmljZSwgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlLCBCdXR0b25IdWJTZXJ2aWNlLCBIZWFkZXJBY3Rpb25TZXJ2aWNlXSxcbiAgdGVtcGxhdGVVcmw6ICcuL3dpemFyZC5odG1sJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLXdpemFyZF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy53aXphcmQtbWRdJzogXCJzaXplID09ICdtZCdcIixcbiAgICAnW2NsYXNzLndpemFyZC1sZ10nOiBcInNpemUgPT0gJ2xnJ1wiLFxuICAgICdbY2xhc3Mud2l6YXJkLXhsXSc6IFwic2l6ZSA9PSAneGwnXCIsXG4gICAgJ1tjbGFzcy53aXphcmQtaW4tcGFnZV0nOiAnaW5QYWdlJyxcbiAgICAnW2NsYXNzLndpemFyZC1pbi1wYWdlLS1maWxsLWNvbnRlbnQtYXJlYV0nOiAnaW5QYWdlICYmIGluUGFnZUZpbGxDb250ZW50QXJlYScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENscldpemFyZCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50SW5pdCwgRG9DaGVjayB7XG4gIC8qKlxuICAgKiBTZXQgdGhlIGFyaWEtbGFiZWwgZm9yIHRoZSBzdGVwbmF2IHNlY3Rpb24gb2YgdGhlIHdpemFyZC4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkU3RlcG5hdkFyaWFMYWJlbF1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRTdGVwbmF2QXJpYUxhYmVsJykgc3RlcG5hdkFyaWFMYWJlbCA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLndpemFyZFN0ZXBuYXZBcmlhTGFiZWw7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbW9kYWwgc2l6ZSBvZiB0aGUgd2l6YXJkLiBTZXQgdXNpbmcgYFtjbHJXaXphcmRTaXplXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFNpemUnKSBzaXplID0gJ3hsJztcblxuICAvKipcbiAgICogRW5hYmxlIFwiaW4gcGFnZVwiIHdpemFyZC4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkSW5QYWdlXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZEluUGFnZScpIGluUGFnZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBNYWtlIGFuIFwiaW4gcGFnZVwiIHdpemFyZCBmaWxsIHRoZSBgLmNvbnRlbnQtYXJlYWAuIFNldCB1c2luZyBgW2NscldpemFyZEluUGFnZUZpbGxDb250ZW50QXJlYV1gIGlucHV0LlxuICAgKiBJZiB5b3UgY2FuJ3QgdXNlIHRoaXMgb3B0aW9uLCB5b3Ugd2lsbCBsaWtlbHkgbmVlZCB0byBwcm92aWRlIGN1c3RvbSBDU1MgdG8gc2V0IHRoZSB3aXphcmQncyBoZWlnaHQgYW5kIG1hcmdpbnMuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZEluUGFnZUZpbGxDb250ZW50QXJlYScpIGluUGFnZUZpbGxDb250ZW50QXJlYSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUZWxscyB0aGUgbW9kYWwgcGFydCBvZiB0aGUgd2l6YXJkIHdoZXRoZXIgaXQgc2hvdWxkIGhhdmUgYSBjbG9zZSBcIlhcIlxuICAgKiBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lci4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkQ2xvc2FibGVdYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkQ2xvc2FibGUnKSBjbG9zYWJsZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gY29tbXVuaWNhdGUgdG8gdGhlIHVuZGVybHlpbmcgbW9kYWwgdGhhdCBhbmltYXRpb25zIGFyZSBub3RcbiAgICogd2FudGVkLiBQcmltYXJ5IHVzZSBpcyBmb3IgdGhlIGRpc3BsYXkgb2Ygc3RhdGljL2lubGluZSB3aXphcmRzLlxuICAgKiBTZXQgdXNpbmcgYFtjbHJXaXphcmRQcmV2ZW50TW9kYWxBbmltYXRpb25dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUHJldmVudE1vZGFsQW5pbWF0aW9uJykgX3N0b3BNb2RhbEFuaW1hdGlvbnMgPSBmYWxzZTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIGlzIG9wZW5lZCBvciBjbG9zZWQuXG4gICAqIExpc3RlbiB2aWEgYChjbHJXaXphcmRPcGVuQ2hhbmdlKWAgZXZlbnQuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPcGVuQ2hhbmdlJykgX29wZW5DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyBjYW5jZWxlZC4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uQ2FuY2VsKWAgZXZlbnQuXG4gICAqIENhbiBiZSBjb21iaW5lZCB3aXRoIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0Q2FuY2VsXWAgaW5wdXQgdG8gY3JlYXRlXG4gICAqIHdpemFyZC1sZXZlbCBjdXN0b20gY2FuY2VsIHJvdXRpbmVzLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25DYW5jZWwnKSBvbkNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyBjb21wbGV0ZWQuIExpc3RlbiB2aWEgYChjbHJXaXphcmRPbkZpbmlzaClgIGV2ZW50LlxuICAgKiBDYW4gYmUgY29tYmluZWQgd2l0aCB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYCBpbnB1dCB0byBjcmVhdGVcbiAgICogd2l6YXJkLWxldmVsIGN1c3RvbSBjb21wbGV0aW9uIHJvdXRpbmVzLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25GaW5pc2gnKSB3aXphcmRGaW5pc2hlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyByZXNldC4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uUmVzZXQpYCBldmVudC5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uUmVzZXQnKSBvblJlc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgY3VycmVudCBwYWdlIGhhcyBjaGFuZ2VkLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkQ3VycmVudFBhZ2VDaGFuZ2VkKWAgZXZlbnQuXG4gICAqIG91dHB1dC4gVXNlZnVsIGZvciBub24tYmxvY2tpbmcgdmFsaWRhdGlvbi5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZEN1cnJlbnRQYWdlQ2hhbmdlZCcpIGN1cnJlbnRQYWdlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBtb3ZlcyB0byB0aGUgbmV4dCBwYWdlLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25OZXh0KWAgZXZlbnQuXG4gICAqIENhbiBiZSBjb21iaW5lZCB3aXRoIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gIGlucHV0IHRvIGNyZWF0ZVxuICAgKiB3aXphcmQtbGV2ZWwgY3VzdG9tIG5hdmlnYXRpb24gcm91dGluZXMsIHdoaWNoIGFyZSB1c2VmdWwgZm9yIHZhbGlkYXRpb24uXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPbk5leHQnKSBvbk1vdmVOZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgd2l6YXJkIG1vdmVzIHRvIHRoZSBwcmV2aW91cyBwYWdlLiBDYW4gYmUgdXNlZnVsIGZvciB2YWxpZGF0aW9uLlxuICAgKiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25QcmV2aW91cylgIGV2ZW50LlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25QcmV2aW91cycpIG9uTW92ZVByZXZpb3VzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICBAVmlld0NoaWxkKCdwYWdlVGl0bGUnKSBwYWdlVGl0bGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAQ29udGVudENoaWxkcmVuKENscldpemFyZFBhZ2UsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgcGFnZXM6IFF1ZXJ5TGlzdDxDbHJXaXphcmRQYWdlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihDbHJXaXphcmRIZWFkZXJBY3Rpb24pIGhlYWRlckFjdGlvbnM6IFF1ZXJ5TGlzdDxDbHJXaXphcmRIZWFkZXJBY3Rpb24+O1xuXG4gIF9vcGVuID0gZmFsc2U7XG4gIHdpemFyZElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgQENvbnRlbnRDaGlsZChDbHJXaXphcmRUaXRsZSkgcHJvdGVjdGVkIHdpemFyZFRpdGxlOiBDbHJXaXphcmRUaXRsZTtcbiAgQFZpZXdDaGlsZCgnYm9keScpIHByaXZhdGUgcmVhZG9ubHkgYm9keUVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIHByaXZhdGUgX2ZvcmNlRm9yd2FyZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wTmV4dCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wQ2FuY2VsID0gZmFsc2U7XG4gIHByaXZhdGUgX3N0b3BOYXZpZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVTdGVwbmF2ID0gZmFsc2U7XG4gIHByaXZhdGUgZGlmZmVyOiBhbnk7IC8vIGZvciBtYXJraW5nIHdoZW4gdGhlIGNvbGxlY3Rpb24gb2Ygd2l6YXJkIHBhZ2VzIGhhcyBiZWVuIGFkZGVkIHRvIG9yIGRlbGV0ZWQgZnJvbVxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgQFZpZXdDaGlsZChDbHJNb2RhbCkgcHJpdmF0ZSByZWFkb25seSBtb2RhbDogQ2xyTW9kYWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHB1YmxpYyBuYXZTZXJ2aWNlOiBXaXphcmROYXZpZ2F0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgcGFnZUNvbGxlY3Rpb246IFBhZ2VDb2xsZWN0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgYnV0dG9uU2VydmljZTogQnV0dG9uSHViU2VydmljZSxcbiAgICBwdWJsaWMgaGVhZGVyQWN0aW9uU2VydmljZTogSGVhZGVyQWN0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVyc1xuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV4dFBhZ2VDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvclByZXZpb3VzUGFnZUNoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yQ2FuY2VsQ2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JGaW5pc2hlZENoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yUGFnZUNoYW5nZXMoKVxuICAgICk7XG5cbiAgICB0aGlzLmRpZmZlciA9IGRpZmZlcnMuZmluZChbXSkuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyBwYWdlIGNvbXBsZXRlZCBzdGF0ZXMgd2hlbiBuYXZpZ2F0aW5nIGJhY2t3YXJkcy5cbiAgICogU2V0IHVzaW5nIGBbY2xyV2l6YXJkRm9yY2VGb3J3YXJkTmF2aWdhdGlvbl1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRGb3JjZUZvcndhcmROYXZpZ2F0aW9uJylcbiAgZ2V0IGZvcmNlRm9yd2FyZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9yY2VGb3J3YXJkO1xuICB9XG4gIHNldCBmb3JjZUZvcndhcmQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9mb3JjZUZvcndhcmQgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS5mb3JjZUZvcndhcmROYXZpZ2F0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyBvcGVuL2Nsb3NlIG9mIHRoZSB3aXphcmQgY29tcG9uZW50LlxuICAgKiBTZXQgdXNpbmcgdGhlIGBbY2xyV2l6YXJkT3Blbl1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRPcGVuJylcbiAgc2V0IGNscldpemFyZE9wZW4ob3BlbjogYm9vbGVhbikge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICB0aGlzLmJ1dHRvblNlcnZpY2UuYnV0dG9uc1JlYWR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5fb3BlbiA9IG9wZW47XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgQ2xyV2l6YXJkIGZyb20gbW92aW5nIHRvIHRoZSBuZXh0IHBhZ2Ugb3IgY2xvc2luZyBpdHNlbGYgb24gZmluaXNoaW5nLlxuICAgKiBTZXQgdXNpbmcgdGhlIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0XWAgaW5wdXQuIE5vdGUgdGhhdCB1c2luZyBzdG9wTmV4dFxuICAgKiB3aWxsIHJlcXVpcmUgeW91IHRvIGNyZWF0ZSB5b3VyIG93biBjYWxscyB0byAubmV4dCgpIGFuZCAuZmluaXNoKCkgaW4geW91clxuICAgKiBob3N0IGNvbXBvbmVudCB0byBtYWtlIHRoZSBDbHJXaXphcmQgd29yayBhcyBleHBlY3RlZC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0JylcbiAgZ2V0IHN0b3BOZXh0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wTmV4dDtcbiAgfVxuICBzZXQgc3RvcE5leHQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdG9wTmV4dCA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLndpemFyZEhhc0FsdE5leHQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBDbHJXaXphcmQgZnJvbSBjbG9zaW5nIHdoZW4gdGhlIGNhbmNlbCBidXR0b24gb3IgY2xvc2UgXCJYXCIgaXMgY2xpY2tlZC5cbiAgICogU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0Q2FuY2VsXWAgaW5wdXQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB1c2luZyBzdG9wQ2FuY2VsIHdpbGwgcmVxdWlyZSB5b3UgdG8gY3JlYXRlIHlvdXIgb3duIGNhbGxzIHRvIGBjbG9zZSgpYCBpbiB5b3VyIGhvc3QgY29tcG9uZWBudFxuICAgKiB0byBtYWtlIHRoZSBDbHJXaXphcmQgd29yayBhcyBleHBlY3RlZC4gVXNlZnVsIGZvciBkb2luZyBjaGVja3Mgb3IgcHJvbXB0c1xuICAgKiBiZWZvcmUgY2xvc2luZyBhIENscldpemFyZC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUHJldmVudERlZmF1bHRDYW5jZWwnKVxuICBnZXQgc3RvcENhbmNlbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcENhbmNlbDtcbiAgfVxuICBzZXQgc3RvcENhbmNlbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3N0b3BDYW5jZWwgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmRIYXNBbHRDYW5jZWwgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBDbHJXaXphcmQgZnJvbSBwZXJmb3JtaW5nIGFueSBmb3JtIG9mIG5hdmlnYXRpb24gYXdheSBmcm9tIHRoZSBjdXJyZW50XG4gICAqIHBhZ2UuIFNldCB1c2luZyB0aGUgYFtjbHJXaXphcmRQcmV2ZW50TmF2aWdhdGlvbl1gIGlucHV0LlxuICAgKiBOb3RlIHRoYXQgc3RvcE5hdmlnYXRpb24gaXMgbWVhbnQgdG8gZnJlZXplIHRoZSB3aXphcmQgaW4gcGxhY2UsIHR5cGljYWxseVxuICAgKiBkdXJpbmcgYSBsb25nIHZhbGlkYXRpb24gb3IgYmFja2dyb3VuZCBhY3Rpb24gd2hlcmUgeW91IHdhbnQgdGhlIHdpemFyZCB0b1xuICAgKiBkaXNwbGF5IGxvYWRpbmcgY29udGVudCBidXQgbm90IGFsbG93IHRoZSB1c2VyIHRvIGV4ZWN1dGUgbmF2aWdhdGlvbiBpblxuICAgKiB0aGUgc3RlcG5hdiwgY2xvc2UgWCwgb3IgdGhlICBiYWNrLCBmaW5pc2gsIG9yIG5leHQgYnV0dG9ucy5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUHJldmVudE5hdmlnYXRpb24nKVxuICBnZXQgc3RvcE5hdmlnYXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BOYXZpZ2F0aW9uO1xuICB9XG4gIHNldCBzdG9wTmF2aWdhdGlvbih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3N0b3BOYXZpZ2F0aW9uID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkU3RvcE5hdmlnYXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBjbGlja3Mgb24gdGhlIGxpbmtzIGluIHRoZSBzdGVwbmF2IGZyb20gd29ya2luZy5cbiAgICogU2V0IHVzaW5nIGBbY2xyV2l6YXJkRGlzYWJsZVN0ZXBuYXZdYCBpbnB1dC5cbiAgICogQSBtb3JlIGdyYW51bGFyIGJ5cGFzc2luZyBvZiBuYXZpZ2F0aW9uIHdoaWNoIGNhbiBiZSB1c2VmdWwgd2hlbiB5b3VyXG4gICAqIENscldpemFyZCBpcyBpbiBhIHN0YXRlIG9mIGNvbXBsZXRpb24gYW5kIHlvdSBkb24ndCB3YW50IHVzZXJzIHRvIGJlXG4gICAqIGFibGUgdG8ganVtcCBiYWNrd2FyZHMgYW5kIGNoYW5nZSB0aGluZ3MuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZERpc2FibGVTdGVwbmF2JylcbiAgZ2V0IGRpc2FibGVTdGVwbmF2KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlU3RlcG5hdjtcbiAgfVxuICBzZXQgZGlzYWJsZVN0ZXBuYXYodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlU3RlcG5hdiA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLndpemFyZERpc2FibGVTdGVwbmF2ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY3VycmVudFBhZ2UoKTogQ2xyV2l6YXJkUGFnZSB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZTtcbiAgfVxuICBzZXQgY3VycmVudFBhZ2UocGFnZTogQ2xyV2l6YXJkUGFnZSkge1xuICAgIHRoaXMubmF2U2VydmljZS5nb1RvKHBhZ2UsIHRydWUpO1xuICB9XG5cbiAgZ2V0IGlzTGFzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlSXNMYXN0O1xuICB9XG5cbiAgZ2V0IGlzRmlyc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZUlzRmlyc3Q7XG4gIH1cblxuICBnZXQgaXNJbmxpbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY2xyLXdpemFyZC0taW5saW5lJyk7XG4gIH1cblxuICBnZXQgc3RvcE1vZGFsQW5pbWF0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcE1vZGFsQW5pbWF0aW9ucztcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLnBhZ2VzID0gdGhpcy5wYWdlcztcbiAgICB0aGlzLmhlYWRlckFjdGlvblNlcnZpY2Uud2l6YXJkSGVhZGVyQWN0aW9ucyA9IHRoaXMuaGVhZGVyQWN0aW9ucztcblxuICAgIGlmICh0aGlzLmluUGFnZSkge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplQnV0dG9ucygpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlTmF2T25QYWdlQ2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIFdpemFyZCBhcyBmaW5pc2hlZC4gQnkgZGVmYXVsdCBpdCBkb2VzIG5vdCBleGVjdXRlIGV2ZW50XG4gICAqIGVtaXNzaW9ucyBvciBjaGVja3MgYmVmb3JlIGNvbXBsZXRpbmcgYW5kIGNsb3NpbmcuIFRoaXMgbWV0aG9kIGlzIGNvbW1vbmx5XG4gICAqIHVzZWQgYXMgcGFydCBvZiBhbiBhbHRlcm5hdGl2ZSBuYXZpZ2F0aW9uIHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYC5cbiAgICpcbiAgICogSWYgYHNraXBDaGVja3NBbmRFbWl0c2AgaXMgdHJ1ZSwgdGhlIHdpemFyZCB3aWxsIGNvbXBsZXRlIGFuZCBjbG9zZVxuICAgKiByZWdhcmRsZXNzIG9mIHRoZSBzdGF0ZSBvZiBpdHMgY3VycmVudCBwYWdlLiBUaGlzIGlzIHVzZWZ1bCBmb3IgYWx0ZXJuYXRpdmVcbiAgICogbmF2aWdhdGlvbiB3aGVyZSBldmVudCBlbWlzc2lvbnMgaGF2ZSBhbHJlYWR5IGJlZW4gZG9uZSBhbmQgZmlyaW5nIHRoZW0gYWdhaW5cbiAgICogbWF5IGNhdXNlIGFuIGV2ZW50IGxvb3AuXG4gICAqL1xuICBmaW5pc2goc2tpcENoZWNrc0FuZEVtaXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChza2lwQ2hlY2tzQW5kRW1pdHMpIHtcbiAgICAgIHRoaXMuZm9yY2VGaW5pc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLmZpbmlzaCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgd2l6YXJkIGFzIGZpbmlzaGVkIGJ1dCBkb2VzIHJ1biBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogR29vZCBmb3IgYSBsYXN0IHN0ZXAgaW4gYW4gYWx0ZXJuYXRlIHdvcmtmbG93LiBEb2VzIHRoZSBzYW1lIHRoaW5nIGFzXG4gICAqIGNhbGxpbmcgYENscldpemFyZC5maW5pc2godHJ1ZSlgIG9yIGBDbHJXaXphcmQuZmluaXNoKClgIHdpdGhvdXQgYSBwYXJhbWV0ZXIuXG4gICAqL1xuICBmb3JjZUZpbmlzaCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgd2l6YXJkLiBJZiB0aGVyZSBpcyBubyBjdXJyZW50IHBhZ2UgZGVmaW5lZCwgc2V0cyB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgd2l6YXJkIHRvIGJlIGN1cnJlbnQuXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuX29wZW4gPSB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlKSB7XG4gICAgICB0aGlzLm5hdlNlcnZpY2Uuc2V0Rmlyc3RQYWdlQ3VycmVudCgpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgcmVuZGVyIGJ1dHRvbnMgd2hlbiB3aXphcmQgaXMgb3BlbmVkLCB0byBhdm9pZCBjaG9jb2xhdGUgZXJyb3JzXG4gICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSA9IHRydWU7XG5cbiAgICB0aGlzLl9vcGVuQ2hhbmdlZC5lbWl0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgd2l6YXJkLiBDYWxsIHRoaXMgZGlyZWN0bHkgaW5zdGVhZCBvZiBgY2FuY2VsKClgIHRvIGltcGxlbWVudCBhbHRlcm5hdGl2ZSBjYW5jZWwgZnVuY3Rpb25hbGl0eS5cbiAgICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuX29wZW5DaGFuZ2VkLmVtaXQoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gb3BlbiBhbmQgY2xvc2UgdGhlIHdpemFyZC4gQnkgZGVmYXVsdCB0aGUgd2l6YXJkIHdpbGxcbiAgICogY2xvc2UgaWYgaW52b2tlZCB3aXRoIG5vIHBhcmFtZXRlci4gSWYgcGFyYW1ldGVyIGlzIHRydWUgd2l6YXJkIHdpbGwgb3BlblxuICAgKiBlbHNlIGlmIGZhbHNlIHdpbGwgY2xvc2UuXG4gICAqL1xuICB0b2dnbGUob3BlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgd2l6YXJkIHRvIHRoZSBwcmV2aW91cyBwYWdlLlxuICAgKi9cbiAgcHJldmlvdXMoKTogdm9pZCB7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLnByZXZpb3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogQnkgZGVmYXVsdCwgYG5leHQoKWAgZG9lcyBub3QgZXhlY3V0ZSBldmVudCBlbWlzc2lvbnMuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNvbW1vbmx5IGNhbGxlZCBhcyBwYXJ0IG9mIGFuIGFsdGVybmF0aXZlIG5hdmlnYXRpb25cbiAgICogd2l0aCBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gLiBUaGUgd2l6YXJkIHdpbGwgbW92ZSB0byB0aGUgbmV4dCBwYWdlXG4gICAqIHJlZ2FyZGxlc3Mgb2YgdGhlIHN0YXRlIG9mIGl0cyBjdXJyZW50IHBhZ2UuIFRoaXMgaXMgdXNlZnVsIGZvciBhbHRlcm5hdGl2ZVxuICAgKiBuYXZpZ2F0aW9uIHdoZXJlIGV2ZW50IGVtaXNzaW9ucyBoYXZlIGFscmVhZHkgYmVlbiBkb25lIGFuZCBmaXJpbmcgdGhlbSBhZ2FpblxuICAgKiBtYXkgY2F1c2UgYW4gZXZlbnQgbG9vcC5cbiAgICpcbiAgICogSWYgYHNraXBDaGVja3NBbmRFbWl0c2AgaXMgZmFsc2UsIHRoZSB3aXphcmQgd2lsbCBleGVjdXRlIGRlZmF1bHQgY2hlY2tzXG4gICAqIGFuZCBlbWl0IGV2ZW50cyBhcyBub3JtYWwuIFRoaXMgaXMgdXNlZnVsIGZvciBjdXN0b20gYnV0dG9ucyBvciBwcm9ncmFtbWF0aWNcbiAgICogd29ya2Zsb3dzIHRoYXQgYXJlIG5vdCBleGVjdXRpbmcgdGhlIHdpemFyZHMgZGVmYXVsdCBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogSXQgaXMgYW5vdGhlciB3YXkgdG8gbmF2aWdhdGUgd2l0aG91dCBoYXZpbmcgdG8gcmV3cml0ZSB0aGUgd2l6YXJk4oCZcyBkZWZhdWx0XG4gICAqIGZ1bmN0aW9uYWxpdHkgZnJvbSBzY3JhdGNoLlxuICAgKi9cbiAgbmV4dChza2lwQ2hlY2tzQW5kRW1pdHMgPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHNraXBDaGVja3NBbmRFbWl0cykge1xuICAgICAgdGhpcy5mb3JjZU5leHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHdpemFyZCB0byB0aGUgbmV4dCBwYWdlIHdpdGhvdXQgdGhlIGNoZWNrcyBhbmQgZW1pc3Npb25zLlxuICAgKiBHb29kIGZvciBhIGxhc3Qgc3RlcCBpbiBhbiBhbHRlcm5hdGUgd29ya2Zsb3cuXG4gICAqIEFsaWFzIGZvciBgQ2xyV2l6YXJkLm5leHQodHJ1ZSlgIG9yIGBDbHJXaXphcmQubmV4dCgpYFxuICAgKi9cbiAgZm9yY2VOZXh0KCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5mb3JjZU5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFuZCBjbG9zZXMgdGhlIHdpemFyZC4gRG8gbm90IHVzZSB0aGlzIGZvciBhbiBvdmVycmlkZSBvZiB0aGUgY2FuY2VsXG4gICAqIHRoZSBmdW5jdGlvbmFsaXR5IHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbF1gLCBgW2NscldpemFyZFByZXZlbnRQYWdlRGVmYXVsdENhbmNlbF1gLFxuICAgKiBvciBgW2NscldpemFyZFBhZ2VQcmV2ZW50RGVmYXVsdF1gIGJlY2F1c2UgaXQgd2lsbCBpbml0aWF0ZSB0aGUgc2FtZSBjaGVja3NcbiAgICogYW5kIGV2ZW50IGVtaXNzaW9ucyB0aGF0IGludm9rZWQgeW91ciBldmVudCBoYW5kbGVyLiBVc2UgYENscldpemFyZC5jbG9zZSgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5jYW5jZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgYmVoYXZpb3Igb2YgdGhlIHVuZGVybHlpbmcgbW9kYWwgdG8gYXZvaWQgY29sbGlzaW9ucyB3aXRoXG4gICAqIGFsdGVybmF0aXZlIGNhbmNlbCBmdW5jdGlvbmFsaXR5LiBJbiBtb3N0IGNhc2VzLCB1c2UgYENscldpemFyZC5jYW5jZWwoKWAgaW5zdGVhZC5cbiAgICovXG4gIG1vZGFsQ2FuY2VsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb3NhYmxlKSB7XG4gICAgICB0aGlzLmNoZWNrQW5kQ2FuY2VsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYWx0ZXJuYXRpdmUgY2FuY2VsIGZsb3dzIGRlZmluZWQgYXQgdGhlIGN1cnJlbnQgcGFnZSBvclxuICAgKiB3aXphcmQgbGV2ZWwuIFBlcmZvcm1zIGEgY2FuY2VsZWQgaWYgbm90LiBFbWl0cyBldmVudHMgdGhhdCBpbml0aWF0ZVxuICAgKiB0aGUgYWx0ZXJuYXRpdmUgY2FuY2VsIG91dHB1dHMgYChjbHJXaXphcmRQYWdlT25DYW5jZWwpYCBhbmQgYChjbHJXaXphcmRPbkNhbmNlbClgLlxuICAgKi9cbiAgY2hlY2tBbmRDYW5jZWwoKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzID0gY3VycmVudFBhZ2Uuc3RvcENhbmNlbCB8fCBjdXJyZW50UGFnZS5wcmV2ZW50RGVmYXVsdDtcblxuICAgIGlmICh0aGlzLnN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3VycmVudFBhZ2UucGFnZU9uQ2FuY2VsLmVtaXQoKTtcbiAgICBpZiAoIWN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzKSB7XG4gICAgICB0aGlzLm9uQ2FuY2VsLmVtaXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RvcENhbmNlbCAmJiAhY3VycmVudFBhZ2VIYXNPdmVycmlkZXMpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvIGEgZ2l2ZW4gcGFnZSBpbiB0aGUgV2l6YXJkLiBOYXZpZ2F0aW9uIHdpbGwgaW52b2tlIHRoZSB3aXphcmTigJlzIGRlZmF1bHRcbiAgICogY2hlY2tzIGFuZCBldmVudCBlbWlzc2lvbnMuXG4gICAqXG4gICAqIFRoZSBmb3JtYXQgb2YgdGhlIGV4cGVjdGVkIElEIHBhcmFtZXRlciBjYW4gYmUgZm91bmQgaW4gdGhlIHJldHVybiBvZiB0aGVcbiAgICogQ2xyV2l6YXJkUGFnZS5pZCBnZXR0ZXIsIHVzdWFsbHkgcHJlZml4ZWQgd2l0aCBgY2xyLXdpemFyZC1wYWdlLWAgYW5kIHRoZW4gZWl0aGVyIGFcbiAgICogbnVtZXJpYyBJRCBvciB0aGUgSUQgc3BlY2lmaWVkIGZvciB0aGUgYENscldpemFyZFBhZ2VgIGNvbXBvbmVudOKAmXMgYGlkYCBpbnB1dC5cbiAgICovXG4gIGdvVG8ocGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXBhZ2VJZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29UbyhwYWdlSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHNldHMgYWxsIFdpemFyZFBhZ2VzIHRvIGluY29tcGxldGUgYW5kIHNldHMgdGhlIGZpcnN0IHBhZ2UgaW4gdGhlIGBDbHJXaXphcmRgIHRvXG4gICAqIGJlIHRoZSBjdXJyZW50IHBhZ2UsIHJlc2V0dGluZyB0aGUgd2l6YXJkIG5hdmlnYXRpb24uXG4gICAqIFVzZSBgKGNscldpemFyZE9uUmVzZXQpYCBldmVudCB0byByZXNldCB0aGUgZGF0YSBvciBtb2RlbCBvZiB5b3VyIHdpemFyZC5cbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMucGFnZUNvbGxlY3Rpb24ucmVzZXQoKTtcbiAgICB0aGlzLm9uUmVzZXQuZW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JOZXh0UGFnZUNoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLm1vdmVkVG9OZXh0UGFnZS5waXBlKGZpbHRlcigoKSA9PiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25Nb3ZlTmV4dC5lbWl0KCk7XG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JQcmV2aW91c1BhZ2VDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5tb3ZlZFRvUHJldmlvdXNQYWdlLnBpcGUoZmlsdGVyKCgpID0+IGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5vbk1vdmVQcmV2aW91cy5lbWl0KCk7XG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JDYW5jZWxDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5ub3RpZnlXaXphcmRDYW5jZWwuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hlY2tBbmRDYW5jZWwoKSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckZpbmlzaGVkQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkRmluaXNoZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMuZW1pdFdpemFyZEZpbmlzaGVkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JQYWdlQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyBBZGRlZCB0byBhZGRyZXNzIFZQQVQtNzQ5OlxuICAgICAgLy8gICBXaGVuIGNsaWNraW5nIG9uIGEgd2l6YXJkIHRhYiwgZm9jdXMgc2hvdWxkIG1vdmUgdG8gdGhhdFxuICAgICAgLy8gICB0YWJzIGNvbnRlbnQgdG8gbWFrZSB0aGUgd2l6YXJkIG1vcmUgYWNjZXNzaWJsZS5cbiAgICAgIHRoaXMucGFnZVRpdGxlPy5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZC5lbWl0KCk7XG5cbiAgICAgIC8vIHNjcm9sbCB0byB0b3Agb2YgcGFnZSBpbiBjYXNlIHRoZXJlIGlzIGxvbmcgcGFnZSBjb250ZW50XG4gICAgICB0aGlzLmJvZHlFbGVtZW50UmVmPy5uYXRpdmVFbGVtZW50LnNjcm9sbFRvKDAsIDApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVOYXZPblBhZ2VDaGFuZ2VzKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmRpZmZlci5kaWZmKHRoaXMucGFnZXMpO1xuICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICBjaGFuZ2VzLmZvckVhY2hBZGRlZEl0ZW0oKCkgPT4gdGhpcy5uYXZTZXJ2aWNlLnVwZGF0ZU5hdmlnYXRpb24oKSk7XG4gICAgICBjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgoKSA9PiB0aGlzLm5hdlNlcnZpY2UudXBkYXRlTmF2aWdhdGlvbigpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVCdXR0b25zKCk6IHZvaWQge1xuICAgIC8vIE9ubHkgdHJpZ2dlciBidXR0b25zIHJlYWR5IGlmIGRlZmF1bHQgaXMgb3BlbiAoaW5saW5lZClcbiAgICBpZiAodGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0V2l6YXJkRmluaXNoZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnN0b3BOZXh0KSB7XG4gICAgICB0aGlzLmZvcmNlRmluaXNoKCk7XG4gICAgfVxuICAgIHRoaXMud2l6YXJkRmluaXNoZWQuZW1pdCgpO1xuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cblxuPG5nLWNvbnRhaW5lciAqbmdJZj1cImluUGFnZTsgdGhlbiB3aXphcmRUZW1wbGF0ZTsgZWxzZSB3aXphcmRNb2RhbFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG5cbjxuZy10ZW1wbGF0ZSAjd2l6YXJkTW9kYWxUZW1wbGF0ZT5cbiAgPGNsci1tb2RhbFxuICAgIFtjbHJNb2RhbE9wZW5dPVwiX29wZW5cIlxuICAgIFtjbHJNb2RhbFNpemVdPVwic2l6ZVwiXG4gICAgW2Nsck1vZGFsQ2xvc2FibGVdPVwiY2xvc2FibGVcIlxuICAgIFtjbHJNb2RhbFN0YXRpY0JhY2tkcm9wXT1cInRydWVcIlxuICAgIFtjbHJNb2RhbFNraXBBbmltYXRpb25dPVwic3RvcE1vZGFsQW5pbWF0aW9uc1wiXG4gICAgW2Nsck1vZGFsT3ZlcnJpZGVTY3JvbGxTZXJ2aWNlXT1cImlzSW5saW5lXCJcbiAgICBbY2xyTW9kYWxQcmV2ZW50Q2xvc2VdPVwidHJ1ZVwiXG4gICAgKGNsck1vZGFsQWx0ZXJuYXRlQ2xvc2UpPVwibW9kYWxDYW5jZWwoKVwiXG4gICAgW2Nsck1vZGFsTGFiZWxsZWRCeUlkXT1cIndpemFyZElkXCJcbiAgPlxuICAgIDxuZy10ZW1wbGF0ZSAjY2xySW50ZXJuYWxNb2RhbENvbnRlbnRUZW1wbGF0ZT5cbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwid2l6YXJkVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICA8L2Nsci1tb2RhbD5cbjwvbmctdGVtcGxhdGU+XG5cbjwhLS0gVGhpcyB0ZW1wbGF0ZSBpcyB0aWdodGx5IGNvdXBsZWQgdG8gdGhlIG1vZGFsIHN0eWxlcy4gLS0+XG48bmctdGVtcGxhdGUgI3dpemFyZFRlbXBsYXRlPlxuICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudC13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLW5hdiBjbHItd2l6YXJkLXN0ZXBuYXYtd3JhcHBlclwiIHJvbGU9XCJyZWdpb25cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHItd2l6YXJkLXRpdGxlXCIgW2lkXT1cIndpemFyZElkXCIgcm9sZT1cImhlYWRpbmdcIiBbYXR0ci5hcmlhLWxldmVsXT1cIndpemFyZFRpdGxlLmhlYWRpbmdMZXZlbCB8fCAxXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci13aXphcmQtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxjbHItd2l6YXJkLXN0ZXBuYXYgW2xhYmVsXT1cInN0ZXBuYXZBcmlhTGFiZWxcIj48L2Nsci13aXphcmQtc3RlcG5hdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyLS1hY2Nlc3NpYmxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZS13cmFwcGVyXCIgI3RpdGxlIGNka0ZvY3VzSW5pdGlhbCB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJtb2RhbC10aXRsZVwiXG4gICAgICAgICAgICByb2xlPVwiaGVhZGluZ1wiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxldmVsXT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2U/LnBhZ2VUaXRsZS5oZWFkaW5nTGV2ZWwgfHwgMlwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gdGFiaW5kZXg9XCItMVwiICNwYWdlVGl0bGUgY2xhc3M9XCJtb2RhbC10aXRsZS10ZXh0XCI+XG4gICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJuYXZTZXJ2aWNlLmN1cnJlbnRQYWdlVGl0bGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlci1hY3Rpb25zLXdyYXBwZXJcIiAqbmdJZj1cImhlYWRlckFjdGlvblNlcnZpY2UuZGlzcGxheUhlYWRlckFjdGlvbnNXcmFwcGVyXCI+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cImhlYWRlckFjdGlvblNlcnZpY2Uuc2hvd1dpemFyZEhlYWRlckFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci13aXphcmQtaGVhZGVyLWFjdGlvblwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2ICpuZ0lmPVwiaGVhZGVyQWN0aW9uU2VydmljZS5jdXJyZW50UGFnZUhhc0hlYWRlckFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJuYXZTZXJ2aWNlLmN1cnJlbnRQYWdlLmhlYWRlckFjdGlvbnNcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICpuZ0lmPVwiY2xvc2FibGUgJiYgIWluUGFnZVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJjbG9zZVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIlxuICAgICAgICAgIChjbGljayk9XCJtb2RhbENhbmNlbCgpXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cIndpbmRvdy1jbG9zZVwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2ICNib2R5IGNsYXNzPVwibW9kYWwtYm9keS13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgPG1haW4gY2xyLXdpemFyZC1wYWdlcy13cmFwcGVyIGNsYXNzPVwiY2xyLXdpemFyZC1jb250ZW50XCI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPC9tYWluPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlciBjbHItd2l6YXJkLWZvb3RlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9uc1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0lmPVwibmF2U2VydmljZS5jdXJyZW50UGFnZSAmJiAhbmF2U2VydmljZS5jdXJyZW50UGFnZS5oYXNCdXR0b25zXCJcbiAgICAgICAgICAgIGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9ucy13cmFwcGVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItd2l6YXJkLWJ1dHRvblwiPjwvbmctY29udGVudD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAqbmdJZj1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UgJiYgbmF2U2VydmljZS5jdXJyZW50UGFnZS5oYXNCdXR0b25zXCJcbiAgICAgICAgICAgIGNsYXNzPVwiY2xyLXdpemFyZC1mb290ZXItYnV0dG9ucy13cmFwcGVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZS5idXR0b25zXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19