import * as i6 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Output, Input, Component, Directive, ContentChild, ViewChildren, PLATFORM_ID, ViewChild, ContentChildren, Inject, NgModule } from '@angular/core';
import * as i3 from '@clr/angular/utils';
import { uniqueIdFactory } from '@clr/angular/utils';
import { filter } from 'rxjs/operators';
import { Subject, startWith, debounceTime, tap } from 'rxjs';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, errorStandardIcon, successStandardIcon, ClrIcon } from '@clr/angular/icon';
import * as i8 from '@clr/angular/modal';
import { ClrModalModule } from '@clr/angular/modal';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrWizardFooterAlign;
(function (ClrWizardFooterAlign) {
    ClrWizardFooterAlign["START"] = "start";
    ClrWizardFooterAlign["END"] = "end";
})(ClrWizardFooterAlign || (ClrWizardFooterAlign = {}));
const CLR_WIZARD_FOOTER_ALIGN_VALUES = new Set(Object.values(ClrWizardFooterAlign));
function footerAlignAttribute(value) {
    if (CLR_WIZARD_FOOTER_ALIGN_VALUES.has(value)) {
        return value;
    }
    throw new Error(`Invalid ClrWizardFooterAlign: "${value}". Expected one of: ${[...CLR_WIZARD_FOOTER_ALIGN_VALUES].join(', ')}`);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrWizardStepnavLayout;
(function (ClrWizardStepnavLayout) {
    ClrWizardStepnavLayout["VERTICAL"] = "vertical";
    ClrWizardStepnavLayout["HORIZONTAL"] = "horizontal";
})(ClrWizardStepnavLayout || (ClrWizardStepnavLayout = {}));
const CLR_WIZARD_STEPNAV_LAYOUT_VALUES = new Set(Object.values(ClrWizardStepnavLayout));
function stepnavLayoutAttribute(value) {
    if (CLR_WIZARD_STEPNAV_LAYOUT_VALUES.has(value)) {
        return value;
    }
    throw new Error(`Invalid ClrWizardStepnavLayout: "${value}". Expected one of: ${[...CLR_WIZARD_STEPNAV_LAYOUT_VALUES].join(', ')}`);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ButtonHubService {
    constructor() {
        this.buttonsReady = false;
        this._previousBtnClicked = new Subject();
        this._nextBtnClicked = new Subject();
        this._dangerBtnClicked = new Subject();
        this._cancelBtnClicked = new Subject();
        this._finishBtnClicked = new Subject();
        this._customBtnClicked = new Subject();
    }
    get previousBtnClicked() {
        return this._previousBtnClicked.asObservable();
    }
    get nextBtnClicked() {
        return this._nextBtnClicked.asObservable();
    }
    get dangerBtnClicked() {
        return this._dangerBtnClicked.asObservable();
    }
    get cancelBtnClicked() {
        return this._cancelBtnClicked.asObservable();
    }
    get finishBtnClicked() {
        return this._finishBtnClicked.asObservable();
    }
    get customBtnClicked() {
        return this._customBtnClicked.asObservable();
    }
    buttonClicked(buttonType) {
        if ('previous' === buttonType) {
            this._previousBtnClicked.next();
        }
        else if ('next' === buttonType) {
            this._nextBtnClicked.next();
        }
        else if ('finish' === buttonType) {
            this._finishBtnClicked.next();
        }
        else if ('danger' === buttonType) {
            this._dangerBtnClicked.next();
        }
        else if ('cancel' === buttonType) {
            this._cancelBtnClicked.next();
        }
        else {
            this._customBtnClicked.next(buttonType);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonHubService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonHubService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonHubService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * PageCollectionService manages the collection of pages assigned to the wizard and offers
 * a number of functions useful across the wizards providers and subcomponents -- all related
 * to essentially lookups on the collection of pages.
 *
 * The easiest way to access PageCollectionService is via the wizard. The
 * following example would allow you to access your instance of the wizard from your host
 * component and thereby access the page collection via YourHostComponent.wizard.pageCollection.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 * The heart of the page collection is the query list of pages, which it is assigned as a
 * reference to the Wizard.pages QueryList when the wizard is created.
 *
 */
class PageCollectionService {
    constructor() {
        /**
         *
         * @memberof PageCollectionService
         */
        this._pagesReset = new Subject();
    }
    /**
     * Converts the PageCollectionService.pages QueryList to an array and returns it.
     *
     * Useful for many instances when you would prefer a QueryList to act like an array.
     *
     * @memberof PageCollectionService
     */
    get pagesAsArray() {
        return this.pages ? this.pages.toArray() : [];
    }
    /**
     * Returns the length of the pages query list.
     *
     * @memberof PageCollectionService
     */
    get pagesCount() {
        return this.pages ? this.pages.length : 0;
    }
    /**
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get penultimatePage() {
        const pageCount = this.pagesCount;
        if (pageCount < 2) {
            return null;
        }
        return this.pagesAsArray[pageCount - 2];
    }
    /**
     * Returns the last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get lastPage() {
        const pageCount = this.pagesCount;
        if (pageCount < 1) {
            return null;
        }
        return this.pagesAsArray[pageCount - 1];
    }
    /**
     * Returns the first page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get firstPage() {
        if (!this.pagesCount) {
            return null;
        }
        return this.pagesAsArray[0];
    }
    /**
     * An observable that the navigation service listens to in order to know when
     * the page collection completed states have been reset to false so that way it
     * can also reset the navigation to make the first page in the page collection
     * current/active.
     *
     * @memberof PageCollectionService
     */
    get pagesReset() {
        return this._pagesReset.asObservable();
    }
    /**
     * Used mostly internally, but accepts a string ID and returns a ClrWizardPage
     * object that matches the ID passed. Note that IDs here should include the prefix
     * "clr-wizard-page-".
     *
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    getPageById(id) {
        const foundPages = this.pages.filter((page) => id === page.id);
        return this.checkResults(foundPages, id);
    }
    /**
     * Accepts s number as a parameter and treats that number as the index of the page
     * you're looking for in the collection of pages. Returns a  wizard page object.
     *
     * @memberof PageCollectionService
     */
    getPageByIndex(index) {
        const pageCount = this.pagesCount;
        const pagesLastIndex = pageCount > 1 ? pageCount - 1 : 0;
        if (index < 0) {
            throw new Error('Cannot retrieve page with index of ' + index);
        }
        if (index > pagesLastIndex) {
            throw new Error('Page index is greater than length of pages array.');
        }
        return this.pagesAsArray[index];
    }
    /**
     * Takes a wizard page object as a parameter and returns its index in the
     * collection of pages.
     *
     * @memberof PageCollectionService
     */
    getPageIndex(page) {
        const index = this.pagesAsArray.indexOf(page);
        if (index < 0) {
            throw new Error('Requested page cannot be found in collection of pages.');
        }
        return index;
    }
    /**
     * Accepts two numeric indexes and returns an array of wizard page objects that include
     * all wizard pages in the page collection from the first index to the second.
     *
     * @memberof PageCollectionService
     */
    pageRange(start, end) {
        let pages = [];
        if (start < 0 || end < 0) {
            return [];
        }
        if (start === null || typeof start === 'undefined' || isNaN(start)) {
            return [];
        }
        if (end === null || typeof end === 'undefined' || isNaN(end)) {
            return [];
        }
        if (end > this.pagesCount) {
            end = this.pagesCount;
        }
        pages = this.pagesAsArray;
        if (end - start === 0) {
            // just return the one page they want
            return [this.getPageByIndex(start)];
        }
        // slice end does not include item referenced by end index, which is weird for users
        // incrementing end index here to correct that so users and other methods
        // don't have to think about it
        end = end + 1;
        // slice does not return the last one in the range but it does include the first one
        // does not modify original array
        return pages.slice(start, end);
    }
    /**
     * Accepts two wizard page objects and returns those page objects with all other page
     * objects between them in the page collection. It doesn't care which page is ahead of the
     * other in the parameters. It will be smart enough to figure that out  on its own.
     *
     * @memberof PageCollectionService
     */
    getPageRangeFromPages(page, otherPage) {
        const pageIndex = this.getPageIndex(page);
        const otherPageIndex = this.getPageIndex(otherPage);
        let startIndex;
        let endIndex;
        if (pageIndex <= otherPageIndex) {
            startIndex = pageIndex;
            endIndex = otherPageIndex;
        }
        else {
            startIndex = otherPageIndex;
            endIndex = pageIndex;
        }
        return this.pageRange(startIndex, endIndex);
    }
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately before it in the page collection. Returns null if there is
     * no page before the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getPreviousPage(page) {
        const myPageIndex = this.getPageIndex(page);
        const previousPageIndex = myPageIndex - 1;
        if (previousPageIndex < 0) {
            return null;
        }
        return this.getPageByIndex(previousPageIndex);
    }
    /**
     * Accepts a wizard page object as a parameter and returns a Boolean that says if
     * the page you sent it is complete.
     *
     * @memberof PageCollectionService
     */
    previousPageIsCompleted(page) {
        if (!page) {
            return false;
        }
        const previousPage = this.getPreviousPage(page);
        if (null === previousPage) {
            // page is the first page. no previous page.
            return true;
        }
        return previousPage.completed;
    }
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately after it in the page collection. Returns null if there is
     * no page after the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getNextPage(page) {
        const myPageIndex = this.getPageIndex(page);
        const nextPageIndex = myPageIndex + 1;
        if (nextPageIndex >= this.pagesAsArray.length) {
            return null;
        }
        return this.getPageByIndex(nextPageIndex);
    }
    /**
     * Takes a wizard page object as a parameter and generates a step item id from the
     * page ID. Returns the generated step item ID as a string.
     *
     * @memberof PageCollectionService
     */
    getStepItemIdForPage(page) {
        const pageId = page.id;
        const pageIdParts = pageId.split('-').reverse();
        pageIdParts[1] = 'step';
        return pageIdParts.reverse().join('-');
    }
    /**
     * Generally only used internally to mark that a specific page has been "committed".
     * This involves marking the page complete and firing the ClrWizardPage.onCommit
     * (clrWizardPageOnCommit) output. Takes the wizard page object that you intend to
     * mark completed as a parameter.
     *
     * @memberof PageCollectionService
     */
    commitPage(page) {
        const pageHasOverrides = page.stopNext || page.preventDefault;
        page.completed = true;
        if (!pageHasOverrides) {
            // prevent loop of event emission; alternate flows work off
            // of event emitters this is how they break that cycle.
            page.onCommit.emit(page.id);
        }
    }
    /**
     * Sets all completed states of the pages in the page collection to false and
     * notifies the navigation service to likewise reset the navigation.
     *
     * @memberof PageCollectionService
     */
    reset() {
        this.pagesAsArray.forEach((page) => {
            page.completed = false;
        });
        this._pagesReset.next(true);
    }
    /**
     * Rolls through all the pages in the page collection to make sure there are no
     * incomplete pages sandwiched between completed pages in the workflow. Identifies
     * the first incomplete page index and sets all pages behind it to a completed
     * state of false.
     *
     * @memberof PageCollectionService
     */
    updateCompletedStates() {
        const firstIncompleteIndex = this.findFirstIncompletePageIndex();
        if (firstIncompleteIndex === this.pagesAsArray.length - 1) {
            // all complete no need to do anything
            return;
        }
        this.pagesAsArray.forEach((page, index) => {
            if (index > firstIncompleteIndex) {
                page.completed = false;
            }
        });
    }
    /**
     * Retrieves the index of the first incomplete page in the page collection.
     *
     * @memberof PageCollectionService
     */
    findFirstIncompletePageIndex() {
        let returnIndex = null;
        this.pagesAsArray.forEach((page, index) => {
            if (null === returnIndex && false === page.completed) {
                returnIndex = index;
            }
        });
        // fallthrough, all completed, return last page
        if (null === returnIndex) {
            returnIndex = this.pagesCount - 1;
        }
        return returnIndex;
    }
    findFirstIncompletePage() {
        const myIncompleteIndex = this.findFirstIncompletePageIndex();
        return this.pagesAsArray[myIncompleteIndex];
    }
    /**
     * Consolidates guard logic that prevents a couple of unfortunate edge cases with
     * look ups on the collection of pages.
     *
     * @memberof PageCollectionService
     */
    checkResults(results, requestedPageId) {
        const foundPagesCount = results.length || 0;
        if (foundPagesCount > 1) {
            throw new Error('More than one page has the requested id ' + requestedPageId + '.');
        }
        else if (foundPagesCount < 1) {
            throw new Error('No page can be found with the id ' + requestedPageId + '.');
        }
        else {
            return results[0];
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PageCollectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PageCollectionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: PageCollectionService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Performs navigation functions for a wizard and manages the current page. Presented as a
 * separate service to encapsulate the behavior of navigating and completing the wizard so
 * that it can be shared across the wizard and its sub-components.
 *
 * The easiest way to access the navigation service is there a reference on your wizard. The
 * Following example would allow you to access your instance of the wizard from your host
 * component and thereby access the navigation service via YourHostComponent.wizard.navService.
 *
 * @example
 * <clr-wizard #wizard ...>
 *
 * @example
 * export class YourHostComponent {
 *   @ViewChild("wizard") wizard: Wizard;
 *   ...
 * }
 *
 */
class WizardNavigationService {
    /**
     * Creates an instance of WizardNavigationService. Also sets up subscriptions
     * that listen to the button service to determine when a button has been clicked
     * in the wizard. Is also responsible for taking action when the page collection
     * requests that navigation be reset to its pristine state.
     *
     * @memberof WizardNavigationService
     */
    constructor(pageCollection, buttonService) {
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        /**
         * A Boolean flag used by the ClrWizardPage to avoid a race condition when pages are
         * loading and there is no current page defined.
         *
         * @memberof WizardNavigationService
         */
        this.navServiceLoaded = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.forceForward (clrWizardForceForwardNavigation) input. When true,
         * navigating backwards in the stepnav menu will reset any skipped pages' completed
         * state to false.
         *
         * This is useful when a wizard executes validation on a page-by-page basis when
         * the next button is clicked.
         *
         * @memberof WizardNavigationService
         */
        this.forceForwardNavigation = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.stopCancel (clrWizardPreventDefaultCancel) input. When true, the cancel
         * routine is subverted and must be reinstated in the host component calling Wizard.close()
         * at some point.
         *
         * @memberof WizardNavigationService
         */
        this.wizardHasAltCancel = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.stopNext (clrWizardPreventDefaultNext) input. When true, the next and finish
         * routines are subverted and must be reinstated in the host component calling Wizard.next(),
         * Wizard.forceNext(), Wizard.finish(), or Wizard.forceFinish().
         *
         * @memberof WizardNavigationService
         */
        this.wizardHasAltNext = false;
        /**
         * A boolean flag shared across the Wizard subcomponents that follows the value
         * of the Wizard.stopNavigation (clrWizardPreventNavigation) input. When true, all
         * navigational elements in the wizard are disabled.
         *
         * This is intended to freeze the wizard in place. Events are not fired so this is
         * not a way to implement alternate functionality for navigation.
         *
         * @memberof WizardNavigationService
         */
        this.wizardStopNavigation = false;
        /**
         * A boolean flag shared with the stepnav items that prevents user clicks on
         * stepnav items from navigating the wizard.
         *
         * @memberof WizardNavigationService
         */
        this.wizardDisableStepnav = false;
        /**
         * The layout of the wizard stepnav, either 'vertical' or 'horizontal'.
         */
        this.stepnavLayout = ClrWizardStepnavLayout.VERTICAL;
        /**
         *
         * @memberof WizardNavigationService
         */
        this._currentChanged = new Subject();
        /**
         * @memberof WizardNavigationService
         */
        this._movedToNextPage = new Subject();
        /**
         * @memberof WizardNavigationService
         */
        this._wizardFinished = new Subject();
        /**
         * @memberof WizardNavigationService
         */
        this._movedToPreviousPage = new Subject();
        /**
         * @memberof WizardNavigationService
         */
        this._cancelWizard = new Subject();
        this.previousButtonSubscription = buttonService.previousBtnClicked.subscribe(() => {
            const currentPage = this.currentPage;
            if (this.currentPageIsFirst || currentPage.previousStepDisabled) {
                return;
            }
            currentPage.previousButtonClicked.emit(currentPage);
            if (!currentPage.preventDefault) {
                this.previous();
            }
        });
        this.nextButtonSubscription = buttonService.nextBtnClicked.subscribe(() => {
            this.checkAndCommitCurrentPage('next');
        });
        this.dangerButtonSubscription = buttonService.dangerBtnClicked.subscribe(() => {
            this.checkAndCommitCurrentPage('danger');
        });
        this.finishButtonSubscription = buttonService.finishBtnClicked.subscribe(() => {
            this.checkAndCommitCurrentPage('finish');
        });
        this.customButtonSubscription = buttonService.customBtnClicked.subscribe((type) => {
            if (!this.wizardStopNavigation) {
                this.currentPage.customButtonClicked.emit(type);
            }
        });
        this.cancelButtonSubscription = buttonService.cancelBtnClicked.subscribe(() => {
            if (this.wizardStopNavigation) {
                return;
            }
            if (this.currentPage.preventDefault) {
                this.currentPage.pageOnCancel.emit(this.currentPage);
            }
            else {
                this.cancel();
            }
        });
        this.pagesResetSubscription = pageCollection.pagesReset.subscribe(() => {
            this.setFirstPageCurrent();
        });
    }
    /**
     * An Observable that is predominantly used amongst the subcomponents and services
     * of the wizard. It is recommended that users listen to the ClrWizardPage.onLoad
     * (clrWizardPageOnLoad) output instead of this Observable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageChange() {
        return this._currentChanged.asObservable();
    }
    /**
     * @memberof WizardNavigationService
     */
    get currentPageTitle() {
        // when the querylist of pages is empty. this is the first place it fails...
        if (!this.currentPage) {
            return null;
        }
        return this.currentPage.title;
    }
    /**
     * Returns a Boolean that tells you whether or not the current page is the first
     * page in the Wizard.
     *
     * This is helpful for determining whether a page is navigable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsFirst() {
        return this.pageCollection.firstPage === this.currentPage;
    }
    /**
     * Returns a Boolean that tells you whether or not the current page is the
     * last page in the Wizard.
     *
     * This is used to determine which buttons should display in the wizard footer.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsLast() {
        return this.pageCollection.lastPage === this.currentPage;
    }
    /**
     * Returns the ClrWizardPage object of the current page or null.
     *
     * @memberof WizardNavigationService
     */
    get currentPage() {
        if (!this._currentPage) {
            return null;
        }
        return this._currentPage;
    }
    /**
     * Accepts a ClrWizardPage object, since that object to be the current/active
     * page in the wizard, and emits the ClrWizardPage.onLoad (clrWizardPageOnLoad)
     * event for that page.
     *
     * Note that all of this work is bypassed if the ClrWizardPage object is already
     * the current page.
     *
     * @memberof WizardNavigationService
     */
    set currentPage(page) {
        if (this._currentPage !== page && !this.wizardStopNavigation) {
            this._currentPage = page;
            page.onLoad.emit(page.id);
            this._currentChanged.next(page);
        }
    }
    /**
     * An observable used internally to alert the wizard that forward navigation
     * has occurred. It is recommended that you use the Wizard.onMoveNext
     * (clrWizardOnNext) output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get movedToNextPage() {
        return this._movedToNextPage.asObservable();
    }
    /**
     * An observable used internally to alert the wizard that the nav service
     * has approved completion of the wizard.
     *
     * It is recommended that you use the Wizard.wizardFinished (clrWizardOnFinish)
     * output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get wizardFinished() {
        return this._wizardFinished.asObservable();
    }
    /**
     * Notifies the wizard when backwards navigation has occurred via the
     * previous button.
     *
     * @memberof WizardNavigationService
     */
    get movedToPreviousPage() {
        return this._movedToPreviousPage.asObservable();
    }
    /**
     * Notifies the wizard that a user is trying to cancel it.
     *
     * @memberof WizardNavigationService
     */
    get notifyWizardCancel() {
        return this._cancelWizard.asObservable();
    }
    /**
     *
     * @memberof WizardNavigationService
     */
    ngOnDestroy() {
        this.previousButtonSubscription.unsubscribe();
        this.nextButtonSubscription.unsubscribe();
        this.dangerButtonSubscription.unsubscribe();
        this.finishButtonSubscription.unsubscribe();
        this.customButtonSubscription.unsubscribe();
        this.cancelButtonSubscription.unsubscribe();
        this.pagesResetSubscription.unsubscribe();
    }
    /**
     * This is a public function that can be used to programmatically advance
     * the user to the next page.
     *
     * When invoked, this method will move the wizard to the next page after
     * successful validation. Note that this method goes through all checks
     * and event emissions as if Wizard.next(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.next(false).
     *
     * @memberof WizardNavigationService
     */
    next() {
        if (this.currentPageIsLast) {
            this.checkAndCommitCurrentPage('finish');
        }
        else {
            this.checkAndCommitCurrentPage('next');
        }
    }
    /**
     * Bypasses checks and most event emissions to force a page to navigate forward.
     *
     * Comparable to calling Wizard.next() or Wizard.forceNext().
     *
     * @memberof WizardNavigationService
     */
    forceNext() {
        const currentPage = this.currentPage;
        const nextPage = this.pageCollection.getNextPage(currentPage);
        // catch errant null or undefineds that creep in
        if (!nextPage) {
            throw new Error('The wizard has no next page to go to.');
        }
        if (this.wizardStopNavigation) {
            return;
        }
        if (!currentPage.completed) {
            // this is a state that alt next flows can get themselves in...
            this.pageCollection.commitPage(currentPage);
        }
        this.currentPage = nextPage;
    }
    /**
     * Accepts a button/action type as a parameter. Encapsulates all logic for
     * event emissions, state of the current page, and wizard and page level overrides.
     *
     * Avoid calling this function directly unless you really know what you're doing.
     *
     * @memberof WizardNavigationService
     */
    checkAndCommitCurrentPage(buttonType) {
        const currentPage = this.currentPage;
        if (!currentPage.readyToComplete || this.wizardStopNavigation) {
            return;
        }
        const iAmTheLastPage = this.currentPageIsLast;
        const isNext = buttonType === 'next';
        const isDanger = buttonType === 'danger';
        const isDangerNext = isDanger && !iAmTheLastPage;
        const isDangerFinish = isDanger && iAmTheLastPage;
        const isFinish = buttonType === 'finish' || isDangerFinish;
        if (isFinish && !iAmTheLastPage) {
            return;
        }
        currentPage.primaryButtonClicked.emit(buttonType);
        if (isFinish) {
            currentPage.finishButtonClicked.emit(currentPage);
        }
        else if (isDanger) {
            currentPage.dangerButtonClicked.emit();
        }
        else if (isNext) {
            currentPage.nextButtonClicked.emit();
        }
        if (currentPage.stopNext || currentPage.preventDefault) {
            currentPage.onCommit.emit(currentPage.id);
            return;
        }
        // order is very important with these emitters!
        if (isFinish) {
            // mark page as complete
            if (!this.wizardHasAltNext) {
                this.pageCollection.commitPage(currentPage);
            }
            this._wizardFinished.next();
        }
        if (this.wizardHasAltNext) {
            this.pageCollection.commitPage(currentPage);
            if (isNext || isDangerNext) {
                this._movedToNextPage.next(true);
            }
            // jump out here, no matter what type we're looking at
            return;
        }
        if (isNext || isDangerNext) {
            this.forceNext();
        }
        if (!this.wizardHasAltNext && !this.wizardStopNavigation) {
            this._movedToNextPage.next(true);
        }
    }
    /**
     * This is a public function that can be used to programmatically conclude
     * the wizard.
     *
     * When invoked, this method will  initiate the work involved with finalizing
     * and finishing the wizard workflow. Note that this method goes through all
     * checks and event emissions as if Wizard.finish(false) had been called.
     *
     * In most cases, it makes more sense to use Wizard.finish(false).
     *
     * @memberof WizardNavigationService
     */
    finish() {
        this.checkAndCommitCurrentPage('finish');
    }
    /**
     * Programmatically moves the wizard to the page before the current page.
     *
     * In most instances, it makes more sense to call Wizard.previous()
     * which does the same thing.
     *
     * @memberof WizardNavigationService
     */
    previous() {
        if (this.currentPageIsFirst || this.wizardStopNavigation) {
            return;
        }
        const previousPage = this.pageCollection.getPreviousPage(this.currentPage);
        if (!previousPage) {
            return;
        }
        this._movedToPreviousPage.next(true);
        if (this.forceForwardNavigation) {
            this.currentPage.completed = false;
        }
        this.currentPage = previousPage;
    }
    /**
     * Allows a hook into the cancel workflow of the wizard from the nav service. Note that
     * this route goes through all checks and event emissions as if a cancel button had
     * been clicked.
     *
     * In most cases, users looking for a hook into the cancel routine are actually looking
     * for a way to close the wizard from their host component because they have prevented
     * the default cancel action.
     *
     * In this instance, it is recommended that you use Wizard.close() to avoid any event
     * emission loop resulting from an event handler calling back into routine that will
     * again evoke the events it handles.
     *
     * @memberof WizardNavigationService
     */
    cancel() {
        this._cancelWizard.next();
    }
    /**
     * Performs all required checks to determine if a user can navigate to a page. Checking at each
     * point if a page is navigable -- completed where the page immediately after the last completed
     * page.
     *
     * Takes two parameters. The first one must be either the ClrWizardPage object or the ID of the
     * ClrWizardPage object that you want to make the current page.
     *
     * The second parameter is optional and is a Boolean flag for "lazy completion". What this means
     * is the Wizard will mark all pages between the current page and the page you want to navigate
     * to as completed. This is useful for informational wizards that do not require user action,
     * allowing an easy means for users to jump ahead.
     *
     * To avoid checks on navigation, use ClrWizardPage.makeCurrent() instead.
     *
     * @memberof WizardNavigationService
     */
    goTo(pageToGoToOrId, lazyComplete = false) {
        const myPages = this.pageCollection;
        const pageToGoTo = typeof pageToGoToOrId === 'string' ? myPages.getPageById(pageToGoToOrId) : pageToGoToOrId;
        const currentPage = this.currentPage;
        // no point in going to the current page. you're there already!
        // also hard block on any navigation when stopNavigation is true
        if (pageToGoTo === currentPage || this.wizardStopNavigation) {
            return;
        }
        const currentPageIndex = myPages.getPageIndex(currentPage);
        const goToPageIndex = myPages.getPageIndex(pageToGoTo);
        const goingForward = goToPageIndex > currentPageIndex;
        const pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
        const okayToMove = lazyComplete || this.canGoTo(pagesToCheck);
        if (!okayToMove) {
            return;
        }
        if (goingForward && lazyComplete) {
            pagesToCheck.forEach((page) => {
                if (page !== pageToGoTo) {
                    page.completed = true;
                }
            });
        }
        else if (!goingForward && this.forceForwardNavigation) {
            pagesToCheck.forEach((page) => {
                page.completed = false;
            });
        }
        this.currentPage = pageToGoTo;
    }
    /**
     * Accepts a range of ClrWizardPage objects as a parameter. Performs the work of checking
     * those objects to determine if navigation can be accomplished.
     *
     * @memberof WizardNavigationService
     */
    canGoTo(pagesToCheck) {
        let okayToMove = true;
        const myPages = this.pageCollection;
        // previous page can be important when moving because if it's completed it
        // allows us to move to the page even if it's incomplete...
        let previousPagePasses;
        if (!pagesToCheck || pagesToCheck.length < 1) {
            return false;
        }
        pagesToCheck.forEach((page) => {
            if (!okayToMove) {
                return;
            }
            if (page.completed) {
                // default is true. just jump out instead of complicating it.
                return;
            }
            // so we know our page is not completed...
            const previousPage = myPages.getPageIndex(page) > 0 ? myPages.getPreviousPage(page) : null;
            previousPagePasses = previousPage === null || previousPage.completed === true;
            // we are false if not the current page AND previous page is not completed
            // (but must have a previous page)
            if (!page.current && !previousPagePasses) {
                okayToMove = false;
            }
            // falls through to true as default
        });
        return okayToMove;
    }
    /**
     * Looks through the collection of pages to find the first one that is incomplete
     * and makes that page the current/active page.
     *
     * @memberof WizardNavigationService
     */
    setLastEnabledPageCurrent() {
        const allPages = this.pageCollection.pagesAsArray;
        let lastCompletedPageIndex = null;
        allPages.forEach((page, index) => {
            if (page.completed) {
                lastCompletedPageIndex = index;
            }
        });
        if (lastCompletedPageIndex === null) {
            // always is at least the first item...
            lastCompletedPageIndex = 0;
        }
        else if (lastCompletedPageIndex + 1 < allPages.length) {
            lastCompletedPageIndex = lastCompletedPageIndex + 1;
        }
        this.currentPage = allPages[lastCompletedPageIndex];
    }
    /**
     * Finds the first page in the collection of pages and makes that page the
     * current/active page.
     *
     * @memberof WizardNavigationService
     */
    setFirstPageCurrent() {
        this.currentPage = this.pageCollection.pagesAsArray[0];
    }
    /**
     * Updates the stepnav on the left side of the wizard when pages are dynamically
     * added or removed from the collection of pages.
     *
     * @memberof WizardNavigationService
     */
    updateNavigation() {
        let toSetCurrent;
        this.pageCollection.updateCompletedStates();
        const currentPageRemoved = this.pageCollection.pagesAsArray.indexOf(this.currentPage) < 0;
        if (currentPageRemoved) {
            toSetCurrent = this.pageCollection.findFirstIncompletePage();
            this.currentPage = toSetCurrent;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WizardNavigationService, deps: [{ token: PageCollectionService }, { token: ButtonHubService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WizardNavigationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WizardNavigationService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: PageCollectionService }, { type: ButtonHubService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class HeaderActionService {
    constructor(navService) {
        this.navService = navService;
    }
    get wizardHasHeaderActions() {
        const wizardHdrActions = this.wizardHeaderActions;
        if (!wizardHdrActions) {
            return false;
        }
        return wizardHdrActions.toArray().length > 0;
    }
    get currentPageHasHeaderActions() {
        return this.navService.currentPage ? this.navService.currentPage.hasHeaderActions : false;
    }
    get showWizardHeaderActions() {
        return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
    }
    get displayHeaderActionsWrapper() {
        return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: HeaderActionService, deps: [{ token: WizardNavigationService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: HeaderActionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: HeaderActionService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: WizardNavigationService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_BUTTON_TYPES = {
    cancel: 'cancel',
    previous: 'previous',
    next: 'next',
    finish: 'finish',
    danger: 'danger',
};
const CUSTOM_BUTTON_TYPES = {
    cancel: 'custom-cancel',
    previous: 'custom-previous',
    next: 'custom-next',
    finish: 'custom-finish',
    danger: 'custom-danger',
};
class ClrWizardButton {
    constructor(navService, buttonService) {
        this.navService = navService;
        this.buttonService = buttonService;
        this.type = '';
        this.disabled = false;
        this.hidden = false;
        // EventEmitter which is emitted when a button is clicked.
        this.wasClicked = new EventEmitter(false);
    }
    get isCancel() {
        return this.checkDefaultAndCustomType(this.type, 'cancel');
    }
    get isNext() {
        return this.checkDefaultAndCustomType(this.type, 'next');
    }
    get isPrevious() {
        return this.checkDefaultAndCustomType(this.type, 'previous');
    }
    get isFinish() {
        return this.checkDefaultAndCustomType(this.type, 'finish');
    }
    get isDanger() {
        return this.checkDefaultAndCustomType(this.type, 'danger');
    }
    get isPrimaryAction() {
        return this.isNext || this.isDanger || this.isFinish;
    }
    get _disabledAttribute() {
        if (this.isDisabled) {
            return '';
        }
        return null;
    }
    get isDisabled() {
        // dealing with negatives here. cognitively easier to think of it like this...
        const disabled = true;
        const nav = this.navService;
        const page = this.navService.currentPage;
        // Ensure we don't change the response until buttons are ready to avoid chocolate
        if (!this.buttonService.buttonsReady) {
            return !disabled;
        }
        if (this.disabled || nav.wizardStopNavigation || !page) {
            return true;
        }
        if (this.isCancel) {
            return !disabled;
        }
        if (this.isPrevious && (nav.currentPageIsFirst || page.previousStepDisabled)) {
            return disabled;
        }
        if (this.isDanger && !page.readyToComplete) {
            return disabled;
        }
        if (this.isNext && (nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }
        if (this.isFinish && (!nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }
        return !disabled;
    }
    get isHidden() {
        // dealing with negatives here. cognitively easier to think of it like this...
        const hidden = true;
        const nav = this.navService;
        // Ensure we don't change the response until buttons are ready to avoid chocolate
        if (!this.buttonService.buttonsReady) {
            return !hidden;
        }
        if (this.hidden) {
            return true;
        }
        if (this.isCancel) {
            return !hidden;
        }
        if (this.isPrevious && nav.currentPageIsFirst) {
            return hidden;
        }
        if (this.isNext && nav.currentPageIsLast) {
            return hidden;
        }
        if (this.isFinish && !nav.currentPageIsLast) {
            return hidden;
        }
        return !hidden;
    }
    click() {
        if (this.isDisabled) {
            return;
        }
        this.wasClicked.emit(this.type);
        this.buttonService.buttonClicked(this.type);
    }
    checkDefaultAndCustomType(valueToCheck = '', typeToLookUp) {
        if (DEFAULT_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        if (CUSTOM_BUTTON_TYPES[typeToLookUp] === valueToCheck) {
            return true;
        }
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardButton, deps: [{ token: WizardNavigationService }, { token: ButtonHubService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardButton, isStandalone: false, selector: "clr-wizard-button", inputs: { type: "type", disabled: ["clrWizardButtonDisabled", "disabled"], hidden: ["clrWizardButtonHidden", "hidden"] }, outputs: { wasClicked: "clrWizardButtonClicked" }, host: { properties: { "attr.aria-hidden": "isHidden" }, classAttribute: "clr-wizard-btn-wrapper" }, ngImport: i0, template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-button',
                    template: `
    <button
      type="button"
      class="btn clr-wizard-btn"
      [class.btn-link]="isCancel"
      [class.clr-wizard-btn--tertiary]="isCancel"
      [class.btn-outline]="isPrevious"
      [class.clr-wizard-btn--secondary]="isPrevious"
      [class.btn-primary]="isPrimaryAction"
      [class.clr-wizard-btn--primary]="isPrimaryAction"
      [class.btn-success]="isFinish"
      [class.btn-danger]="isDanger"
      [class.disabled]="isDisabled"
      [attr.disabled]="_disabledAttribute"
      (click)="click()"
    >
      <ng-content></ng-content>
    </button>
  `,
                    host: { class: 'clr-wizard-btn-wrapper', '[attr.aria-hidden]': 'isHidden' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: WizardNavigationService }, { type: ButtonHubService }], propDecorators: { type: [{
                type: Input,
                args: ['type']
            }], disabled: [{
                type: Input,
                args: ['clrWizardButtonDisabled']
            }], hidden: [{
                type: Input,
                args: ['clrWizardButtonHidden']
            }], wasClicked: [{
                type: Output,
                args: ['clrWizardButtonClicked']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let wizardHeaderActionIndex = 0;
class ClrWizardHeaderAction {
    constructor() {
        // title is explanatory text added to the header action
        this.title = '';
        // If our host has an ID attribute, we use this instead of our index.
        this._id = (wizardHeaderActionIndex++).toString();
        this.disabled = false;
        this.headerActionClicked = new EventEmitter(false);
    }
    get id() {
        return `clr-wizard-header-action-${this._id}`;
    }
    click() {
        if (this.disabled) {
            return;
        }
        // passing the header action id allows users to have one method that
        // routes to many different actions based on the type of header action
        // clicked. this is further aided by users being able to specify ids
        // for their header actions.
        this.headerActionClicked.emit(this._id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardHeaderAction, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardHeaderAction, isStandalone: false, selector: "clr-wizard-header-action", inputs: { title: "title", _id: ["id", "_id"], disabled: ["clrWizardHeaderActionDisabled", "disabled"] }, outputs: { headerActionClicked: "actionClicked" }, host: { classAttribute: "clr-wizard-header-action-wrapper" }, ngImport: i0, template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardHeaderAction, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-header-action',
                    template: `
    <button
      type="button"
      class="btn clr-wizard-header-action btn-link"
      [id]="id"
      [class.disabled]="disabled"
      (click)="click()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
  `,
                    host: { class: 'clr-wizard-header-action-wrapper' },
                    standalone: false,
                }]
        }], propDecorators: { title: [{
                type: Input,
                args: ['title']
            }], _id: [{
                type: Input,
                args: ['id']
            }], disabled: [{
                type: Input,
                args: ['clrWizardHeaderActionDisabled']
            }], headerActionClicked: [{
                type: Output,
                args: ['actionClicked']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardPageButtons {
    constructor(pageButtonsTemplateRef) {
        this.pageButtonsTemplateRef = pageButtonsTemplateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageButtons, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardPageButtons, isStandalone: false, selector: "[clrPageButtons]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageButtons, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPageButtons]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardPageHeaderActions {
    constructor(pageHeaderActionsTemplateRef) {
        this.pageHeaderActionsTemplateRef = pageHeaderActionsTemplateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageHeaderActions, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardPageHeaderActions, isStandalone: false, selector: "[clrPageHeaderActions]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageHeaderActions, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPageHeaderActions]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardPageNavTitle {
    constructor(pageNavTitleTemplateRef) {
        this.pageNavTitleTemplateRef = pageNavTitleTemplateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageNavTitle, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardPageNavTitle, isStandalone: false, selector: "[clrPageNavTitle]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageNavTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPageNavTitle]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardPageTitle {
    constructor(pageTitleTemplateRef) {
        this.pageTitleTemplateRef = pageTitleTemplateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageTitle, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardPageTitle, isStandalone: false, selector: "[clrPageTitle]", inputs: { headingLevel: ["clrHeadingLevel", "headingLevel"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPageTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPageTitle]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }], propDecorators: { headingLevel: [{
                type: Input,
                args: ['clrHeadingLevel']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let wizardPageIndex = 0;
/**
 * The ClrWizardPage component is responsible for displaying the content of each step
 * in the wizard workflow.
 *
 * ClrWizardPage component has hooks into the navigation service (ClrWizardPage.navService),
 * page collection (ClrWizardPage.pageCollection), and button service
 * (ClrWizardPage.buttonService). These three providers are shared across the components
 * within each instance of a Wizard.
 *
 */
class ClrWizardPage {
    /**
     * Creates an instance of ClrWizardPage.
     *
     * @memberof WizardPage
     */
    constructor(navService, pageCollection, buttonService) {
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.buttonService = buttonService;
        /**
         * An input value that is used internally to generate the ClrWizardPage ID as
         * well as the step nav item ID.
         *
         * Typed as any because it should be able to accept numbers as well as
         * strings. Passing an index for wizard whose pages are created with an
         * ngFor loop is a common use case.
         *
         * @memberof WizardPage
         *
         */
        this._id = (wizardPageIndex++).toString();
        /**
         * Overrides all actions from the page level, so you can use an alternate function for
         * validation or data-munging with a ClrWizardPage.onCommit (clrWizardPageOnCommit output),
         * ClrWizardPage.onCancel (clrWizardPageOnCancel output), or one
         * of the granular page-level button click event emitters.
         *
         * @memberof WizardPage
         *
         */
        this.preventDefault = false;
        /**
         * Emits when the value of ClrWizardPage.nextStepDisabled changes.
         * Should emit the new value of nextStepDisabled.
         *
         * @memberof WizardPage
         *
         */
        this.nextStepDisabledChange = new EventEmitter();
        /**
         * Emits when the value of ClrWizardPage.previousStepDisabled changes.
         * Should emit the new value of previousStepDisabled.
         *
         * @memberof WizardPage
         *
         */
        this.previousStepDisabledChange = new EventEmitter();
        /**
         *
         * @memberof WizardPage
         *
         */
        this.stopCancelChange = new EventEmitter();
        /**
         * An event emitter carried over from a legacy version of ClrWizardPage.
         * Fires an event on ClrWizardPage whenever the next or finish buttons
         * are clicked and the page is the current page of the Wizard.
         *
         * Note that this does not automatically emit an event when a custom
         * button is used in place of a next or finish button.
         *
         * @memberof WizardPage
         *
         */
        this.onCommit = new EventEmitter(false);
        /**
         * Emits an event when ClrWizardPage becomes the current page of the
         * Wizard.
         *
         * @memberof WizardPage
         *
         */
        this.onLoad = new EventEmitter();
        /**
         * Emits an event when the ClrWizardPage invokes the cancel routine for the wizard.
         *
         * Can be used in conjunction with the ClrWizardPage.stopCancel
         * (clrWizardPagePreventDefaultCancel) or ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) inputs to implement custom cancel
         * functionality at the page level. This is useful if you would like to do
         * validation, save data, or warn users before cancelling the wizard.
         *
         * Note that this requires you to call Wizard.close() from the host component.
         * This constitues a full replacement of the cancel functionality.
         *
         * @memberof WizardPage
         *
         */
        this.pageOnCancel = new EventEmitter();
        /**
         * Emits an event when the finish button is clicked and the ClrWizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom finish
         * functionality at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to complete
         * the wizard.
         *
         * Note that this requires you to call Wizard.finish() or Wizard.forceFinish()
         * from the host component. This combination creates a full replacement of
         * the finish functionality.
         *
         * @memberof WizardPage
         *
         */
        this.finishButtonClicked = new EventEmitter();
        /**
         * Emits an event when the previous button is clicked and the ClrWizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom backwards
         * navigation at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to go
         * backwards in the wizard.
         *
         * Note that this requires you to call Wizard.previous()
         * from the host component. This combination creates a full replacement of
         * the backwards navigation functionality.
         *
         * @memberof WizardPage
         *
         */
        this.previousButtonClicked = new EventEmitter();
        /**
         * Emits an event when the next button is clicked and the ClrWizardPage is
         * the wizard's current page.
         *
         * Can be used in conjunction with the ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * navigation at the page level. This is useful if you would like to do
         * validation, save data, or warn users before allowing them to go
         * to the next page in the wizard.
         *
         * Note that this requires you to call Wizard.forceNext() or Wizard.next()
         * from the host component. This combination creates a full replacement of
         * the forward navigation functionality.
         *
         * @memberof WizardPage
         *
         */
        this.nextButtonClicked = new EventEmitter();
        /**
         * Emits an event when a danger button is clicked and the ClrWizardPage is
         * the wizard's current page. By default, a danger button will act as
         * either a "next" or "finish" button depending on if the ClrWizardPage is the
         * last page or not.
         *
         * Can be used in conjunction with the ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * or finish navigation at the page level when the danger button is clicked.
         * This is useful if you would like to do validation, save data, or warn
         * users before allowing them to go to the next page in the wizard or
         * finish the wizard.
         *
         * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
         * Wizard.forceNext() or Wizard.next() from the host component. This
         * combination creates a full replacement of the forward navigation and
         * finish functionality.
         *
         * @memberof WizardPage
         *
         */
        this.dangerButtonClicked = new EventEmitter();
        /**
         * Emits an event when a next, finish, or danger button is clicked and the
         * ClrWizardPage is the wizard's current page.
         *
         * Can be used in conjunction with the ClrWizardPage.preventDefault
         * (clrWizardPagePagePreventDefault) input to implement custom forwards
         * or finish navigation at the page level, regardless of the type of
         * primary button.
         *
         * This is useful if you would like to do validation, save data, or warn
         * users before allowing them to go to the next page in the wizard or
         * finish the wizard.
         *
         * Note that this requires you to call Wizard.finish(), Wizard.forceFinish(),
         * Wizard.forceNext() or Wizard.next() from the host component. This
         * combination creates a full replacement of the forward navigation and
         * finish functionality.
         *
         * @memberof WizardPage
         *
         */
        this.primaryButtonClicked = new EventEmitter();
        this.customButtonClicked = new EventEmitter();
        /**
         *
         * @memberof WizardPage
         *
         */
        this._nextStepDisabled = false;
        /**
         *
         * @memberof WizardPage
         *
         */
        this._previousStepDisabled = false;
        /**
         *
         * @memberof WizardPage
         *
         */
        this._hasError = false;
        /**
         *
         * @memberof WizardPage
         *
         */
        this._stopCancel = false;
        /**
         *
         * @memberof WizardPage
         *
         */
        this._stopNext = false;
        /**
         *
         * @memberof WizardPage
         *
         */
        this._complete = false;
    }
    /**
     * A property that tells whether or not the wizard should be allowed
     * to move to the next page.
     *
     * Useful for in-page validation because it prevents forward navigation
     * and visibly disables the next button.
     *
     * Does not require that you re-implement navigation routines like you
     * would if you were using ClrWizardPage.preventDefault or
     * Wizard.preventDefault.
     *
     * @memberof WizardPage
     *
     */
    get nextStepDisabled() {
        return this._nextStepDisabled;
    }
    set nextStepDisabled(val) {
        const valBool = !!val;
        if (valBool !== this._nextStepDisabled) {
            this._nextStepDisabled = valBool;
            this.nextStepDisabledChange.emit(valBool);
        }
    }
    /**
     * A property that tells whether or not the wizard should be allowed
     * to move to the previous page.
     *
     * Useful for in-page validation because it prevents backward navigation
     * and visibly disables the previous button.
     *
     * Does not require that you re-implement navigation routines like you
     * would if you were using ClrWizardPage.preventDefault or
     * Wizard.preventDefault.
     *
     * @memberof WizardPage
     *
     */
    get previousStepDisabled() {
        return this._previousStepDisabled;
    }
    set previousStepDisabled(val) {
        const valBool = !!val;
        if (valBool !== this._previousStepDisabled) {
            this._previousStepDisabled = valBool;
            this.previousStepDisabledChange.emit(valBool);
        }
    }
    /**
     * Whether the page has an error and also resolve the "falsy" value. The
     * current logic treat a "0" or an empty string as false and likewise will treat any
     * "truthy" value as true.
     *
     * @memberof WizardPage
     *
     */
    get hasError() {
        return this._hasError;
    }
    set hasError(val) {
        const valBool = !!val;
        if (valBool !== this._hasError) {
            this._hasError = valBool;
        }
    }
    /**
     * Overrides the cancel action from the page level. Allows you to use an
     * alternate function for validation or data-munging before cancelling the
     * wizard when combined with the ClrWizardPage.onCancel
     * (the clrWizardPageOnCancel output).
     *
     * Requires that you manually close the wizard from your host component,
     * usually with a call to Wizard.forceNext() or wizard.next();
     *
     * @memberof ClrWizardPage
     */
    get stopCancel() {
        return this._stopCancel;
    }
    set stopCancel(val) {
        const valBool = !!val;
        if (valBool !== this._stopCancel) {
            this._stopCancel = valBool;
            this.stopCancelChange.emit(valBool);
        }
    }
    /**
     * Overrides forward navigation from the page level. Allows you to use an
     * alternate function for validation or data-munging before moving the
     * wizard to the next pagewhen combined with the ClrWizardPage.onCommit
     * (clrWizardPageOnCommit) or ClrWizardPage.nextButtonClicked
     * (clrWizardPageNext) outputs.
     *
     * Requires that you manually tell the wizard to navigate forward from
     * the hostComponent, usually with a call to Wizard.forceNext() or
     * wizard.next();
     *
     * @memberof ClrWizardPage
     */
    get stopNext() {
        return this._stopNext;
    }
    set stopNext(val) {
        const valBool = !!val;
        if (valBool !== this._stopNext) {
            this._stopNext = valBool;
        }
    }
    /**
     * A read-only getter that generates an ID string for the wizard page from
     * either the value passed to the ClrWizardPage "id" input or a wizard page
     * counter shared across all wizard pages in the application.
     *
     * Note that the value passed into the ID input Will be prefixed with
     * "clr-wizard-page-".
     *
     * @readonly
     *
     * @memberof ClrWizardPage
     */
    get id() {
        // covers things like null, undefined, false, and empty string
        // while allowing zero to pass
        const idIsNonZeroFalsy = !this._id && this._id !== 0;
        // in addition to non-zero falsy we also want to make sure _id is not a negative
        // number.
        if (idIsNonZeroFalsy || this._id < 0) {
            // guard here in the event that input becomes undefined or null by accident
            this._id = (wizardPageIndex++).toString();
        }
        return `clr-wizard-page-${this._id}`;
    }
    /**
     * A read-only getter that serves as a convenience for those who would rather
     * not think in the terms of !ClrWizardPage.nextStepDisabled. For some use cases,
     * ClrWizardPage.readyToComplete is more logical and declarative.
     *
     * @memberof WizardPage
     *
     */
    get readyToComplete() {
        return !this.nextStepDisabled;
    }
    /**
     * A page is marked as completed if it is both readyToComplete and completed,
     * as in the next or finish action has been executed while this page was current.
     *
     * Note there is and open question about how to handle pages that are marked
     * complete but who are no longer readyToComplete. This might indicate an error
     * state for the ClrWizardPage. Currently, the wizard does not acknowledge this state
     * and only returns that the page is incomplete.
     *
     * @memberof WizardPage
     *
     */
    get completed() {
        return this._complete && this.readyToComplete;
        // FOR V2: UNWIND COMPLETED, READYTOCOMPLETE, AND ERRORS
        // SUCH THAT ERRORS IS ITS OWN INPUT. IF A STEP IS
        // INCOMPLETE AND ERRORED, ERRORED WILL NOT SHOW.
        // FIRST QUESTION: AM I GREY OR COLORED?
        // SECOND QUESTION: AM I GREEN OR RED?
    }
    /**
     * A ClrWizardPage can be manually set to completed using this boolean setter.
     * It is recommended that users rely on the convenience functions in the wizard
     * and navigation service instead of manually setting pages’ completion state.
     *
     * @memberof ClrWizardPage
     */
    set completed(value) {
        this._complete = value;
    }
    /**
     * Checks with the navigation service to see if it is the current page.
     *
     * @memberof WizardPage
     *
     */
    get current() {
        return this.navService.currentPage === this;
    }
    get disabled() {
        return !this.enabled;
    }
    /**
     * A read-only getter that returns whether or not the page is navigable
     * in the wizard. A wizard page can be navigated to if it is completed
     * or the page before it is completed.
     *
     * This getter handles the logic for enabling or disabling the links in
     * the step nav on the left Side of the wizard.
     *
     * @memberof WizardPage
     *
     */
    get enabled() {
        return this.current || this.completed || this.previousCompleted;
    }
    /**
     * A read-only getter that returns whether or not the page before this
     * ClrWizardPage is completed. This is useful for determining whether or not
     * a page is navigable if it is not current or already completed.
     *
     * @memberof WizardPage
     *
     */
    get previousCompleted() {
        const previousPage = this.pageCollection.getPreviousPage(this);
        if (!previousPage) {
            return true;
        }
        return previousPage.completed;
    }
    /**
     *
     * @memberof WizardPage
     *
     */
    get title() {
        return this.pageTitle?.pageTitleTemplateRef;
    }
    /**
     *
     * @memberof WizardPage
     *
     */
    get navTitle() {
        if (this.pageNavTitle) {
            return this.pageNavTitle.pageNavTitleTemplateRef;
        }
        return this.pageTitle?.pageTitleTemplateRef;
    }
    /**
     *
     * @memberof WizardPage
     *
     */
    get headerActions() {
        if (!this._headerActions) {
            return undefined;
        }
        return this._headerActions.pageHeaderActionsTemplateRef;
    }
    /**
     *
     * @memberof WizardPage
     *
     */
    get hasHeaderActions() {
        return !!this._headerActions;
    }
    /**
     *
     * @memberof WizardPage
     *
     */
    get buttons() {
        if (!this._buttons) {
            return undefined;
        }
        return this._buttons.pageButtonsTemplateRef;
    }
    /**
     * A read-only getter that returns a boolean that says whether or
     * not the ClrWizardPage includes buttons. Used to determine if the
     * Wizard should override the default button set defined as
     * its direct children.
     *
     * @memberof WizardPage
     *
     */
    get hasButtons() {
        return !!this._buttons;
    }
    /**
     * A read-only getter that returns the id used by the step nav item associated with the page.
     *
     * ClrWizardPage needs this ID string for aria information.
     *
     * @memberof WizardPage
     *
     */
    get stepItemId() {
        return this.pageCollection.getStepItemIdForPage(this);
    }
    /**
     * Links the nav service and establishes the current page if one is not defined.
     *
     * @memberof WizardPage
     *
     */
    ngOnInit() {
        const navService = this.navService;
        if (!navService.currentPage && !navService.navServiceLoaded) {
            this.makeCurrent();
            this.navService.navServiceLoaded = true;
        }
    }
    /**
     * Uses the nav service to make the ClrWizardPage the current page in the
     * wizard. Bypasses all checks but still emits the ClrWizardPage.onLoad
     * (clrWizardPageOnLoad) output.
     *
     * In most cases, it is better to use the default navigation functions
     * in Wizard.
     *
     * @memberof WizardPage
     *
     */
    makeCurrent() {
        this.navService.currentPage = this;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPage, deps: [{ token: WizardNavigationService }, { token: PageCollectionService }, { token: ButtonHubService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardPage, isStandalone: false, selector: "clr-wizard-page", inputs: { _id: ["id", "_id"], preventDefault: ["clrWizardPagePreventDefault", "preventDefault"], nextStepDisabled: ["clrWizardPageNextDisabled", "nextStepDisabled"], previousStepDisabled: ["clrWizardPagePreviousDisabled", "previousStepDisabled"], hasError: ["clrWizardPageHasError", "hasError"], stopCancel: ["clrWizardPagePreventDefaultCancel", "stopCancel"], stopNext: ["clrWizardPagePreventDefaultNext", "stopNext"] }, outputs: { nextStepDisabledChange: "clrWizardPageNextDisabledChange", previousStepDisabledChange: "clrWizardPagePreviousDisabledChange", stopCancelChange: "clrWizardPagePreventDefaultCancelChange", onCommit: "clrWizardPageOnCommit", onLoad: "clrWizardPageOnLoad", pageOnCancel: "clrWizardPageOnCancel", finishButtonClicked: "clrWizardPageFinish", previousButtonClicked: "clrWizardPagePrevious", nextButtonClicked: "clrWizardPageNext", dangerButtonClicked: "clrWizardPageDanger", primaryButtonClicked: "clrWizardPagePrimary", customButtonClicked: "clrWizardPageCustomButton" }, host: { properties: { "id": "id", "attr.aria-hidden": "!current", "attr.aria-labelledby": "stepItemId", "class.active": "current", "class.clr-wizard-page": "true" } }, queries: [{ propertyName: "pageTitle", first: true, predicate: ClrWizardPageTitle, static: true }, { propertyName: "pageNavTitle", first: true, predicate: ClrWizardPageNavTitle, static: true }, { propertyName: "_buttons", first: true, predicate: ClrWizardPageButtons, static: true }, { propertyName: "_headerActions", first: true, predicate: ClrWizardPageHeaderActions, descendants: true, static: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardPage, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-page',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[id]': 'id',
                        '[attr.aria-hidden]': '!current',
                        '[attr.aria-labelledby]': 'stepItemId',
                        '[class.active]': 'current',
                        '[class.clr-wizard-page]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: WizardNavigationService }, { type: PageCollectionService }, { type: ButtonHubService }], propDecorators: { _id: [{
                type: Input,
                args: ['id']
            }], preventDefault: [{
                type: Input,
                args: ['clrWizardPagePreventDefault']
            }], nextStepDisabledChange: [{
                type: Output,
                args: ['clrWizardPageNextDisabledChange']
            }], previousStepDisabledChange: [{
                type: Output,
                args: ['clrWizardPagePreviousDisabledChange']
            }], stopCancelChange: [{
                type: Output,
                args: ['clrWizardPagePreventDefaultCancelChange']
            }], onCommit: [{
                type: Output,
                args: ['clrWizardPageOnCommit']
            }], onLoad: [{
                type: Output,
                args: ['clrWizardPageOnLoad']
            }], pageOnCancel: [{
                type: Output,
                args: ['clrWizardPageOnCancel']
            }], finishButtonClicked: [{
                type: Output,
                args: ['clrWizardPageFinish']
            }], previousButtonClicked: [{
                type: Output,
                args: ['clrWizardPagePrevious']
            }], nextButtonClicked: [{
                type: Output,
                args: ['clrWizardPageNext']
            }], dangerButtonClicked: [{
                type: Output,
                args: ['clrWizardPageDanger']
            }], primaryButtonClicked: [{
                type: Output,
                args: ['clrWizardPagePrimary']
            }], customButtonClicked: [{
                type: Output,
                args: ['clrWizardPageCustomButton']
            }], pageTitle: [{
                type: ContentChild,
                args: [ClrWizardPageTitle, { static: true, descendants: false }]
            }], pageNavTitle: [{
                type: ContentChild,
                args: [ClrWizardPageNavTitle, { static: true, descendants: false }]
            }], _buttons: [{
                type: ContentChild,
                args: [ClrWizardPageButtons, { static: true, descendants: false }]
            }], _headerActions: [{
                type: ContentChild,
                args: [ClrWizardPageHeaderActions, { static: true }]
            }], nextStepDisabled: [{
                type: Input,
                args: ['clrWizardPageNextDisabled']
            }], previousStepDisabled: [{
                type: Input,
                args: ['clrWizardPagePreviousDisabled']
            }], hasError: [{
                type: Input,
                args: ['clrWizardPageHasError']
            }], stopCancel: [{
                type: Input,
                args: ['clrWizardPagePreventDefaultCancel']
            }], stopNext: [{
                type: Input,
                args: ['clrWizardPagePreventDefaultNext']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrWizardTitle, isStandalone: false, selector: "clr-wizard-title", inputs: { headingLevel: ["clrHeadingLevel", "headingLevel"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-wizard-title',
                    standalone: false,
                }]
        }], propDecorators: { headingLevel: [{
                type: Input,
                args: ['clrHeadingLevel']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardStepnavItem {
    constructor(navService, pageCollection, commonStrings, elementRef) {
        this.navService = navService;
        this.pageCollection = pageCollection;
        this.commonStrings = commonStrings;
        this.elementRef = elementRef;
        /**
         * This is used to prevent the steps from scrolling as the user clicks on the steps.
         */
        this.skipNextScroll = false;
    }
    get id() {
        this.pageGuard();
        return this.pageCollection.getStepItemIdForPage(this.page);
    }
    get stepAriaCurrent() {
        return this.isCurrent && 'step';
    }
    get isDisabled() {
        this.pageGuard();
        return this.page.disabled || this.navService.wizardStopNavigation || this.navService.wizardDisableStepnav;
    }
    get isCurrent() {
        this.pageGuard();
        return this.page.current;
    }
    get isComplete() {
        this.pageGuard();
        return this.page.completed;
    }
    get hasError() {
        this.pageGuard();
        return this.page.hasError && this.isComplete;
    }
    get canNavigate() {
        this.pageGuard();
        return this.pageCollection.previousPageIsCompleted(this.page);
    }
    get stepIconId() {
        return `${this.id}-step-icon`;
    }
    get stepTextId() {
        return `${this.id}-step-text`;
    }
    get stepNumberId() {
        return `${this.id}-step-number`;
    }
    get stepTitleId() {
        return `${this.id}-step-title`;
    }
    get labelledby() {
        const textIds = [this.stepTextId, this.stepNumberId, this.stepTitleId];
        const allIds = this.isComplete ? [this.stepIconId, ...textIds] : textIds;
        return allIds.join(' ');
    }
    get icon() {
        if (this.isCurrent && this.navService.stepnavLayout !== ClrWizardStepnavLayout.HORIZONTAL) {
            return {
                shape: 'dot-circle',
                label: this.commonStrings.keys.wizardStepCurrent || this.commonStrings.keys.timelineStepCurrent,
            };
        }
        else if (this.hasError) {
            return {
                shape: 'error-standard',
                label: this.commonStrings.keys.wizardStepError || this.commonStrings.keys.timelineStepError,
            };
        }
        else if (this.isComplete) {
            return {
                shape: 'success-standard',
                label: this.commonStrings.keys.wizardStepSuccess || this.commonStrings.keys.timelineStepSuccess,
            };
        }
        else {
            return null;
        }
    }
    ngOnInit() {
        this.subscription = this.ensureCurrentStepIsScrolledIntoView().subscribe();
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    click() {
        this.pageGuard();
        // if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        if (this.isDisabled || this.isCurrent) {
            return;
        }
        this.skipNextScroll = true;
        this.navService.goTo(this.page);
    }
    scrollIntoView() {
        this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
    pageGuard() {
        if (!this.page) {
            throw new Error('Wizard stepnav item is not associated with a wizard page.');
        }
    }
    ensureCurrentStepIsScrolledIntoView() {
        // Don't use "smooth" scrolling when the wizard is first opened to avoid a delay in scrolling the current step into view.
        // The current step when the wizard is opened might not be the first step. For example, the wizard can be closed and re-opened.
        let scrollBehavior = 'auto';
        return this.navService.currentPageChange.pipe(startWith(this.navService.currentPage), debounceTime(1), tap(currentPage => {
            if (!this.skipNextScroll && currentPage === this.page) {
                this.elementRef.nativeElement.scrollIntoView({ behavior: scrollBehavior, block: 'center', inline: 'center' });
            }
            scrollBehavior = 'smooth';
            this.skipNextScroll = false;
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardStepnavItem, deps: [{ token: WizardNavigationService }, { token: PageCollectionService }, { token: i3.ClrCommonStringsService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrWizardStepnavItem, isStandalone: false, selector: "[clr-wizard-stepnav-item]", inputs: { page: "page" }, host: { listeners: { "focusin": "scrollIntoView()" }, properties: { "id": "id", "attr.aria-current": "stepAriaCurrent", "attr.aria-controls": "page.id", "class.clr-nav-link": "true", "class.nav-item": "true", "class.active": "isCurrent", "class.disabled": "isDisabled", "class.no-click": "!canNavigate", "class.complete": "isComplete", "class.error": "hasError" } }, ngImport: i0, template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        @if (icon; as icon) {
          <cds-icon
            [id]="stepIconId"
            role="img"
            class="clr-wizard-stepnav-link-icon"
            [shape]="icon.shape"
            [attr.aria-label]="icon.label"
          ></cds-icon>
        }
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardStepnavItem, decorators: [{
            type: Component,
            args: [{
                    selector: '[clr-wizard-stepnav-item]',
                    template: `
    <button
      type="button"
      class="btn btn-link clr-wizard-stepnav-link"
      (click)="click()"
      [attr.disabled]="isDisabled ? '' : null"
      [attr.aria-labelledby]="labelledby"
    >
      <div class="clr-wizard-stepnav-link-icon">
        @if (icon; as icon) {
          <cds-icon
            [id]="stepIconId"
            role="img"
            class="clr-wizard-stepnav-link-icon"
            [shape]="icon.shape"
            [attr.aria-label]="icon.label"
          ></cds-icon>
        }
      </div>

      <span [id]="stepTextId" class="clr-sr-only">{{ commonStrings.keys.wizardStep }}</span>
      <div [id]="stepNumberId" class="clr-wizard-stepnav-link-page-number">
        <ng-content></ng-content>
      </div>
      <span [id]="stepTitleId" class="clr-wizard-stepnav-link-title">
        <ng-template [ngTemplateOutlet]="page.navTitle"></ng-template>
      </span>
    </button>
  `,
                    host: {
                        '[id]': 'id',
                        '[attr.aria-current]': 'stepAriaCurrent',
                        '[attr.aria-controls]': 'page.id',
                        '[class.clr-nav-link]': 'true',
                        '[class.nav-item]': 'true',
                        '[class.active]': 'isCurrent',
                        '[class.disabled]': 'isDisabled',
                        '[class.no-click]': '!canNavigate',
                        '[class.complete]': 'isComplete',
                        '[class.error]': 'hasError',
                        '(focusin)': 'scrollIntoView()',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: WizardNavigationService }, { type: PageCollectionService }, { type: i3.ClrCommonStringsService }, { type: i0.ElementRef }], propDecorators: { page: [{
                type: Input,
                args: ['page']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizardStepnav {
    constructor(pageService, navService, elementRef) {
        this.pageService = pageService;
        this.navService = navService;
        this.elementRef = elementRef;
        this.showScrollLeftButton = false;
        this.showScrollRightButton = false;
        this.firstItemVisible = true;
        this.lastItemVisible = true;
    }
    get stepnavLayout() {
        return this.navService.stepnavLayout;
    }
    ngAfterViewInit() {
        if (this.stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {
            this.setupIntersectionObserver();
            this.stepnavItems.notifyOnChanges();
            this.subscription = this.stepnavItems.changes.pipe(startWith(undefined)).subscribe(() => {
                this.observeEdgeItems();
            });
        }
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
        this.intersectionObserver?.disconnect();
    }
    scrollLeft() {
        this.scroll('left');
    }
    scrollRight() {
        this.scroll('right');
    }
    setupIntersectionObserver() {
        const scrollContainer = this.elementRef.nativeElement.querySelector('.clr-wizard-stepnav-list');
        this.intersectionObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const target = entry.target;
                const isFirst = target === this.stepnavItems.first?.elementRef.nativeElement;
                const isLast = target === this.stepnavItems.last?.elementRef.nativeElement;
                if (isFirst) {
                    this.firstItemVisible = entry.isIntersecting;
                }
                if (isLast) {
                    this.lastItemVisible = entry.isIntersecting;
                }
            }
            this.showScrollLeftButton = !this.firstItemVisible;
            this.showScrollRightButton = !this.lastItemVisible;
        }, { root: scrollContainer, threshold: 0.99 });
    }
    observeEdgeItems() {
        this.intersectionObserver.disconnect();
        this.firstItemVisible = true;
        this.lastItemVisible = true;
        const first = this.stepnavItems.first;
        const last = this.stepnavItems.last;
        if (first) {
            this.intersectionObserver.observe(first.elementRef.nativeElement);
        }
        if (last && last !== first) {
            this.intersectionObserver.observe(last.elementRef.nativeElement);
        }
    }
    scroll(direction) {
        const scrollContainer = this.elementRef.nativeElement.querySelector('.clr-wizard-stepnav-list');
        const scrollAmount = scrollContainer.clientWidth * 0.5;
        scrollContainer.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardStepnav, deps: [{ token: PageCollectionService }, { token: WizardNavigationService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrWizardStepnav, isStandalone: false, selector: "clr-wizard-stepnav", inputs: { label: "label" }, host: { classAttribute: "clr-wizard-stepnav" }, viewQueries: [{ propertyName: "stepnavItems", predicate: ClrWizardStepnavItem, descendants: true }], ngImport: i0, template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-left"
        (click)="scrollLeft()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="left"></cds-icon>
      </button>
    }

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton,
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-right"
        (click)="scrollRight()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="right"></cds-icon>
      </button>
    }
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: ClrWizardStepnavItem, selector: "[clr-wizard-stepnav-item]", inputs: ["page"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardStepnav, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-wizard-stepnav',
                    template: `
    @if (showScrollLeftButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-left"
        (click)="scrollLeft()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="left"></cds-icon>
      </button>
    }

    <nav
      class="clr-wizard-stepnav-nav"
      [ngClass]="{
        'clr-wizard-stepnav-nav--with-one-scroll-button': showScrollLeftButton || showScrollRightButton,
        'clr-wizard-stepnav-nav--with-two-scroll-buttons': showScrollLeftButton && showScrollRightButton,
      }"
      [attr.aria-label]="label"
    >
      <ol class="clr-wizard-stepnav-list">
        @for (page of pageService.pages; track page; let i = $index) {
          <li clr-wizard-stepnav-item [page]="page" class="clr-wizard-stepnav-item">
            {{ i + 1 }}
          </li>
        }
      </ol>
    </nav>

    @if (showScrollRightButton && stepnavLayout === 'horizontal') {
      <button
        type="button"
        class="btn btn-sm btn-icon clr-wizard-stepnav-scroll-button-right"
        (click)="scrollRight()"
        tabindex="-1"
      >
        <cds-icon shape="angle" direction="right"></cds-icon>
      </button>
    }
  `,
                    host: { class: 'clr-wizard-stepnav' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: PageCollectionService }, { type: WizardNavigationService }, { type: i0.ElementRef }], propDecorators: { label: [{
                type: Input
            }], stepnavItems: [{
                type: ViewChildren,
                args: [ClrWizardStepnavItem]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrWizard {
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
         * Set the wizard stepnav layout to 'vertical' (default) or 'horizontal'. Set using `[clrWizardStepnavLayout]` input.
         */
        this.stepnavLayout = ClrWizardStepnavLayout.VERTICAL;
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
         * Hide the wizard footer entirely. Set using `[clrWizardHideFooter]` input.
         * Useful when a nested wizard or stepper handles its own navigation.
         */
        this.hideFooter = false;
        /**
         * Align the footer buttons to 'start' (left) or 'end' (right).
         * By default, modal wizards align to 'end' and in-page wizards align to 'start'.
         * Nested wizards inherit the default unless this input is explicitly set.
         * Set using `[clrWizardFooterAlign]` input.
         */
        this._footerAlign = null;
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
         * Emits when the current page has changed. Listen via `(clrWizardCurrentPageChange)` event.
         * output. Useful for non-blocking validation.
         */
        this.currentPageChange = new EventEmitter(false);
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
        this.ClrWizardFooterAlign = ClrWizardFooterAlign;
        this.ClrWizardStepnavLayout = ClrWizardStepnavLayout;
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
    get showHeader() {
        return (!!this.navService.currentPage?.pageTitle ||
            (this.stepnavLayout === ClrWizardStepnavLayout.VERTICAL && this.headerActionService.displayHeaderActionsWrapper));
    }
    get showFooter() {
        return !this.hideFooter && (this.navService.currentPage?.hasButtons || this.wizardButtons?.length > 0);
    }
    get footerAlign() {
        if (this._footerAlign !== null) {
            return this._footerAlign;
        }
        return this.inPage ? ClrWizardFooterAlign.START : ClrWizardFooterAlign.END;
    }
    get stopModalAnimations() {
        return this._stopModalAnimations;
    }
    ngAfterContentInit() {
        this.navService.stepnavLayout = this.stepnavLayout;
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
        return this.navService.currentPageChange.subscribe(() => {
            // Added to address VPAT-749:
            //   When clicking on a wizard tab, focus should move to that
            //   tabs content to make the wizard more accessible.
            this.pageTitle?.nativeElement.focus();
            this.currentPageChange.emit();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizard, deps: [{ token: PLATFORM_ID }, { token: i3.ClrCommonStringsService }, { token: WizardNavigationService }, { token: PageCollectionService }, { token: ButtonHubService }, { token: HeaderActionService }, { token: i0.ElementRef }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrWizard, isStandalone: false, selector: "clr-wizard", inputs: { stepnavAriaLabel: ["clrWizardStepnavAriaLabel", "stepnavAriaLabel"], stepnavLayout: ["clrWizardStepnavLayout", "stepnavLayout", stepnavLayoutAttribute], size: ["clrWizardSize", "size"], inPage: ["clrWizardInPage", "inPage"], inPageFillContentArea: ["clrWizardInPageFillContentArea", "inPageFillContentArea"], hideFooter: ["clrWizardHideFooter", "hideFooter"], _footerAlign: ["clrWizardFooterAlign", "_footerAlign", footerAlignAttribute], closable: ["clrWizardClosable", "closable"], _stopModalAnimations: ["clrWizardPreventModalAnimation", "_stopModalAnimations"], forceForward: ["clrWizardForceForwardNavigation", "forceForward"], clrWizardOpen: "clrWizardOpen", stopNext: ["clrWizardPreventDefaultNext", "stopNext"], stopCancel: ["clrWizardPreventDefaultCancel", "stopCancel"], stopNavigation: ["clrWizardPreventNavigation", "stopNavigation"], disableStepnav: ["clrWizardDisableStepnav", "disableStepnav"] }, outputs: { _openChanged: "clrWizardOpenChange", onCancel: "clrWizardOnCancel", wizardFinished: "clrWizardOnFinish", onReset: "clrWizardOnReset", currentPageChange: "clrWizardCurrentPageChange", onMoveNext: "clrWizardOnNext", onMovePrevious: "clrWizardOnPrevious" }, host: { properties: { "class.clr-wizard": "true", "class.wizard-md": "size == 'md'", "class.wizard-lg": "size == 'lg'", "class.wizard-xl": "size == 'xl'", "class.wizard-in-page": "inPage", "class.wizard-in-page--fill-content-area": "inPage && inPageFillContentArea", "class.wizard-horizontal": "stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL" } }, providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], queries: [{ propertyName: "wizardTitle", first: true, predicate: ClrWizardTitle, descendants: true }, { propertyName: "pages", predicate: ClrWizardPage }, { propertyName: "wizardButtons", predicate: ClrWizardButton }, { propertyName: "headerActions", predicate: ClrWizardHeaderAction }], viewQueries: [{ propertyName: "pageTitle", first: true, predicate: ["pageTitle"], descendants: true }, { propertyName: "bodyElementRef", first: true, predicate: ["body"], descendants: true }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-template #coreWizardContent>\n  <div class=\"clr-wizard-content-wrapper\">\n    @if (stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {\n    <div class=\"clr-wizard-title-wrapper\">\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n    </div>\n    }\n\n    <div class=\"clr-wizard-stepnav-wrapper\" role=\"region\">\n      @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      }\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"clr-wizard-main-content\">\n      @if (showHeader) {\n      <div class=\"clr-wizard-header\">\n        @if (navService.currentPage?.pageTitle) {\n        <div class=\"clr-wizard-page-title-wrapper\" cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"clr-wizard-page-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"clr-wizard-page-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        } @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n        <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n        }\n      </div>\n      }\n\n      <div #body class=\"clr-wizard-body-wrapper\">\n        <div class=\"clr-wizard-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n\n      @if (showFooter) {\n      <div class=\"clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            class=\"clr-wizard-footer-buttons-wrapper\"\n            [ngClass]=\"{'align-start': footerAlign === ClrWizardFooterAlign.START, 'align-end': footerAlign === ClrWizardFooterAlign.END}\"\n          >\n            @if (navService.currentPage?.hasButtons) {\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n            } @else {\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n            }\n          </div>\n        </div>\n      </div>\n      }\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #wizardTitleTemplate>\n  <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n    <ng-content select=\"clr-wizard-title\"></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #wizardActionsTemplate>\n  @if (headerActionService.displayHeaderActionsWrapper) {\n  <div class=\"clr-wizard-header-actions-wrapper\">\n    @if (headerActionService.showWizardHeaderActions) {\n    <ng-content select=\"clr-wizard-header-action\"></ng-content>\n    } @if (headerActionService.currentPageHasHeaderActions) {\n    <ng-template [ngTemplateOutlet]=\"navService.currentPage?.headerActions\"></ng-template>\n    }\n  </div>\n  } @if (closable && !inPage) {\n  <button type=\"button\" class=\"close\" [attr.aria-label]=\"commonStrings.keys.close\" (click)=\"modalCancel()\">\n    <cds-icon shape=\"window-close\"></cds-icon>\n  </button>\n  }\n</ng-template>\n\n@if (inPage) {\n<ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n} @else {\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <ng-template #clrInternalModalContentTemplate>\n    <ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n  </ng-template>\n</clr-modal>\n}\n", dependencies: [{ kind: "directive", type: i6.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i8.ClrModal, selector: "clr-modal", inputs: ["clrModalOpen", "clrModalClosable", "clrModalCloseButtonAriaLabel", "clrModalSize", "clrModalStaticBackdrop", "clrModalSkipAnimation", "clrModalPreventClose", "clrModalLabelledById", "clrModalOverrideScrollService"], outputs: ["clrModalOpenChange", "clrModalAlternateClose"] }, { kind: "component", type: ClrWizardStepnav, selector: "clr-wizard-stepnav", inputs: ["label"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-wizard', providers: [WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService], host: {
                        '[class.clr-wizard]': 'true',
                        '[class.wizard-md]': "size == 'md'",
                        '[class.wizard-lg]': "size == 'lg'",
                        '[class.wizard-xl]': "size == 'xl'",
                        '[class.wizard-in-page]': 'inPage',
                        '[class.wizard-in-page--fill-content-area]': 'inPage && inPageFillContentArea',
                        '[class.wizard-horizontal]': 'stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL',
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-template #coreWizardContent>\n  <div class=\"clr-wizard-content-wrapper\">\n    @if (stepnavLayout === ClrWizardStepnavLayout.HORIZONTAL) {\n    <div class=\"clr-wizard-title-wrapper\">\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n    </div>\n    }\n\n    <div class=\"clr-wizard-stepnav-wrapper\" role=\"region\">\n      @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n      <ng-container [ngTemplateOutlet]=\"wizardTitleTemplate\"></ng-container>\n      }\n      <clr-wizard-stepnav [label]=\"stepnavAriaLabel\"></clr-wizard-stepnav>\n    </div>\n\n    <div class=\"clr-wizard-main-content\">\n      @if (showHeader) {\n      <div class=\"clr-wizard-header\">\n        @if (navService.currentPage?.pageTitle) {\n        <div class=\"clr-wizard-page-title-wrapper\" cdkFocusInitial tabindex=\"-1\">\n          <div\n            class=\"clr-wizard-page-title\"\n            role=\"heading\"\n            [attr.aria-level]=\"navService.currentPage?.pageTitle?.headingLevel || 2\"\n          >\n            <span tabindex=\"-1\" #pageTitle class=\"clr-wizard-page-title-text\">\n              <ng-template [ngTemplateOutlet]=\"navService.currentPageTitle\"></ng-template>\n            </span>\n          </div>\n        </div>\n        } @if (stepnavLayout === ClrWizardStepnavLayout.VERTICAL) {\n        <ng-container [ngTemplateOutlet]=\"wizardActionsTemplate\"></ng-container>\n        }\n      </div>\n      }\n\n      <div #body class=\"clr-wizard-body-wrapper\">\n        <div class=\"clr-wizard-body\">\n          <main clr-wizard-pages-wrapper class=\"clr-wizard-content\">\n            <ng-content></ng-content>\n          </main>\n        </div>\n      </div>\n\n      @if (showFooter) {\n      <div class=\"clr-wizard-footer\">\n        <div class=\"clr-wizard-footer-buttons\">\n          <div\n            class=\"clr-wizard-footer-buttons-wrapper\"\n            [ngClass]=\"{'align-start': footerAlign === ClrWizardFooterAlign.START, 'align-end': footerAlign === ClrWizardFooterAlign.END}\"\n          >\n            @if (navService.currentPage?.hasButtons) {\n            <ng-template [ngTemplateOutlet]=\"navService.currentPage.buttons\"></ng-template>\n            } @else {\n            <ng-content select=\"clr-wizard-button\"></ng-content>\n            }\n          </div>\n        </div>\n      </div>\n      }\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #wizardTitleTemplate>\n  <div class=\"clr-wizard-title\" [id]=\"wizardId\" role=\"heading\" [attr.aria-level]=\"wizardTitle?.headingLevel || 1\">\n    <ng-content select=\"clr-wizard-title\"></ng-content>\n  </div>\n</ng-template>\n\n<ng-template #wizardActionsTemplate>\n  @if (headerActionService.displayHeaderActionsWrapper) {\n  <div class=\"clr-wizard-header-actions-wrapper\">\n    @if (headerActionService.showWizardHeaderActions) {\n    <ng-content select=\"clr-wizard-header-action\"></ng-content>\n    } @if (headerActionService.currentPageHasHeaderActions) {\n    <ng-template [ngTemplateOutlet]=\"navService.currentPage?.headerActions\"></ng-template>\n    }\n  </div>\n  } @if (closable && !inPage) {\n  <button type=\"button\" class=\"close\" [attr.aria-label]=\"commonStrings.keys.close\" (click)=\"modalCancel()\">\n    <cds-icon shape=\"window-close\"></cds-icon>\n  </button>\n  }\n</ng-template>\n\n@if (inPage) {\n<ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n} @else {\n<clr-modal\n  [clrModalOpen]=\"_open\"\n  [clrModalSize]=\"size\"\n  [clrModalClosable]=\"closable\"\n  [clrModalStaticBackdrop]=\"true\"\n  [clrModalSkipAnimation]=\"stopModalAnimations\"\n  [clrModalOverrideScrollService]=\"isInline\"\n  [clrModalPreventClose]=\"true\"\n  (clrModalAlternateClose)=\"modalCancel()\"\n  [clrModalLabelledById]=\"wizardId\"\n>\n  <ng-template #clrInternalModalContentTemplate>\n    <ng-container [ngTemplateOutlet]=\"coreWizardContent\"></ng-container>\n  </ng-template>\n</clr-modal>\n}\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i3.ClrCommonStringsService }, { type: WizardNavigationService }, { type: PageCollectionService }, { type: ButtonHubService }, { type: HeaderActionService }, { type: i0.ElementRef }, { type: i0.IterableDiffers }], propDecorators: { stepnavAriaLabel: [{
                type: Input,
                args: ['clrWizardStepnavAriaLabel']
            }], stepnavLayout: [{
                type: Input,
                args: [{ alias: 'clrWizardStepnavLayout', transform: stepnavLayoutAttribute }]
            }], size: [{
                type: Input,
                args: ['clrWizardSize']
            }], inPage: [{
                type: Input,
                args: ['clrWizardInPage']
            }], inPageFillContentArea: [{
                type: Input,
                args: ['clrWizardInPageFillContentArea']
            }], hideFooter: [{
                type: Input,
                args: ['clrWizardHideFooter']
            }], _footerAlign: [{
                type: Input,
                args: [{ alias: 'clrWizardFooterAlign', transform: footerAlignAttribute }]
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
            }], currentPageChange: [{
                type: Output,
                args: ['clrWizardCurrentPageChange']
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
                args: [ClrWizardPage]
            }], wizardButtons: [{
                type: ContentChildren,
                args: [ClrWizardButton, { descendants: false }]
            }], headerActions: [{
                type: ContentChildren,
                args: [ClrWizardHeaderAction]
            }], wizardTitle: [{
                type: ContentChild,
                args: [ClrWizardTitle]
            }], bodyElementRef: [{
                type: ViewChild,
                args: ['body']
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_WIZARD_DIRECTIVES = [
    ClrWizard,
    ClrWizardPage,
    ClrWizardStepnav,
    ClrWizardStepnavItem,
    ClrWizardButton,
    ClrWizardHeaderAction,
    ClrWizardTitle,
    ClrWizardPageTitle,
    ClrWizardPageNavTitle,
    ClrWizardPageButtons,
    ClrWizardPageHeaderActions,
];
class ClrWizardModule {
    constructor() {
        ClarityIcons.addIcons(errorStandardIcon, successStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardModule, declarations: [ClrWizard,
            ClrWizardPage,
            ClrWizardStepnav,
            ClrWizardStepnavItem,
            ClrWizardButton,
            ClrWizardHeaderAction,
            ClrWizardTitle,
            ClrWizardPageTitle,
            ClrWizardPageNavTitle,
            ClrWizardPageButtons,
            ClrWizardPageHeaderActions], imports: [CommonModule, ClrIcon, ClrModalModule, ClrAlertModule], exports: [ClrWizard,
            ClrWizardPage,
            ClrWizardStepnav,
            ClrWizardStepnavItem,
            ClrWizardButton,
            ClrWizardHeaderAction,
            ClrWizardTitle,
            ClrWizardPageTitle,
            ClrWizardPageNavTitle,
            ClrWizardPageButtons,
            ClrWizardPageHeaderActions] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardModule, imports: [CommonModule, ClrIcon, ClrModalModule, ClrAlertModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrWizardModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrModalModule, ClrAlertModule],
                    declarations: [CLR_WIZARD_DIRECTIVES],
                    exports: [CLR_WIZARD_DIRECTIVES],
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

export { CLR_WIZARD_DIRECTIVES, CUSTOM_BUTTON_TYPES, ClrWizard, ClrWizardButton, ClrWizardFooterAlign, ClrWizardHeaderAction, ClrWizardModule, ClrWizardPage, ClrWizardPageButtons, ClrWizardPageHeaderActions, ClrWizardPageNavTitle, ClrWizardPageTitle, ClrWizardStepnav, ClrWizardStepnavItem, ClrWizardStepnavLayout, ClrWizardTitle, DEFAULT_BUTTON_TYPES, footerAlignAttribute, stepnavLayoutAttribute };
//# sourceMappingURL=clr-angular-wizard.mjs.map
