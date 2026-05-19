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
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
        this.modal.title = title;
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
ClrWizard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrWizard, deps: [{ token: PLATFORM_ID }, { token: i1.ClrCommonStringsService }, { token: i2.WizardNavigationService }, { token: i3.PageCollectionService }, { token: i4.ButtonHubService }, { token: i5.HeaderActionService }, { token: i0.ElementRef }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Component });
ClrWizard.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: ClrWizard, selector: "clr-wizard", inputs: { stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"], size: ["clrWizardSize", "size"], inPage: ["clrWizardInPage", "inPage"], inPageFillContentArea: ["clrWizardInPageFillContentArea", "inPageFillContentArea"], closable: ["clrWizardClosable", "closable"], _stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"], forceForward: ["clrWizardForceForwardNavigation", "forceForward"], clrWizardOpen: "clrWizardOpen", stopNext: ["clrWizardPreventDefaultNext", "stopNext"], stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"], stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"], disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"] }, outputs: { _openChanged: "clrWizardOpenChange", onCancel: "clrWizardOnCancel", wizardFinished: "clrWizardOnFinish", onReset: "clrWizardOnReset", currentPageChanged: "clrWizardCurrentPageChanged", onMoveNext: "clrWizardOnNext", onMovePrevious: "clrWizardOnPrevious" }, host: { properties: { "class.clr-wizard": "true", "class.wizard-md": "size == 'md'", "class.wizard-lg": "size == 'lg'", "class.wizard-xl": "size == 'xl'", "class.wizard-in-page": "inPage", "class.wizard-in-page--fill-content-area": "inPage && inPageFillContentArea" } }, providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], queries: [{ propertyName: "wizardTitle", first: true, predicate: ClrWizardTitle, descendants: true }, { propertyName: "pages", predicate: ClrWizardPage, descendants: true }, { propertyName: "headerActions", predicate: ClrWizardHeaderAction }], viewQueries: [{ propertyName: "pageTitle", first: true, predicate: ["pageTitle"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }, { propertyName: "modal", first: true, predicate: ClrModal, descendants: true }, { propertyName: "title", first: true, predicate: ["title"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!--\n  Use two independent *ngIf with [ngTemplateOutlet] instead of *ngIf-then-else.\n  The Angular 17+ control-flow migration (run as part of `ng update`) inlines the\n  `then` template's content into the @if body when it sees `*ngIf=\"cond; then T\"`,\n  producing two copies of <ng-content select=\"...\"> in the same component template.\n  In Angular 21 the projection resolver picks the wrong slot and leaves the\n  projected children un-rendered. Keeping a single wizardTemplate definition and\n  rendering it via ngTemplateOutlet in both branches avoids the duplication and\n  keeps content projection working in v15\u2013v21.\n-->\n<ng-container *ngIf=\"inPage\" [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n\n<ng-container *ngIf=\"!inPage\">\n  <clr-modal\n    [clrModalOpen]=\"_open\"\n    [clrModalSize]=\"size\"\n    [clrModalClosable]=\"closable\"\n    [clrModalStaticBackdrop]=\"true\"\n    [clrModalSkipAnimation]=\"stopModalAnimations\"\n    [clrModalOverrideScrollService]=\"isInline\"\n    [clrModalPreventClose]=\"true\"\n    (clrModalAlternateClose)=\"modalCancel()\"\n    [clrModalLabelledById]=\"wizardId\"\n  >\n    <ng-template #clrInternalModalContentTemplate>\n      <ng-container [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n    </ng-template>\n  </clr-modal>\n</ng-container>\n\n<!-- This template is tightly coupled to the modal styles. -->\n<ng-template #wizardTemplate>\n  <div class=\"modal-content-wrapper\">\n    <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n      <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n        <ng-content select=\"clr-wizard-title\"></ng-content>\n      </div>\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"modal-content\">\n      <div class=\"modal-header--accessible\">\n        <div class=\"modal-title-wrapper\" #title cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"modal-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n          <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n            <ng-content select=\"clr-wizard-header-action\"></ng-content>\n          </div>\n          <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n          </div>\n        </div>\n        <button\n          *ngIf=\"closable && !inPage\"\n          type=\"button\"\n          class=\"close\"\n          [attr.aria-label]=\"commonStrings.keys.close\"\n          (click)=\"modalCancel()\"\n        >\n          <cds-icon shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      <div #body class=\"modal-body-wrapper\">\n        <div class=\"modal-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n      <div class=\"modal-footer clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n          </div>\n          <div *ngIf=\"navService.currentPage?.hasButtons\" class=\"clr-wizard-footer-buttons-wrapper\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i7.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "directive", type: i8.ClrModalBody, selector: ".modal-body" }, { kind: "directive", type: i9.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i10.ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: ["label"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrWizard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-wizard', providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], host: {
                        '[class.clr-wizard]': 'true',
                        '[class.wizard-md]': "size == 'md'",
                        '[class.wizard-lg]': "size == 'lg'",
                        '[class.wizard-xl]': "size == 'xl'",
                        '[class.wizard-in-page]': 'inPage',
                        '[class.wizard-in-page--fill-content-area]': 'inPage && inPageFillContentArea',
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!--\n  Use two independent *ngIf with [ngTemplateOutlet] instead of *ngIf-then-else.\n  The Angular 17+ control-flow migration (run as part of `ng update`) inlines the\n  `then` template's content into the @if body when it sees `*ngIf=\"cond; then T\"`,\n  producing two copies of <ng-content select=\"...\"> in the same component template.\n  In Angular 21 the projection resolver picks the wrong slot and leaves the\n  projected children un-rendered. Keeping a single wizardTemplate definition and\n  rendering it via ngTemplateOutlet in both branches avoids the duplication and\n  keeps content projection working in v15\u2013v21.\n-->\n<ng-container *ngIf=\"inPage\" [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n\n<ng-container *ngIf=\"!inPage\">\n  <clr-modal\n    [clrModalOpen]=\"_open\"\n    [clrModalSize]=\"size\"\n    [clrModalClosable]=\"closable\"\n    [clrModalStaticBackdrop]=\"true\"\n    [clrModalSkipAnimation]=\"stopModalAnimations\"\n    [clrModalOverrideScrollService]=\"isInline\"\n    [clrModalPreventClose]=\"true\"\n    (clrModalAlternateClose)=\"modalCancel()\"\n    [clrModalLabelledById]=\"wizardId\"\n  >\n    <ng-template #clrInternalModalContentTemplate>\n      <ng-container [ngTemplateOutlet]=\"wizardTemplate\"></ng-container>\n    </ng-template>\n  </clr-modal>\n</ng-container>\n\n<!-- This template is tightly coupled to the modal styles. -->\n<ng-template #wizardTemplate>\n  <div class=\"modal-content-wrapper\">\n    <div class=\"modal-nav clr-wizard-stepnav-wrapper\" role=\"region\">\n      <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n        <ng-content select=\"clr-wizard-title\"></ng-content>\n      </div>\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"modal-content\">\n      <div class=\"modal-header--accessible\">\n        <div class=\"modal-title-wrapper\" #title cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"modal-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"modal-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        <div class=\"modal-header-actions-wrapper\" *ngIf=\"headerActionService.displayHeaderActionsWrapper\">\n          <div *ngIf=\"headerActionService.showWizardHeaderActions\">\n            <ng-content select=\"clr-wizard-header-action\"></ng-content>\n          </div>\n          <div *ngIf=\"headerActionService.currentPageHasHeaderActions\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.headerActions\"></ng-template>\n          </div>\n        </div>\n        <button\n          *ngIf=\"closable && !inPage\"\n          type=\"button\"\n          class=\"close\"\n          [attr.aria-label]=\"commonStrings.keys.close\"\n          (click)=\"modalCancel()\"\n        >\n          <cds-icon shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      <div #body class=\"modal-body-wrapper\">\n        <div class=\"modal-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n      <div class=\"modal-footer clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            *ngIf=\"navService.currentPage && !navService.currentPage.hasButtons\"\n            class=\"clr-wizard-footer-buttons-wrapper\"\n          >\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n          </div>\n          <div *ngIf=\"navService.currentPage?.hasButtons\" class=\"clr-wizard-footer-buttons-wrapper\">\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</ng-template>\n" }]
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
            }], title: [{
                type: ViewChild,
                args: ['title']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvd2l6YXJkL3dpemFyZC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFFTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFHZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUVYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNoRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7O0FBZWhELE1BQU0sT0FBTyxTQUFTO0lBb0dwQixZQUMrQixVQUFlLEVBQ3JDLGFBQXNDLEVBQ3RDLFVBQW1DLEVBQ25DLGNBQXFDLEVBQ3JDLGFB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LDZCQUE2QjtnQkFPVixVQUFVO3NCQUFwQyxNQUFNO3VCQUFDLGlCQUFpQjtnQkFNTSxjQUFjO3NCQUE1QyxNQUFNO3VCQUFDLHFCQUFxQjtnQkFFTCxTQUFTO3NCQUFoQyxTQUFTO3VCQUFDLFdBQVc7Z0JBQ2lDLEtBQUs7c0JBQTNELGVBQWU7dUJBQUMsYUFBYSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFDYixhQUFhO3NCQUFwRCxlQUFlO3VCQUFDLHFCQUFxQjtnQkFLRSxXQUFXO3NCQUFsRCxZQUFZO3VCQUFDLGNBQWM7Z0JBQ1EsY0FBYztzQkFBakQsU0FBUzt1QkFBQyxNQUFNO2dCQVdxQixLQUFLO3NCQUExQyxTQUFTO3VCQUFDLFFBQVE7Z0JBd0JmLEtBQUs7c0JBRFIsU0FBUzt1QkFBQyxPQUFPO2dCQWVkLFlBQVk7c0JBRGYsS0FBSzt1QkFBQyxpQ0FBaUM7Z0JBY3BDLGFBQWE7c0JBRGhCLEtBQUs7dUJBQUMsZUFBZTtnQkFlbEIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLDZCQUE2QjtnQkFrQmhDLFVBQVU7c0JBRGIsS0FBSzt1QkFBQywrQkFBK0I7Z0JBa0JsQyxjQUFjO3NCQURqQixLQUFLO3VCQUFDLDRCQUE0QjtnQkFpQi9CLGNBQWM7c0JBRGpCLEtBQUs7dUJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyTW9kYWwgfSBmcm9tICcuLi9tb2RhbC9tb2RhbCc7XG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBCdXR0b25IdWJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvYnV0dG9uLWh1Yi5zZXJ2aWNlJztcbmltcG9ydCB7IEhlYWRlckFjdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9oZWFkZXItYWN0aW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IFBhZ2VDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UtY29sbGVjdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvd2l6YXJkLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBDbHJXaXphcmRIZWFkZXJBY3Rpb24gfSBmcm9tICcuL3dpemFyZC1oZWFkZXItYWN0aW9uJztcbmltcG9ydCB7IENscldpemFyZFBhZ2UgfSBmcm9tICcuL3dpemFyZC1wYWdlJztcbmltcG9ydCB7IENscldpemFyZFRpdGxlIH0gZnJvbSAnLi93aXphcmQtdGl0bGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItd2l6YXJkJyxcbiAgcHJvdmlkZXJzOiBbV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UsIFBhZ2VDb2xsZWN0aW9uU2VydmljZSwgQnV0dG9uSHViU2VydmljZSwgSGVhZGVyQWN0aW9uU2VydmljZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi93aXphcmQuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmNsci13aXphcmRdJzogJ3RydWUnLFxuICAgICdbY2xhc3Mud2l6YXJkLW1kXSc6IFwic2l6ZSA9PSAnbWQnXCIsXG4gICAgJ1tjbGFzcy53aXphcmQtbGddJzogXCJzaXplID09ICdsZydcIixcbiAgICAnW2NsYXNzLndpemFyZC14bF0nOiBcInNpemUgPT0gJ3hsJ1wiLFxuICAgICdbY2xhc3Mud2l6YXJkLWluLXBhZ2VdJzogJ2luUGFnZScsXG4gICAgJ1tjbGFzcy53aXphcmQtaW4tcGFnZS0tZmlsbC1jb250ZW50LWFyZWFdJzogJ2luUGFnZSAmJiBpblBhZ2VGaWxsQ29udGVudEFyZWEnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQsIERvQ2hlY2sge1xuICAvKipcbiAgICogU2V0IHRoZSBhcmlhLWxhYmVsIGZvciB0aGUgc3RlcG5hdiBzZWN0aW9uIG9mIHRoZSB3aXphcmQuIFNldCB1c2luZyBgW2NscldpemFyZFN0ZXBuYXZBcmlhTGFiZWxdYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkU3RlcG5hdkFyaWFMYWJlbCcpIHN0ZXBuYXZBcmlhTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy53aXphcmRTdGVwbmF2QXJpYUxhYmVsO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1vZGFsIHNpemUgb2YgdGhlIHdpemFyZC4gU2V0IHVzaW5nIGBbY2xyV2l6YXJkU2l6ZV1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRTaXplJykgc2l6ZSA9ICd4bCc7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBcImluIHBhZ2VcIiB3aXphcmQuIFNldCB1c2luZyBgW2NscldpemFyZEluUGFnZV1gIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRJblBhZ2UnKSBpblBhZ2UgPSBmYWxzZTtcblxuICAvKipcbiAgICogTWFrZSBhbiBcImluIHBhZ2VcIiB3aXphcmQgZmlsbCB0aGUgYC5jb250ZW50LWFyZWFgLiBTZXQgdXNpbmcgYFtjbHJXaXphcmRJblBhZ2VGaWxsQ29udGVudEFyZWFdYCBpbnB1dC5cbiAgICogSWYgeW91IGNhbid0IHVzZSB0aGlzIG9wdGlvbiwgeW91IHdpbGwgbGlrZWx5IG5lZWQgdG8gcHJvdmlkZSBjdXN0b20gQ1NTIHRvIHNldCB0aGUgd2l6YXJkJ3MgaGVpZ2h0IGFuZCBtYXJnaW5zLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRJblBhZ2VGaWxsQ29udGVudEFyZWEnKSBpblBhZ2VGaWxsQ29udGVudEFyZWEgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGVsbHMgdGhlIG1vZGFsIHBhcnQgb2YgdGhlIHdpemFyZCB3aGV0aGVyIGl0IHNob3VsZCBoYXZlIGEgY2xvc2UgXCJYXCJcbiAgICogaW4gdGhlIHRvcCByaWdodCBjb3JuZXIuIFNldCB1c2luZyBgW2NscldpemFyZENsb3NhYmxlXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZENsb3NhYmxlJykgY2xvc2FibGUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGNvbW11bmljYXRlIHRvIHRoZSB1bmRlcmx5aW5nIG1vZGFsIHRoYXQgYW5pbWF0aW9ucyBhcmUgbm90XG4gICAqIHdhbnRlZC4gUHJpbWFyeSB1c2UgaXMgZm9yIHRoZSBkaXNwbGF5IG9mIHN0YXRpYy9pbmxpbmUgd2l6YXJkcy5cbiAgICogU2V0IHVzaW5nIGBbY2xyV2l6YXJkUHJldmVudE1vZGFsQW5pbWF0aW9uXWAgaW5wdXQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnRNb2RhbEFuaW1hdGlvbicpIF9zdG9wTW9kYWxBbmltYXRpb25zID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBpcyBvcGVuZWQgb3IgY2xvc2VkLlxuICAgKiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT3BlbkNoYW5nZSlgIGV2ZW50LlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT3BlbkNoYW5nZScpIF9vcGVuQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgaXMgY2FuY2VsZWQuIExpc3RlbiB2aWEgYChjbHJXaXphcmRPbkNhbmNlbClgIGV2ZW50LlxuICAgKiBDYW4gYmUgY29tYmluZWQgd2l0aCB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbF1gIGlucHV0IHRvIGNyZWF0ZVxuICAgKiB3aXphcmQtbGV2ZWwgY3VzdG9tIGNhbmNlbCByb3V0aW5lcy5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uQ2FuY2VsJykgb25DYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgaXMgY29tcGxldGVkLiBMaXN0ZW4gdmlhIGAoY2xyV2l6YXJkT25GaW5pc2gpYCBldmVudC5cbiAgICogQ2FuIGJlIGNvbWJpbmVkIHdpdGggdGhlIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0XWAgaW5wdXQgdG8gY3JlYXRlXG4gICAqIHdpemFyZC1sZXZlbCBjdXN0b20gY29tcGxldGlvbiByb3V0aW5lcy5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uRmluaXNoJykgd2l6YXJkRmluaXNoZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgaXMgcmVzZXQuIExpc3RlbiB2aWEgYChjbHJXaXphcmRPblJlc2V0KWAgZXZlbnQuXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRPblJlc2V0Jykgb25SZXNldCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnQgcGFnZSBoYXMgY2hhbmdlZC4gTGlzdGVuIHZpYSBgKGNscldpemFyZEN1cnJlbnRQYWdlQ2hhbmdlZClgIGV2ZW50LlxuICAgKiBvdXRwdXQuIFVzZWZ1bCBmb3Igbm9uLWJsb2NraW5nIHZhbGlkYXRpb24uXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRDdXJyZW50UGFnZUNoYW5nZWQnKSBjdXJyZW50UGFnZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB3aXphcmQgbW92ZXMgdG8gdGhlIG5leHQgcGFnZS4gTGlzdGVuIHZpYSBgKGNscldpemFyZE9uTmV4dClgIGV2ZW50LlxuICAgKiBDYW4gYmUgY29tYmluZWQgd2l0aCB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYCBpbnB1dCB0byBjcmVhdGVcbiAgICogd2l6YXJkLWxldmVsIGN1c3RvbSBuYXZpZ2F0aW9uIHJvdXRpbmVzLCB3aGljaCBhcmUgdXNlZnVsIGZvciB2YWxpZGF0aW9uLlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkT25OZXh0Jykgb25Nb3ZlTmV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIHdpemFyZCBtb3ZlcyB0byB0aGUgcHJldmlvdXMgcGFnZS4gQ2FuIGJlIHVzZWZ1bCBmb3IgdmFsaWRhdGlvbi5cbiAgICogTGlzdGVuIHZpYSBgKGNscldpemFyZE9uUHJldmlvdXMpYCBldmVudC5cbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZE9uUHJldmlvdXMnKSBvbk1vdmVQcmV2aW91cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PihmYWxzZSk7XG5cbiAgQFZpZXdDaGlsZCgncGFnZVRpdGxlJykgcGFnZVRpdGxlOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQENvbnRlbnRDaGlsZHJlbihDbHJXaXphcmRQYWdlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIHBhZ2VzOiBRdWVyeUxpc3Q8Q2xyV2l6YXJkUGFnZT47XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyV2l6YXJkSGVhZGVyQWN0aW9uKSBoZWFkZXJBY3Rpb25zOiBRdWVyeUxpc3Q8Q2xyV2l6YXJkSGVhZGVyQWN0aW9uPjtcblxuICBfb3BlbiA9IGZhbHNlO1xuICB3aXphcmRJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyV2l6YXJkVGl0bGUpIHByb3RlY3RlZCB3aXphcmRUaXRsZTogQ2xyV2l6YXJkVGl0bGU7XG4gIEBWaWV3Q2hpbGQoJ2JvZHknKSBwcml2YXRlIHJlYWRvbmx5IGJvZHlFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIF90aXRsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIHByaXZhdGUgX2ZvcmNlRm9yd2FyZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wTmV4dCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdG9wQ2FuY2VsID0gZmFsc2U7XG4gIHByaXZhdGUgX3N0b3BOYXZpZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVTdGVwbmF2ID0gZmFsc2U7XG4gIHByaXZhdGUgZGlmZmVyOiBhbnk7IC8vIGZvciBtYXJraW5nIHdoZW4gdGhlIGNvbGxlY3Rpb24gb2Ygd2l6YXJkIHBhZ2VzIGhhcyBiZWVuIGFkZGVkIHRvIG9yIGRlbGV0ZWQgZnJvbVxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgQFZpZXdDaGlsZChDbHJNb2RhbCkgcHJpdmF0ZSByZWFkb25seSBtb2RhbDogQ2xyTW9kYWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHB1YmxpYyBuYXZTZXJ2aWNlOiBXaXphcmROYXZpZ2F0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgcGFnZUNvbGxlY3Rpb246IFBhZ2VDb2xsZWN0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgYnV0dG9uU2VydmljZTogQnV0dG9uSHViU2VydmljZSxcbiAgICBwdWJsaWMgaGVhZGVyQWN0aW9uU2VydmljZTogSGVhZGVyQWN0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVyc1xuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV4dFBhZ2VDaGFuZ2VzKCksXG4gICAgICB0aGlzLmxpc3RlbkZvclByZXZpb3VzUGFnZUNoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yQ2FuY2VsQ2hhbmdlcygpLFxuICAgICAgdGhpcy5saXN0ZW5Gb3JGaW5pc2hlZENoYW5nZXMoKSxcbiAgICAgIHRoaXMubGlzdGVuRm9yUGFnZUNoYW5nZXMoKVxuICAgICk7XG5cbiAgICB0aGlzLmRpZmZlciA9IGRpZmZlcnMuZmluZChbXSkuY3JlYXRlKG51bGwpO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgndGl0bGUnKVxuICBnZXQgdGl0bGUoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIHJldHVybiB0aGlzLl90aXRsZTtcbiAgfVxuICBzZXQgdGl0bGUodGl0bGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5fdGl0bGUgPSB0aXRsZTtcblxuICAgIHRoaXMubW9kYWwudGl0bGUgPSB0aXRsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgcGFnZSBjb21wbGV0ZWQgc3RhdGVzIHdoZW4gbmF2aWdhdGluZyBiYWNrd2FyZHMuXG4gICAqIFNldCB1c2luZyBgW2NscldpemFyZEZvcmNlRm9yd2FyZE5hdmlnYXRpb25dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkRm9yY2VGb3J3YXJkTmF2aWdhdGlvbicpXG4gIGdldCBmb3JjZUZvcndhcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvcmNlRm9yd2FyZDtcbiAgfVxuICBzZXQgZm9yY2VGb3J3YXJkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZm9yY2VGb3J3YXJkID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZm9yY2VGb3J3YXJkTmF2aWdhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgb3Blbi9jbG9zZSBvZiB0aGUgd2l6YXJkIGNvbXBvbmVudC5cbiAgICogU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZE9wZW5dYCBpbnB1dC5cbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkT3BlbicpXG4gIHNldCBjbHJXaXphcmRPcGVuKG9wZW46IGJvb2xlYW4pIHtcbiAgICBpZiAob3Blbikge1xuICAgICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvbnNSZWFkeSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuX29wZW4gPSBvcGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIENscldpemFyZCBmcm9tIG1vdmluZyB0byB0aGUgbmV4dCBwYWdlIG9yIGNsb3NpbmcgaXRzZWxmIG9uIGZpbmlzaGluZy5cbiAgICogU2V0IHVzaW5nIHRoZSBgW2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dF1gIGlucHV0LiBOb3RlIHRoYXQgdXNpbmcgc3RvcE5leHRcbiAgICogd2lsbCByZXF1aXJlIHlvdSB0byBjcmVhdGUgeW91ciBvd24gY2FsbHMgdG8gLm5leHQoKSBhbmQgLmZpbmlzaCgpIGluIHlvdXJcbiAgICogaG9zdCBjb21wb25lbnQgdG8gbWFrZSB0aGUgQ2xyV2l6YXJkIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnREZWZhdWx0TmV4dCcpXG4gIGdldCBzdG9wTmV4dCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcE5leHQ7XG4gIH1cbiAgc2V0IHN0b3BOZXh0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3RvcE5leHQgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmRIYXNBbHROZXh0ID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgQ2xyV2l6YXJkIGZyb20gY2xvc2luZyB3aGVuIHRoZSBjYW5jZWwgYnV0dG9uIG9yIGNsb3NlIFwiWFwiIGlzIGNsaWNrZWQuXG4gICAqIFNldCB1c2luZyB0aGUgYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbF1gIGlucHV0LlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdXNpbmcgc3RvcENhbmNlbCB3aWxsIHJlcXVpcmUgeW91IHRvIGNyZWF0ZSB5b3VyIG93biBjYWxscyB0byBgY2xvc2UoKWAgaW4geW91ciBob3N0IGNvbXBvbmVgbnRcbiAgICogdG8gbWFrZSB0aGUgQ2xyV2l6YXJkIHdvcmsgYXMgZXhwZWN0ZWQuIFVzZWZ1bCBmb3IgZG9pbmcgY2hlY2tzIG9yIHByb21wdHNcbiAgICogYmVmb3JlIGNsb3NpbmcgYSBDbHJXaXphcmQuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnREZWZhdWx0Q2FuY2VsJylcbiAgZ2V0IHN0b3BDYW5jZWwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BDYW5jZWw7XG4gIH1cbiAgc2V0IHN0b3BDYW5jZWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdG9wQ2FuY2VsID0gISF2YWx1ZTtcbiAgICB0aGlzLm5hdlNlcnZpY2Uud2l6YXJkSGFzQWx0Q2FuY2VsID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgQ2xyV2l6YXJkIGZyb20gcGVyZm9ybWluZyBhbnkgZm9ybSBvZiBuYXZpZ2F0aW9uIGF3YXkgZnJvbSB0aGUgY3VycmVudFxuICAgKiBwYWdlLiBTZXQgdXNpbmcgdGhlIGBbY2xyV2l6YXJkUHJldmVudE5hdmlnYXRpb25dYCBpbnB1dC5cbiAgICogTm90ZSB0aGF0IHN0b3BOYXZpZ2F0aW9uIGlzIG1lYW50IHRvIGZyZWV6ZSB0aGUgd2l6YXJkIGluIHBsYWNlLCB0eXBpY2FsbHlcbiAgICogZHVyaW5nIGEgbG9uZyB2YWxpZGF0aW9uIG9yIGJhY2tncm91bmQgYWN0aW9uIHdoZXJlIHlvdSB3YW50IHRoZSB3aXphcmQgdG9cbiAgICogZGlzcGxheSBsb2FkaW5nIGNvbnRlbnQgYnV0IG5vdCBhbGxvdyB0aGUgdXNlciB0byBleGVjdXRlIG5hdmlnYXRpb24gaW5cbiAgICogdGhlIHN0ZXBuYXYsIGNsb3NlIFgsIG9yIHRoZSAgYmFjaywgZmluaXNoLCBvciBuZXh0IGJ1dHRvbnMuXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFByZXZlbnROYXZpZ2F0aW9uJylcbiAgZ2V0IHN0b3BOYXZpZ2F0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wTmF2aWdhdGlvbjtcbiAgfVxuICBzZXQgc3RvcE5hdmlnYXRpb24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zdG9wTmF2aWdhdGlvbiA9ICEhdmFsdWU7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLndpemFyZFN0b3BOYXZpZ2F0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUHJldmVudHMgY2xpY2tzIG9uIHRoZSBsaW5rcyBpbiB0aGUgc3RlcG5hdiBmcm9tIHdvcmtpbmcuXG4gICAqIFNldCB1c2luZyBgW2NscldpemFyZERpc2FibGVTdGVwbmF2XWAgaW5wdXQuXG4gICAqIEEgbW9yZSBncmFudWxhciBieXBhc3Npbmcgb2YgbmF2aWdhdGlvbiB3aGljaCBjYW4gYmUgdXNlZnVsIHdoZW4geW91clxuICAgKiBDbHJXaXphcmQgaXMgaW4gYSBzdGF0ZSBvZiBjb21wbGV0aW9uIGFuZCB5b3UgZG9uJ3Qgd2FudCB1c2VycyB0byBiZVxuICAgKiBhYmxlIHRvIGp1bXAgYmFja3dhcmRzIGFuZCBjaGFuZ2UgdGhpbmdzLlxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmREaXNhYmxlU3RlcG5hdicpXG4gIGdldCBkaXNhYmxlU3RlcG5hdigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVN0ZXBuYXY7XG4gIH1cbiAgc2V0IGRpc2FibGVTdGVwbmF2KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZVN0ZXBuYXYgPSAhIXZhbHVlO1xuICAgIHRoaXMubmF2U2VydmljZS53aXphcmREaXNhYmxlU3RlcG5hdiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQYWdlKCk6IENscldpemFyZFBhZ2Uge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2U7XG4gIH1cbiAgc2V0IGN1cnJlbnRQYWdlKHBhZ2U6IENscldpemFyZFBhZ2UpIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZ29UbyhwYWdlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBpc0xhc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZUlzTGFzdDtcbiAgfVxuXG4gIGdldCBpc0ZpcnN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UuY3VycmVudFBhZ2VJc0ZpcnN0O1xuICB9XG5cbiAgZ2V0IGlzSW5saW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsci13aXphcmQtLWlubGluZScpO1xuICB9XG5cbiAgZ2V0IHN0b3BNb2RhbEFuaW1hdGlvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3BNb2RhbEFuaW1hdGlvbnM7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYWdlQ29sbGVjdGlvbi5wYWdlcyA9IHRoaXMucGFnZXM7XG4gICAgdGhpcy5oZWFkZXJBY3Rpb25TZXJ2aWNlLndpemFyZEhlYWRlckFjdGlvbnMgPSB0aGlzLmhlYWRlckFjdGlvbnM7XG5cbiAgICBpZiAodGhpcy5pblBhZ2UpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZUJ1dHRvbnMoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZU5hdk9uUGFnZUNoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHMgPT4gcy51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyBXaXphcmQgYXMgZmluaXNoZWQuIEJ5IGRlZmF1bHQgaXQgZG9lcyBub3QgZXhlY3V0ZSBldmVudFxuICAgKiBlbWlzc2lvbnMgb3IgY2hlY2tzIGJlZm9yZSBjb21wbGV0aW5nIGFuZCBjbG9zaW5nLiBUaGlzIG1ldGhvZCBpcyBjb21tb25seVxuICAgKiB1c2VkIGFzIHBhcnQgb2YgYW4gYWx0ZXJuYXRpdmUgbmF2aWdhdGlvbiB3aXRoIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0XWAuXG4gICAqXG4gICAqIElmIGBza2lwQ2hlY2tzQW5kRW1pdHNgIGlzIHRydWUsIHRoZSB3aXphcmQgd2lsbCBjb21wbGV0ZSBhbmQgY2xvc2VcbiAgICogcmVnYXJkbGVzcyBvZiB0aGUgc3RhdGUgb2YgaXRzIGN1cnJlbnQgcGFnZS4gVGhpcyBpcyB1c2VmdWwgZm9yIGFsdGVybmF0aXZlXG4gICAqIG5hdmlnYXRpb24gd2hlcmUgZXZlbnQgZW1pc3Npb25zIGhhdmUgYWxyZWFkeSBiZWVuIGRvbmUgYW5kIGZpcmluZyB0aGVtIGFnYWluXG4gICAqIG1heSBjYXVzZSBhbiBldmVudCBsb29wLlxuICAgKi9cbiAgZmluaXNoKHNraXBDaGVja3NBbmRFbWl0cyA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAoc2tpcENoZWNrc0FuZEVtaXRzKSB7XG4gICAgICB0aGlzLmZvcmNlRmluaXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF2U2VydmljZS5maW5pc2goKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIHdpemFyZCBhcyBmaW5pc2hlZCBidXQgZG9lcyBydW4gY2hlY2tzIGFuZCBlbWlzc2lvbnMuXG4gICAqIEdvb2QgZm9yIGEgbGFzdCBzdGVwIGluIGFuIGFsdGVybmF0ZSB3b3JrZmxvdy4gRG9lcyB0aGUgc2FtZSB0aGluZyBhc1xuICAgKiBjYWxsaW5nIGBDbHJXaXphcmQuZmluaXNoKHRydWUpYCBvciBgQ2xyV2l6YXJkLmZpbmlzaCgpYCB3aXRob3V0IGEgcGFyYW1ldGVyLlxuICAgKi9cbiAgZm9yY2VGaW5pc2goKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RvcE5hdmlnYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIHdpemFyZC4gSWYgdGhlcmUgaXMgbm8gY3VycmVudCBwYWdlIGRlZmluZWQsIHNldHMgdGhlIGZpcnN0IHBhZ2UgaW4gdGhlIHdpemFyZCB0byBiZSBjdXJyZW50LlxuICAgKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLl9vcGVuID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5jdXJyZW50UGFnZSkge1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLnNldEZpcnN0UGFnZUN1cnJlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJlbmRlciBidXR0b25zIHdoZW4gd2l6YXJkIGlzIG9wZW5lZCwgdG8gYXZvaWQgY2hvY29sYXRlIGVycm9yc1xuICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkgPSB0cnVlO1xuXG4gICAgdGhpcy5fb3BlbkNoYW5nZWQuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHdpemFyZC4gQ2FsbCB0aGlzIGRpcmVjdGx5IGluc3RlYWQgb2YgYGNhbmNlbCgpYCB0byBpbXBsZW1lbnQgYWx0ZXJuYXRpdmUgY2FuY2VsIGZ1bmN0aW9uYWxpdHkuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICB0aGlzLl9vcGVuQ2hhbmdlZC5lbWl0KGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIG9wZW4gYW5kIGNsb3NlIHRoZSB3aXphcmQuIEJ5IGRlZmF1bHQgdGhlIHdpemFyZCB3aWxsXG4gICAqIGNsb3NlIGlmIGludm9rZWQgd2l0aCBubyBwYXJhbWV0ZXIuIElmIHBhcmFtZXRlciBpcyB0cnVlIHdpemFyZCB3aWxsIG9wZW5cbiAgICogZWxzZSBpZiBmYWxzZSB3aWxsIGNsb3NlLlxuICAgKi9cbiAgdG9nZ2xlKG9wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAob3Blbikge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHdpemFyZCB0byB0aGUgcHJldmlvdXMgcGFnZS5cbiAgICovXG4gIHByZXZpb3VzKCk6IHZvaWQge1xuICAgIHRoaXMubmF2U2VydmljZS5wcmV2aW91cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIGBuZXh0KClgIGRvZXMgbm90IGV4ZWN1dGUgZXZlbnQgZW1pc3Npb25zLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjb21tb25seSBjYWxsZWQgYXMgcGFydCBvZiBhbiBhbHRlcm5hdGl2ZSBuYXZpZ2F0aW9uXG4gICAqIHdpdGggYFtjbHJXaXphcmRQcmV2ZW50RGVmYXVsdE5leHRdYC4gVGhlIHdpemFyZCB3aWxsIG1vdmUgdG8gdGhlIG5leHQgcGFnZVxuICAgKiByZWdhcmRsZXNzIG9mIHRoZSBzdGF0ZSBvZiBpdHMgY3VycmVudCBwYWdlLiBUaGlzIGlzIHVzZWZ1bCBmb3IgYWx0ZXJuYXRpdmVcbiAgICogbmF2aWdhdGlvbiB3aGVyZSBldmVudCBlbWlzc2lvbnMgaGF2ZSBhbHJlYWR5IGJlZW4gZG9uZSBhbmQgZmlyaW5nIHRoZW0gYWdhaW5cbiAgICogbWF5IGNhdXNlIGFuIGV2ZW50IGxvb3AuXG4gICAqXG4gICAqIElmIGBza2lwQ2hlY2tzQW5kRW1pdHNgIGlzIGZhbHNlLCB0aGUgd2l6YXJkIHdpbGwgZXhlY3V0ZSBkZWZhdWx0IGNoZWNrc1xuICAgKiBhbmQgZW1pdCBldmVudHMgYXMgbm9ybWFsLiBUaGlzIGlzIHVzZWZ1bCBmb3IgY3VzdG9tIGJ1dHRvbnMgb3IgcHJvZ3JhbW1hdGljXG4gICAqIHdvcmtmbG93cyB0aGF0IGFyZSBub3QgZXhlY3V0aW5nIHRoZSB3aXphcmRzIGRlZmF1bHQgY2hlY2tzIGFuZCBlbWlzc2lvbnMuXG4gICAqIEl0IGlzIGFub3RoZXIgd2F5IHRvIG5hdmlnYXRlIHdpdGhvdXQgaGF2aW5nIHRvIHJld3JpdGUgdGhlIHdpemFyZOKAmXMgZGVmYXVsdFxuICAgKiBmdW5jdGlvbmFsaXR5IGZyb20gc2NyYXRjaC5cbiAgICovXG4gIG5leHQoc2tpcENoZWNrc0FuZEVtaXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChza2lwQ2hlY2tzQW5kRW1pdHMpIHtcbiAgICAgIHRoaXMuZm9yY2VOZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF2U2VydmljZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB3aXphcmQgdG8gdGhlIG5leHQgcGFnZSB3aXRob3V0IHRoZSBjaGVja3MgYW5kIGVtaXNzaW9ucy5cbiAgICogR29vZCBmb3IgYSBsYXN0IHN0ZXAgaW4gYW4gYWx0ZXJuYXRlIHdvcmtmbG93LlxuICAgKiBBbGlhcyBmb3IgYENscldpemFyZC5uZXh0KHRydWUpYCBvciBgQ2xyV2l6YXJkLm5leHQoKWBcbiAgICovXG4gIGZvcmNlTmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuZm9yY2VOZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhbmQgY2xvc2VzIHRoZSB3aXphcmQuIERvIG5vdCB1c2UgdGhpcyBmb3IgYW4gb3ZlcnJpZGUgb2YgdGhlIGNhbmNlbFxuICAgKiB0aGUgZnVuY3Rpb25hbGl0eSB3aXRoIGBbY2xyV2l6YXJkUHJldmVudERlZmF1bHRDYW5jZWxdYCwgYFtjbHJXaXphcmRQcmV2ZW50UGFnZURlZmF1bHRDYW5jZWxdYCxcbiAgICogb3IgYFtjbHJXaXphcmRQYWdlUHJldmVudERlZmF1bHRdYCBiZWNhdXNlIGl0IHdpbGwgaW5pdGlhdGUgdGhlIHNhbWUgY2hlY2tzXG4gICAqIGFuZCBldmVudCBlbWlzc2lvbnMgdGhhdCBpbnZva2VkIHlvdXIgZXZlbnQgaGFuZGxlci4gVXNlIGBDbHJXaXphcmQuY2xvc2UoKWAgaW5zdGVhZC5cbiAgICovXG4gIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLm5hdlNlcnZpY2UuY2FuY2VsKCk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGJlaGF2aW9yIG9mIHRoZSB1bmRlcmx5aW5nIG1vZGFsIHRvIGF2b2lkIGNvbGxpc2lvbnMgd2l0aFxuICAgKiBhbHRlcm5hdGl2ZSBjYW5jZWwgZnVuY3Rpb25hbGl0eS4gSW4gbW9zdCBjYXNlcywgdXNlIGBDbHJXaXphcmQuY2FuY2VsKClgIGluc3RlYWQuXG4gICAqL1xuICBtb2RhbENhbmNlbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zYWJsZSkge1xuICAgICAgdGhpcy5jaGVja0FuZENhbmNlbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGFsdGVybmF0aXZlIGNhbmNlbCBmbG93cyBkZWZpbmVkIGF0IHRoZSBjdXJyZW50IHBhZ2Ugb3JcbiAgICogd2l6YXJkIGxldmVsLiBQZXJmb3JtcyBhIGNhbmNlbGVkIGlmIG5vdC4gRW1pdHMgZXZlbnRzIHRoYXQgaW5pdGlhdGVcbiAgICogdGhlIGFsdGVybmF0aXZlIGNhbmNlbCBvdXRwdXRzIGAoY2xyV2l6YXJkUGFnZU9uQ2FuY2VsKWAgYW5kIGAoY2xyV2l6YXJkT25DYW5jZWwpYC5cbiAgICovXG4gIGNoZWNrQW5kQ2FuY2VsKCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcbiAgICBjb25zdCBjdXJyZW50UGFnZUhhc092ZXJyaWRlcyA9IGN1cnJlbnRQYWdlLnN0b3BDYW5jZWwgfHwgY3VycmVudFBhZ2UucHJldmVudERlZmF1bHQ7XG5cbiAgICBpZiAodGhpcy5zdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnJlbnRQYWdlLnBhZ2VPbkNhbmNlbC5lbWl0KCk7XG4gICAgaWYgKCFjdXJyZW50UGFnZUhhc092ZXJyaWRlcykge1xuICAgICAgdGhpcy5vbkNhbmNlbC5lbWl0KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0b3BDYW5jZWwgJiYgIWN1cnJlbnRQYWdlSGFzT3ZlcnJpZGVzKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byBhIGdpdmVuIHBhZ2UgaW4gdGhlIFdpemFyZC4gTmF2aWdhdGlvbiB3aWxsIGludm9rZSB0aGUgd2l6YXJk4oCZcyBkZWZhdWx0XG4gICAqIGNoZWNrcyBhbmQgZXZlbnQgZW1pc3Npb25zLlxuICAgKlxuICAgKiBUaGUgZm9ybWF0IG9mIHRoZSBleHBlY3RlZCBJRCBwYXJhbWV0ZXIgY2FuIGJlIGZvdW5kIGluIHRoZSByZXR1cm4gb2YgdGhlXG4gICAqIENscldpemFyZFBhZ2UuaWQgZ2V0dGVyLCB1c3VhbGx5IHByZWZpeGVkIHdpdGggYGNsci13aXphcmQtcGFnZS1gIGFuZCB0aGVuIGVpdGhlciBhXG4gICAqIG51bWVyaWMgSUQgb3IgdGhlIElEIHNwZWNpZmllZCBmb3IgdGhlIGBDbHJXaXphcmRQYWdlYCBjb21wb25lbnTigJlzIGBpZGAgaW5wdXQuXG4gICAqL1xuICBnb1RvKHBhZ2VJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFwYWdlSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uYXZTZXJ2aWNlLmdvVG8ocGFnZUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBzZXRzIGFsbCBXaXphcmRQYWdlcyB0byBpbmNvbXBsZXRlIGFuZCBzZXRzIHRoZSBmaXJzdCBwYWdlIGluIHRoZSBgQ2xyV2l6YXJkYCB0b1xuICAgKiBiZSB0aGUgY3VycmVudCBwYWdlLCByZXNldHRpbmcgdGhlIHdpemFyZCBuYXZpZ2F0aW9uLlxuICAgKiBVc2UgYChjbHJXaXphcmRPblJlc2V0KWAgZXZlbnQgdG8gcmVzZXQgdGhlIGRhdGEgb3IgbW9kZWwgb2YgeW91ciB3aXphcmQuXG4gICAqL1xuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLnJlc2V0KCk7XG4gICAgdGhpcy5vblJlc2V0LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yTmV4dFBhZ2VDaGFuZ2VzKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5tb3ZlZFRvTmV4dFBhZ2UucGlwZShmaWx0ZXIoKCkgPT4gaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm9uTW92ZU5leHQuZW1pdCgpO1xuICAgICAgdGhpcy5wYWdlVGl0bGU/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yUHJldmlvdXNQYWdlQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2UubW92ZWRUb1ByZXZpb3VzUGFnZS5waXBlKGZpbHRlcigoKSA9PiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMub25Nb3ZlUHJldmlvdXMuZW1pdCgpO1xuICAgICAgdGhpcy5wYWdlVGl0bGU/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yQ2FuY2VsQ2hhbmdlcygpOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzLm5hdlNlcnZpY2Uubm90aWZ5V2l6YXJkQ2FuY2VsLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNoZWNrQW5kQ2FuY2VsKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JGaW5pc2hlZENoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLndpemFyZEZpbmlzaGVkLnN1YnNjcmliZSgoKSA9PiB0aGlzLmVtaXRXaXphcmRGaW5pc2hlZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yUGFnZUNoYW5nZXMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gQWRkZWQgdG8gYWRkcmVzcyBWUEFULTc0OTpcbiAgICAgIC8vICAgV2hlbiBjbGlja2luZyBvbiBhIHdpemFyZCB0YWIsIGZvY3VzIHNob3VsZCBtb3ZlIHRvIHRoYXRcbiAgICAgIC8vICAgdGFicyBjb250ZW50IHRvIG1ha2UgdGhlIHdpemFyZCBtb3JlIGFjY2Vzc2libGUuXG4gICAgICB0aGlzLnBhZ2VUaXRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5jdXJyZW50UGFnZUNoYW5nZWQuZW1pdCgpO1xuXG4gICAgICAvLyBzY3JvbGwgdG8gdG9wIG9mIHBhZ2UgaW4gY2FzZSB0aGVyZSBpcyBsb25nIHBhZ2UgY29udGVudFxuICAgICAgdGhpcy5ib2R5RWxlbWVudFJlZj8ubmF0aXZlRWxlbWVudC5zY3JvbGxUbygwLCAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTmF2T25QYWdlQ2hhbmdlcygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5kaWZmZXIuZGlmZih0aGlzLnBhZ2VzKTtcbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgY2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKCgpID0+IHRoaXMubmF2U2VydmljZS51cGRhdGVOYXZpZ2F0aW9uKCkpO1xuICAgICAgY2hhbmdlcy5mb3JFYWNoUmVtb3ZlZEl0ZW0oKCkgPT4gdGhpcy5uYXZTZXJ2aWNlLnVwZGF0ZU5hdmlnYXRpb24oKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplQnV0dG9ucygpOiB2b2lkIHtcbiAgICAvLyBPbmx5IHRyaWdnZXIgYnV0dG9ucyByZWFkeSBpZiBkZWZhdWx0IGlzIG9wZW4gKGlubGluZWQpXG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25zUmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdFdpemFyZEZpbmlzaGVkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdG9wTmV4dCkge1xuICAgICAgdGhpcy5mb3JjZUZpbmlzaCgpO1xuICAgIH1cbiAgICB0aGlzLndpemFyZEZpbmlzaGVkLmVtaXQoKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjwhLS1cbiAgVXNlIHR3byBpbmRlcGVuZGVudCAqbmdJZiB3aXRoIFtuZ1RlbXBsYXRlT3V0bGV0XSBpbnN0ZWFkIG9mICpuZ0lmLXRoZW4tZWxzZS5cbiAgVGhlIEFuZ3VsYXIgMTcrIGNvbnRyb2wtZmxvdyBtaWdyYXRpb24gKHJ1biBhcyBwYXJ0IG9mIGBuZyB1cGRhdGVgKSBpbmxpbmVzIHRoZVxuICBgdGhlbmAgdGVtcGxhdGUncyBjb250ZW50IGludG8gdGhlIEBpZiBib2R5IHdoZW4gaXQgc2VlcyBgKm5nSWY9XCJjb25kOyB0aGVuIFRcImAsXG4gIHByb2R1Y2luZyB0d28gY29waWVzIG9mIDxuZy1jb250ZW50IHNlbGVjdD1cIi4uLlwiPiBpbiB0aGUgc2FtZSBjb21wb25lbnQgdGVtcGxhdGUuXG4gIEluIEFuZ3VsYXIgMjEgdGhlIHByb2plY3Rpb24gcmVzb2x2ZXIgcGlja3MgdGhlIHdyb25nIHNsb3QgYW5kIGxlYXZlcyB0aGVcbiAgcHJvamVjdGVkIGNoaWxkcmVuIHVuLXJlbmRlcmVkLiBLZWVwaW5nIGEgc2luZ2xlIHdpemFyZFRlbXBsYXRlIGRlZmluaXRpb24gYW5kXG4gIHJlbmRlcmluZyBpdCB2aWEgbmdUZW1wbGF0ZU91dGxldCBpbiBib3RoIGJyYW5jaGVzIGF2b2lkcyB0aGUgZHVwbGljYXRpb24gYW5kXG4gIGtlZXBzIGNvbnRlbnQgcHJvamVjdGlvbiB3b3JraW5nIGluIHYxNeKAk3YyMS5cbi0tPlxuPG5nLWNvbnRhaW5lciAqbmdJZj1cImluUGFnZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndpemFyZFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG5cbjxuZy1jb250YWluZXIgKm5nSWY9XCIhaW5QYWdlXCI+XG4gIDxjbHItbW9kYWxcbiAgICBbY2xyTW9kYWxPcGVuXT1cIl9vcGVuXCJcbiAgICBbY2xyTW9kYWxTaXplXT1cInNpemVcIlxuICAgIFtjbHJNb2RhbENsb3NhYmxlXT1cImNsb3NhYmxlXCJcbiAgICBbY2xyTW9kYWxTdGF0aWNCYWNrZHJvcF09XCJ0cnVlXCJcbiAgICBbY2xyTW9kYWxTa2lwQW5pbWF0aW9uXT1cInN0b3BNb2RhbEFuaW1hdGlvbnNcIlxuICAgIFtjbHJNb2RhbE92ZXJyaWRlU2Nyb2xsU2VydmljZV09XCJpc0lubGluZVwiXG4gICAgW2Nsck1vZGFsUHJldmVudENsb3NlXT1cInRydWVcIlxuICAgIChjbHJNb2RhbEFsdGVybmF0ZUNsb3NlKT1cIm1vZGFsQ2FuY2VsKClcIlxuICAgIFtjbHJNb2RhbExhYmVsbGVkQnlJZF09XCJ3aXphcmRJZFwiXG4gID5cbiAgICA8bmctdGVtcGxhdGUgI2NsckludGVybmFsTW9kYWxDb250ZW50VGVtcGxhdGU+XG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIndpemFyZFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9jbHItbW9kYWw+XG48L25nLWNvbnRhaW5lcj5cblxuPCEtLSBUaGlzIHRlbXBsYXRlIGlzIHRpZ2h0bHkgY291cGxlZCB0byB0aGUgbW9kYWwgc3R5bGVzLiAtLT5cbjxuZy10ZW1wbGF0ZSAjd2l6YXJkVGVtcGxhdGU+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50LXdyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtbmF2IGNsci13aXphcmQtc3RlcG5hdi13cmFwcGVyXCIgcm9sZT1cInJlZ2lvblwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNsci13aXphcmQtdGl0bGVcIiBbaWRdPVwid2l6YXJkSWRcIiByb2xlPVwiaGVhZGluZ1wiIFthdHRyLmFyaWEtbGV2ZWxdPVwid2l6YXJkVGl0bGU/LmhlYWRpbmdMZXZlbCB8fCAxXCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci13aXphcmQtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxjbHItd2l6YXJkLXN0ZXBuYXYgW2xhYmVsXT1cInN0ZXBuYXZBcmlhTGFiZWxcIj48L2Nsci13aXphcmQtc3RlcG5hdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyLS1hY2Nlc3NpYmxlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC10aXRsZS13cmFwcGVyXCIgI3RpdGxlIGNka0ZvY3VzSW5pdGlhbCB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJtb2RhbC10aXRsZVwiXG4gICAgICAgICAgICByb2xlPVwiaGVhZGluZ1wiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxldmVsXT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2U/LnBhZ2VUaXRsZT8uaGVhZGluZ0xldmVsIHx8IDJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIHRhYmluZGV4PVwiLTFcIiAjcGFnZVRpdGxlIGNsYXNzPVwibW9kYWwtdGl0bGUtdGV4dFwiPlxuICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZVRpdGxlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXItYWN0aW9ucy13cmFwcGVyXCIgKm5nSWY9XCJoZWFkZXJBY3Rpb25TZXJ2aWNlLmRpc3BsYXlIZWFkZXJBY3Rpb25zV3JhcHBlclwiPlxuICAgICAgICAgIDxkaXYgKm5nSWY9XCJoZWFkZXJBY3Rpb25TZXJ2aWNlLnNob3dXaXphcmRIZWFkZXJBY3Rpb25zXCI+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItd2l6YXJkLWhlYWRlci1hY3Rpb25cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cImhlYWRlckFjdGlvblNlcnZpY2UuY3VycmVudFBhZ2VIYXNIZWFkZXJBY3Rpb25zXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibmF2U2VydmljZS5jdXJyZW50UGFnZS5oZWFkZXJBY3Rpb25zXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAqbmdJZj1cImNsb3NhYmxlICYmICFpblBhZ2VcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwiY2xvc2VcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlXCJcbiAgICAgICAgICAoY2xpY2spPVwibW9kYWxDYW5jZWwoKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ3aW5kb3ctY2xvc2VcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAjYm9keSBjbGFzcz1cIm1vZGFsLWJvZHktd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxuICAgICAgICAgIDxtYWluIGNsci13aXphcmQtcGFnZXMtd3JhcHBlciBjbGFzcz1cImNsci13aXphcmQtY29udGVudFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgIDwvbWFpbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXIgY2xyLXdpemFyZC1mb290ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNsci13aXphcmQtZm9vdGVyLWJ1dHRvbnNcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAqbmdJZj1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UgJiYgIW5hdlNlcnZpY2UuY3VycmVudFBhZ2UuaGFzQnV0dG9uc1wiXG4gICAgICAgICAgICBjbGFzcz1cImNsci13aXphcmQtZm9vdGVyLWJ1dHRvbnMtd3JhcHBlclwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLXdpemFyZC1idXR0b25cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2U/Lmhhc0J1dHRvbnNcIiBjbGFzcz1cImNsci13aXphcmQtZm9vdGVyLWJ1dHRvbnMtd3JhcHBlclwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm5hdlNlcnZpY2UuY3VycmVudFBhZ2UuYnV0dG9uc1wiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==