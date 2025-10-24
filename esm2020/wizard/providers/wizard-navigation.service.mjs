/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./page-collection.service";
import * as i2 from "./button-hub.service";
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
export class WizardNavigationService {
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
    get currentPageChanged() {
        // TODO: MAKE SURE EXTERNAL OUTPUTS SAY 'CHANGE' NOT 'CHANGED'
        // A BREAKING CHANGE SO AWAITING MINOR RELEASE
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
}
WizardNavigationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WizardNavigationService, deps: [{ token: i1.PageCollectionService }, { token: i2.ButtonHubService }], target: i0.ɵɵFactoryTarget.Injectable });
WizardNavigationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WizardNavigationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WizardNavigationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.PageCollectionService }, { type: i2.ButtonHubService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLW5hdmlnYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC9wcm92aWRlcnMvd2l6YXJkLW5hdmlnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQTBCLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFPM0M7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUVILE1BQU0sT0FBTyx1QkFBdUI7SUFvSmxDOzs7Ozs7O09BT0c7SUFDSCxZQUFtQixjQUFxQyxFQUFTLGFBQStCO1FBQTdFLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQXBHaEc7Ozs7O1dBS0c7UUFDSCxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFFekI7Ozs7Ozs7Ozs7V0FVRztRQUNILDJCQUFzQixHQUFHLEtBQUssQ0FBQztRQUUvQjs7Ozs7OztXQU9HO1FBQ0gsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBRTNCOzs7Ozs7O1dBT0c7UUFDSCxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFFekI7Ozs7Ozs7OztXQVNHO1FBQ0gseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBRTdCOzs7OztXQUtHO1FBQ0gseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBTzdCOzs7V0FHRztRQUNLLG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQWlCLENBQUM7UUFFdkQ7O1dBRUc7UUFDSyxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRWxEOztXQUVHO1FBQ0ssb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRTlDOztXQUVHO1FBQ0sseUJBQW9CLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztR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QUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFNUMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRixJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDN0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7U0FDakM7SUFDSCxDQUFDOztvSEExcEJVLHVCQUF1Qjt3SEFBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUsIE9uRGVzdHJveSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJXaXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkLXBhZ2UnO1xuaW1wb3J0IHsgQnV0dG9uSHViU2VydmljZSB9IGZyb20gJy4vYnV0dG9uLWh1Yi5zZXJ2aWNlJztcbmltcG9ydCB7IFBhZ2VDb2xsZWN0aW9uU2VydmljZSB9IGZyb20gJy4vcGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UnO1xuXG4vKipcbiAqIFBlcmZvcm1zIG5hdmlnYXRpb24gZnVuY3Rpb25zIGZvciBhIHdpemFyZCBhbmQgbWFuYWdlcyB0aGUgY3VycmVudCBwYWdlLiBQcmVzZW50ZWQgYXMgYVxuICogc2VwYXJhdGUgc2VydmljZSB0byBlbmNhcHN1bGF0ZSB0aGUgYmVoYXZpb3Igb2YgbmF2aWdhdGluZyBhbmQgY29tcGxldGluZyB0aGUgd2l6YXJkIHNvXG4gKiB0aGF0IGl0IGNhbiBiZSBzaGFyZWQgYWNyb3NzIHRoZSB3aXphcmQgYW5kIGl0cyBzdWItY29tcG9uZW50cy5cbiAqXG4gKiBUaGUgZWFzaWVzdCB3YXkgdG8gYWNjZXNzIHRoZSBuYXZpZ2F0aW9uIHNlcnZpY2UgaXMgdGhlcmUgYSByZWZlcmVuY2Ugb24geW91ciB3aXphcmQuIFRoZVxuICogRm9sbG93aW5nIGV4YW1wbGUgd291bGQgYWxsb3cgeW91IHRvIGFjY2VzcyB5b3VyIGluc3RhbmNlIG9mIHRoZSB3aXphcmQgZnJvbSB5b3VyIGhvc3RcbiAqIGNvbXBvbmVudCBhbmQgdGhlcmVieSBhY2Nlc3MgdGhlIG5hdmlnYXRpb24gc2VydmljZSB2aWEgWW91ckhvc3RDb21wb25lbnQud2l6YXJkLm5hdlNlcnZpY2UuXG4gKlxuICogQGV4YW1wbGVcbiAqIDxjbHItd2l6YXJkICN3aXphcmQgLi4uPlxuICpcbiAqIEBleGFtcGxlXG4gKiBleHBvcnQgY2xhc3MgWW91ckhvc3RDb21wb25lbnQge1xuICogICBAVmlld0NoaWxkKFwid2l6YXJkXCIpIHdpemFyZDogV2l6YXJkO1xuICogICAuLi5cbiAqIH1cbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBXaXphcmROYXZpZ2F0aW9uU2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBJcyBub3RpZmllZCB3aGVuIGEgcHJldmlvdXMgYnV0dG9uIGlzIGNsaWNrZWQgaW4gdGhlIHdpemFyZC4gUGVyZm9ybXMgY2hlY2tzXG4gICAqIGJlZm9yZSBhbGVydGluZyB0aGUgY3VycmVudCBwYWdlIG9mIHRoZSBidXR0b24gY2xpY2suIEVuYWN0cyBuYXZpZ2F0aW9uIHRvXG4gICAqIHRoZSBwcmV2aW91cyBwYWdlIGlmIG5vdCBvdmVycmlkZGVuIGF0IHRoZSBwYWdlIGxldmVsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHByZXZpb3VzQnV0dG9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIElzIG5vdGlmaWVkIHdoZW4gYSBOZXh0IGJ1dHRvbiBpcyBjbGlja2VkIGluIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgbmV4dEJ1dHRvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBJcyBub3RpZmllZCB3aGVuIGEgZGFuZ2VyIGJ1dHRvbiBpcyBjbGlja2VkIGluIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZGFuZ2VyQnV0dG9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIElzIG5vdGlmaWVkIHdoZW4gYSAgZmluaXNoIGJ1dHRvbiBpcyBjbGlja2VkIGluIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZmluaXNoQnV0dG9uU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIElzIG5vdGlmaWVkIHdoZW4gYSBDdXN0b20gYnV0dG9uIGlzIGNsaWNrZWQgaW4gdGhlIHdpemFyZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBjdXN0b21CdXR0b25TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogSXMgbm90aWZpZWQgd2hlbiBhIENhbmNlbCBidXR0b24gaXMgY2xpY2tlZCBpbiB0aGUgd2l6YXJkLiBOb3RpZmllcyB0aGUgd2l6YXJkLFxuICAgKiB3aGljaCBoYW5kbGVzIGFsbCBjYW5jZWwgZnVuY3Rpb25hbGl0eSwgaWYgY2FuY2VsIGlzIG5vdCBvdmVycmlkZGVuIGF0IHRoZSBwYWdlXG4gICAqIGxldmVsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIGNhbmNlbEJ1dHRvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgbmF2aWdhdGlvbiB0byBtYWtlIHRoZSBmaXJzdCBwYWdlIGN1cnJlbnQgd2hlbiB0aGUgcGFnZSBjb2xsZWN0aW9uIHNlcnZpY2VcbiAgICogZW1pdHMgYW4gZXZlbnQgbm90aWZ5aW5nIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlIHRoYXQgaXQgaGFzIHJlc2V0IGFsbCBwYWdlc1xuICAgKiB0byB0aGVpciBwcmlzdGluZSwgaW5jb21wbGV0ZSBzdGF0ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBwYWdlc1Jlc2V0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEEgQm9vbGVhbiBmbGFnIHVzZWQgYnkgdGhlIENscldpemFyZFBhZ2UgdG8gYXZvaWQgYSByYWNlIGNvbmRpdGlvbiB3aGVuIHBhZ2VzIGFyZVxuICAgKiBsb2FkaW5nIGFuZCB0aGVyZSBpcyBubyBjdXJyZW50IHBhZ2UgZGVmaW5lZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBuYXZTZXJ2aWNlTG9hZGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBmbGFnIHNoYXJlZCBhY3Jvc3MgdGhlIFdpemFyZCBzdWJjb21wb25lbnRzIHRoYXQgZm9sbG93cyB0aGUgdmFsdWVcbiAgICogb2YgdGhlIFdpemFyZC5mb3JjZUZvcndhcmQgKGNscldpemFyZEZvcmNlRm9yd2FyZE5hdmlnYXRpb24pIGlucHV0LiBXaGVuIHRydWUsXG4gICAqIG5hdmlnYXRpbmcgYmFja3dhcmRzIGluIHRoZSBzdGVwbmF2IG1lbnUgd2lsbCByZXNldCBhbnkgc2tpcHBlZCBwYWdlcycgY29tcGxldGVkXG4gICAqIHN0YXRlIHRvIGZhbHNlLlxuICAgKlxuICAgKiBUaGlzIGlzIHVzZWZ1bCB3aGVuIGEgd2l6YXJkIGV4ZWN1dGVzIHZhbGlkYXRpb24gb24gYSBwYWdlLWJ5LXBhZ2UgYmFzaXMgd2hlblxuICAgKiB0aGUgbmV4dCBidXR0b24gaXMgY2xpY2tlZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBmb3JjZUZvcndhcmROYXZpZ2F0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBmbGFnIHNoYXJlZCBhY3Jvc3MgdGhlIFdpemFyZCBzdWJjb21wb25lbnRzIHRoYXQgZm9sbG93cyB0aGUgdmFsdWVcbiAgICogb2YgdGhlIFdpemFyZC5zdG9wQ2FuY2VsIChjbHJXaXphcmRQcmV2ZW50RGVmYXVsdENhbmNlbCkgaW5wdXQuIFdoZW4gdHJ1ZSwgdGhlIGNhbmNlbFxuICAgKiByb3V0aW5lIGlzIHN1YnZlcnRlZCBhbmQgbXVzdCBiZSByZWluc3RhdGVkIGluIHRoZSBob3N0IGNvbXBvbmVudCBjYWxsaW5nIFdpemFyZC5jbG9zZSgpXG4gICAqIGF0IHNvbWUgcG9pbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgd2l6YXJkSGFzQWx0Q2FuY2VsID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiBmbGFnIHNoYXJlZCBhY3Jvc3MgdGhlIFdpemFyZCBzdWJjb21wb25lbnRzIHRoYXQgZm9sbG93cyB0aGUgdmFsdWVcbiAgICogb2YgdGhlIFdpemFyZC5zdG9wTmV4dCAoY2xyV2l6YXJkUHJldmVudERlZmF1bHROZXh0KSBpbnB1dC4gV2hlbiB0cnVlLCB0aGUgbmV4dCBhbmQgZmluaXNoXG4gICAqIHJvdXRpbmVzIGFyZSBzdWJ2ZXJ0ZWQgYW5kIG11c3QgYmUgcmVpbnN0YXRlZCBpbiB0aGUgaG9zdCBjb21wb25lbnQgY2FsbGluZyBXaXphcmQubmV4dCgpLFxuICAgKiBXaXphcmQuZm9yY2VOZXh0KCksIFdpemFyZC5maW5pc2goKSwgb3IgV2l6YXJkLmZvcmNlRmluaXNoKCkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgd2l6YXJkSGFzQWx0TmV4dCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4gZmxhZyBzaGFyZWQgYWNyb3NzIHRoZSBXaXphcmQgc3ViY29tcG9uZW50cyB0aGF0IGZvbGxvd3MgdGhlIHZhbHVlXG4gICAqIG9mIHRoZSBXaXphcmQuc3RvcE5hdmlnYXRpb24gKGNscldpemFyZFByZXZlbnROYXZpZ2F0aW9uKSBpbnB1dC4gV2hlbiB0cnVlLCBhbGxcbiAgICogbmF2aWdhdGlvbmFsIGVsZW1lbnRzIGluIHRoZSB3aXphcmQgYXJlIGRpc2FibGVkLlxuICAgKlxuICAgKiBUaGlzIGlzIGludGVuZGVkIHRvIGZyZWV6ZSB0aGUgd2l6YXJkIGluIHBsYWNlLiBFdmVudHMgYXJlIG5vdCBmaXJlZCBzbyB0aGlzIGlzXG4gICAqIG5vdCBhIHdheSB0byBpbXBsZW1lbnQgYWx0ZXJuYXRlIGZ1bmN0aW9uYWxpdHkgZm9yIG5hdmlnYXRpb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgd2l6YXJkU3RvcE5hdmlnYXRpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBib29sZWFuIGZsYWcgc2hhcmVkIHdpdGggdGhlIHN0ZXBuYXYgaXRlbXMgdGhhdCBwcmV2ZW50cyB1c2VyIGNsaWNrcyBvblxuICAgKiBzdGVwbmF2IGl0ZW1zIGZyb20gbmF2aWdhdGluZyB0aGUgd2l6YXJkLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHdpemFyZERpc2FibGVTdGVwbmF2ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgcHJpdmF0ZSBfY3VycmVudFBhZ2U6IENscldpemFyZFBhZ2U7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgcHJpdmF0ZSBfY3VycmVudENoYW5nZWQgPSBuZXcgU3ViamVjdDxDbHJXaXphcmRQYWdlPigpO1xuXG4gIC8qKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHByaXZhdGUgX21vdmVkVG9OZXh0UGFnZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgcHJpdmF0ZSBfd2l6YXJkRmluaXNoZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHByaXZhdGUgX21vdmVkVG9QcmV2aW91c1BhZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHByaXZhdGUgX2NhbmNlbFdpemFyZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UuIEFsc28gc2V0cyB1cCBzdWJzY3JpcHRpb25zXG4gICAqIHRoYXQgbGlzdGVuIHRvIHRoZSBidXR0b24gc2VydmljZSB0byBkZXRlcm1pbmUgd2hlbiBhIGJ1dHRvbiBoYXMgYmVlbiBjbGlja2VkXG4gICAqIGluIHRoZSB3aXphcmQuIElzIGFsc28gcmVzcG9uc2libGUgZm9yIHRha2luZyBhY3Rpb24gd2hlbiB0aGUgcGFnZSBjb2xsZWN0aW9uXG4gICAqIHJlcXVlc3RzIHRoYXQgbmF2aWdhdGlvbiBiZSByZXNldCB0byBpdHMgcHJpc3RpbmUgc3RhdGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIHBhZ2VDb2xsZWN0aW9uOiBQYWdlQ29sbGVjdGlvblNlcnZpY2UsIHB1YmxpYyBidXR0b25TZXJ2aWNlOiBCdXR0b25IdWJTZXJ2aWNlKSB7XG4gICAgdGhpcy5wcmV2aW91c0J1dHRvblN1YnNjcmlwdGlvbiA9IGJ1dHRvblNlcnZpY2UucHJldmlvdXNCdG5DbGlja2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50UGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XG4gICAgICBpZiAodGhpcy5jdXJyZW50UGFnZUlzRmlyc3QgfHwgY3VycmVudFBhZ2UucHJldmlvdXNTdGVwRGlzYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY3VycmVudFBhZ2UucHJldmlvdXNCdXR0b25DbGlja2VkLmVtaXQoY3VycmVudFBhZ2UpO1xuICAgICAgaWYgKCFjdXJyZW50UGFnZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICB0aGlzLnByZXZpb3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm5leHRCdXR0b25TdWJzY3JpcHRpb24gPSBidXR0b25TZXJ2aWNlLm5leHRCdG5DbGlja2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNoZWNrQW5kQ29tbWl0Q3VycmVudFBhZ2UoJ25leHQnKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGFuZ2VyQnV0dG9uU3Vic2NyaXB0aW9uID0gYnV0dG9uU2VydmljZS5kYW5nZXJCdG5DbGlja2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNoZWNrQW5kQ29tbWl0Q3VycmVudFBhZ2UoJ2RhbmdlcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5maW5pc2hCdXR0b25TdWJzY3JpcHRpb24gPSBidXR0b25TZXJ2aWNlLmZpbmlzaEJ0bkNsaWNrZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY2hlY2tBbmRDb21taXRDdXJyZW50UGFnZSgnZmluaXNoJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmN1c3RvbUJ1dHRvblN1YnNjcmlwdGlvbiA9IGJ1dHRvblNlcnZpY2UuY3VzdG9tQnRuQ2xpY2tlZC5zdWJzY3JpYmUoKHR5cGU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKCF0aGlzLndpemFyZFN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UuY3VzdG9tQnV0dG9uQ2xpY2tlZC5lbWl0KHR5cGUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jYW5jZWxCdXR0b25TdWJzY3JpcHRpb24gPSBidXR0b25TZXJ2aWNlLmNhbmNlbEJ0bkNsaWNrZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLndpemFyZFN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZS5wYWdlT25DYW5jZWwuZW1pdCh0aGlzLmN1cnJlbnRQYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnBhZ2VzUmVzZXRTdWJzY3JpcHRpb24gPSBwYWdlQ29sbGVjdGlvbi5wYWdlc1Jlc2V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldEZpcnN0UGFnZUN1cnJlbnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBPYnNlcnZhYmxlIHRoYXQgaXMgcHJlZG9taW5hbnRseSB1c2VkIGFtb25nc3QgdGhlIHN1YmNvbXBvbmVudHMgYW5kIHNlcnZpY2VzXG4gICAqIG9mIHRoZSB3aXphcmQuIEl0IGlzIHJlY29tbWVuZGVkIHRoYXQgdXNlcnMgbGlzdGVuIHRvIHRoZSBDbHJXaXphcmRQYWdlLm9uTG9hZFxuICAgKiAoY2xyV2l6YXJkUGFnZU9uTG9hZCkgb3V0cHV0IGluc3RlYWQgb2YgdGhpcyBPYnNlcnZhYmxlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIGdldCBjdXJyZW50UGFnZUNoYW5nZWQoKTogT2JzZXJ2YWJsZTxDbHJXaXphcmRQYWdlPiB7XG4gICAgLy8gVE9ETzogTUFLRSBTVVJFIEVYVEVSTkFMIE9VVFBVVFMgU0FZICdDSEFOR0UnIE5PVCAnQ0hBTkdFRCdcbiAgICAvLyBBIEJSRUFLSU5HIENIQU5HRSBTTyBBV0FJVElORyBNSU5PUiBSRUxFQVNFXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRQYWdlVGl0bGUoKTogVGVtcGxhdGVSZWY8YW55PiB7XG4gICAgLy8gd2hlbiB0aGUgcXVlcnlsaXN0IG9mIHBhZ2VzIGlzIGVtcHR5LiB0aGlzIGlzIHRoZSBmaXJzdCBwbGFjZSBpdCBmYWlscy4uLlxuICAgIGlmICghdGhpcy5jdXJyZW50UGFnZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlLnRpdGxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBCb29sZWFuIHRoYXQgdGVsbHMgeW91IHdoZXRoZXIgb3Igbm90IHRoZSBjdXJyZW50IHBhZ2UgaXMgdGhlIGZpcnN0XG4gICAqIHBhZ2UgaW4gdGhlIFdpemFyZC5cbiAgICpcbiAgICogVGhpcyBpcyBoZWxwZnVsIGZvciBkZXRlcm1pbmluZyB3aGV0aGVyIGEgcGFnZSBpcyBuYXZpZ2FibGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IGN1cnJlbnRQYWdlSXNGaXJzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlQ29sbGVjdGlvbi5maXJzdFBhZ2UgPT09IHRoaXMuY3VycmVudFBhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEJvb2xlYW4gdGhhdCB0ZWxscyB5b3Ugd2hldGhlciBvciBub3QgdGhlIGN1cnJlbnQgcGFnZSBpcyB0aGVcbiAgICogbGFzdCBwYWdlIGluIHRoZSBXaXphcmQuXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hpY2ggYnV0dG9ucyBzaG91bGQgZGlzcGxheSBpbiB0aGUgd2l6YXJkIGZvb3Rlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBnZXQgY3VycmVudFBhZ2VJc0xhc3QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFnZUNvbGxlY3Rpb24ubGFzdFBhZ2UgPT09IHRoaXMuY3VycmVudFBhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgQ2xyV2l6YXJkUGFnZSBvYmplY3Qgb2YgdGhlIGN1cnJlbnQgcGFnZSBvciBudWxsLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIGdldCBjdXJyZW50UGFnZSgpOiBDbHJXaXphcmRQYWdlIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRQYWdlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgYSBDbHJXaXphcmRQYWdlIG9iamVjdCwgc2luY2UgdGhhdCBvYmplY3QgdG8gYmUgdGhlIGN1cnJlbnQvYWN0aXZlXG4gICAqIHBhZ2UgaW4gdGhlIHdpemFyZCwgYW5kIGVtaXRzIHRoZSBDbHJXaXphcmRQYWdlLm9uTG9hZCAoY2xyV2l6YXJkUGFnZU9uTG9hZClcbiAgICogZXZlbnQgZm9yIHRoYXQgcGFnZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IGFsbCBvZiB0aGlzIHdvcmsgaXMgYnlwYXNzZWQgaWYgdGhlIENscldpemFyZFBhZ2Ugb2JqZWN0IGlzIGFscmVhZHlcbiAgICogdGhlIGN1cnJlbnQgcGFnZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBzZXQgY3VycmVudFBhZ2UocGFnZTogQ2xyV2l6YXJkUGFnZSkge1xuICAgIGlmICh0aGlzLl9jdXJyZW50UGFnZSAhPT0gcGFnZSAmJiAhdGhpcy53aXphcmRTdG9wTmF2aWdhdGlvbikge1xuICAgICAgdGhpcy5fY3VycmVudFBhZ2UgPSBwYWdlO1xuICAgICAgcGFnZS5vbkxvYWQuZW1pdChwYWdlLmlkKTtcbiAgICAgIHRoaXMuX2N1cnJlbnRDaGFuZ2VkLm5leHQocGFnZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdXNlZCBpbnRlcm5hbGx5IHRvIGFsZXJ0IHRoZSB3aXphcmQgdGhhdCBmb3J3YXJkIG5hdmlnYXRpb25cbiAgICogaGFzIG9jY3VycmVkLiBJdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSB1c2UgdGhlIFdpemFyZC5vbk1vdmVOZXh0XG4gICAqIChjbHJXaXphcmRPbk5leHQpIG91dHB1dCBpbnN0ZWFkIG9mIHRoaXMgb25lLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIGdldCBtb3ZlZFRvTmV4dFBhZ2UoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX21vdmVkVG9OZXh0UGFnZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYnNlcnZhYmxlIHVzZWQgaW50ZXJuYWxseSB0byBhbGVydCB0aGUgd2l6YXJkIHRoYXQgdGhlIG5hdiBzZXJ2aWNlXG4gICAqIGhhcyBhcHByb3ZlZCBjb21wbGV0aW9uIG9mIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIEl0IGlzIHJlY29tbWVuZGVkIHRoYXQgeW91IHVzZSB0aGUgV2l6YXJkLndpemFyZEZpbmlzaGVkIChjbHJXaXphcmRPbkZpbmlzaClcbiAgICogb3V0cHV0IGluc3RlYWQgb2YgdGhpcyBvbmUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IHdpemFyZEZpbmlzaGVkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl93aXphcmRGaW5pc2hlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZmllcyB0aGUgd2l6YXJkIHdoZW4gYmFja3dhcmRzIG5hdmlnYXRpb24gaGFzIG9jY3VycmVkIHZpYSB0aGVcbiAgICogcHJldmlvdXMgYnV0dG9uLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIGdldCBtb3ZlZFRvUHJldmlvdXNQYWdlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9tb3ZlZFRvUHJldmlvdXNQYWdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vdGlmaWVzIHRoZSB3aXphcmQgdGhhdCBhIHVzZXIgaXMgdHJ5aW5nIHRvIGNhbmNlbCBpdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBnZXQgbm90aWZ5V2l6YXJkQ2FuY2VsKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbmNlbFdpemFyZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucHJldmlvdXNCdXR0b25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLm5leHRCdXR0b25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRhbmdlckJ1dHRvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZmluaXNoQnV0dG9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5jdXN0b21CdXR0b25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMucGFnZXNSZXNldFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBwdWJsaWMgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm9ncmFtbWF0aWNhbGx5IGFkdmFuY2VcbiAgICogdGhlIHVzZXIgdG8gdGhlIG5leHQgcGFnZS5cbiAgICpcbiAgICogV2hlbiBpbnZva2VkLCB0aGlzIG1ldGhvZCB3aWxsIG1vdmUgdGhlIHdpemFyZCB0byB0aGUgbmV4dCBwYWdlIGFmdGVyXG4gICAqIHN1Y2Nlc3NmdWwgdmFsaWRhdGlvbi4gTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGdvZXMgdGhyb3VnaCBhbGwgY2hlY2tzXG4gICAqIGFuZCBldmVudCBlbWlzc2lvbnMgYXMgaWYgV2l6YXJkLm5leHQoZmFsc2UpIGhhZCBiZWVuIGNhbGxlZC5cbiAgICpcbiAgICogSW4gbW9zdCBjYXNlcywgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byB1c2UgV2l6YXJkLm5leHQoZmFsc2UpLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIG5leHQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBhZ2VJc0xhc3QpIHtcbiAgICAgIHRoaXMuY2hlY2tBbmRDb21taXRDdXJyZW50UGFnZSgnZmluaXNoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hlY2tBbmRDb21taXRDdXJyZW50UGFnZSgnbmV4dCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBCeXBhc3NlcyBjaGVja3MgYW5kIG1vc3QgZXZlbnQgZW1pc3Npb25zIHRvIGZvcmNlIGEgcGFnZSB0byBuYXZpZ2F0ZSBmb3J3YXJkLlxuICAgKlxuICAgKiBDb21wYXJhYmxlIHRvIGNhbGxpbmcgV2l6YXJkLm5leHQoKSBvciBXaXphcmQuZm9yY2VOZXh0KCkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZm9yY2VOZXh0KCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlOiBDbHJXaXphcmRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcbiAgICBjb25zdCBuZXh0UGFnZTogQ2xyV2l6YXJkUGFnZSA9IHRoaXMucGFnZUNvbGxlY3Rpb24uZ2V0TmV4dFBhZ2UoY3VycmVudFBhZ2UpO1xuXG4gICAgLy8gY2F0Y2ggZXJyYW50IG51bGwgb3IgdW5kZWZpbmVkcyB0aGF0IGNyZWVwIGluXG4gICAgaWYgKCFuZXh0UGFnZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgd2l6YXJkIGhhcyBubyBuZXh0IHBhZ2UgdG8gZ28gdG8uJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMud2l6YXJkU3RvcE5hdmlnYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWN1cnJlbnRQYWdlLmNvbXBsZXRlZCkge1xuICAgICAgLy8gdGhpcyBpcyBhIHN0YXRlIHRoYXQgYWx0IG5leHQgZmxvd3MgY2FuIGdldCB0aGVtc2VsdmVzIGluLi4uXG4gICAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLmNvbW1pdFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gbmV4dFBhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBhIGJ1dHRvbi9hY3Rpb24gdHlwZSBhcyBhIHBhcmFtZXRlci4gRW5jYXBzdWxhdGVzIGFsbCBsb2dpYyBmb3JcbiAgICogZXZlbnQgZW1pc3Npb25zLCBzdGF0ZSBvZiB0aGUgY3VycmVudCBwYWdlLCBhbmQgd2l6YXJkIGFuZCBwYWdlIGxldmVsIG92ZXJyaWRlcy5cbiAgICpcbiAgICogQXZvaWQgY2FsbGluZyB0aGlzIGZ1bmN0aW9uIGRpcmVjdGx5IHVubGVzcyB5b3UgcmVhbGx5IGtub3cgd2hhdCB5b3UncmUgZG9pbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgY2hlY2tBbmRDb21taXRDdXJyZW50UGFnZShidXR0b25UeXBlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50UGFnZTogQ2xyV2l6YXJkUGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XG5cbiAgICBpZiAoIWN1cnJlbnRQYWdlLnJlYWR5VG9Db21wbGV0ZSB8fCB0aGlzLndpemFyZFN0b3BOYXZpZ2F0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaUFtVGhlTGFzdFBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlSXNMYXN0O1xuXG4gICAgY29uc3QgaXNOZXh0ID0gYnV0dG9uVHlwZSA9PT0gJ25leHQnO1xuICAgIGNvbnN0IGlzRGFuZ2VyID0gYnV0dG9uVHlwZSA9PT0gJ2Rhbmdlcic7XG4gICAgY29uc3QgaXNEYW5nZXJOZXh0ID0gaXNEYW5nZXIgJiYgIWlBbVRoZUxhc3RQYWdlO1xuICAgIGNvbnN0IGlzRGFuZ2VyRmluaXNoID0gaXNEYW5nZXIgJiYgaUFtVGhlTGFzdFBhZ2U7XG4gICAgY29uc3QgaXNGaW5pc2ggPSBidXR0b25UeXBlID09PSAnZmluaXNoJyB8fCBpc0RhbmdlckZpbmlzaDtcblxuICAgIGlmIChpc0ZpbmlzaCAmJiAhaUFtVGhlTGFzdFBhZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50UGFnZS5wcmltYXJ5QnV0dG9uQ2xpY2tlZC5lbWl0KGJ1dHRvblR5cGUpO1xuXG4gICAgaWYgKGlzRmluaXNoKSB7XG4gICAgICBjdXJyZW50UGFnZS5maW5pc2hCdXR0b25DbGlja2VkLmVtaXQoY3VycmVudFBhZ2UpO1xuICAgIH0gZWxzZSBpZiAoaXNEYW5nZXIpIHtcbiAgICAgIGN1cnJlbnRQYWdlLmRhbmdlckJ1dHRvbkNsaWNrZWQuZW1pdCgpO1xuICAgIH0gZWxzZSBpZiAoaXNOZXh0KSB7XG4gICAgICBjdXJyZW50UGFnZS5uZXh0QnV0dG9uQ2xpY2tlZC5lbWl0KCk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnRQYWdlLnN0b3BOZXh0IHx8IGN1cnJlbnRQYWdlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBjdXJyZW50UGFnZS5vbkNvbW1pdC5lbWl0KGN1cnJlbnRQYWdlLmlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBvcmRlciBpcyB2ZXJ5IGltcG9ydGFudCB3aXRoIHRoZXNlIGVtaXR0ZXJzIVxuICAgIGlmIChpc0ZpbmlzaCkge1xuICAgICAgLy8gbWFyayBwYWdlIGFzIGNvbXBsZXRlXG4gICAgICBpZiAoIXRoaXMud2l6YXJkSGFzQWx0TmV4dCkge1xuICAgICAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLmNvbW1pdFBhZ2UoY3VycmVudFBhZ2UpO1xuICAgICAgfVxuICAgICAgdGhpcy5fd2l6YXJkRmluaXNoZWQubmV4dCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLndpemFyZEhhc0FsdE5leHQpIHtcbiAgICAgIHRoaXMucGFnZUNvbGxlY3Rpb24uY29tbWl0UGFnZShjdXJyZW50UGFnZSk7XG5cbiAgICAgIGlmIChpc05leHQgfHwgaXNEYW5nZXJOZXh0KSB7XG4gICAgICAgIHRoaXMuX21vdmVkVG9OZXh0UGFnZS5uZXh0KHRydWUpO1xuICAgICAgfVxuICAgICAgLy8ganVtcCBvdXQgaGVyZSwgbm8gbWF0dGVyIHdoYXQgdHlwZSB3ZSdyZSBsb29raW5nIGF0XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzTmV4dCB8fCBpc0Rhbmdlck5leHQpIHtcbiAgICAgIHRoaXMuZm9yY2VOZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLndpemFyZEhhc0FsdE5leHQgJiYgIXRoaXMud2l6YXJkU3RvcE5hdmlnYXRpb24pIHtcbiAgICAgIHRoaXMuX21vdmVkVG9OZXh0UGFnZS5uZXh0KHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgcHVibGljIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvZ3JhbW1hdGljYWxseSBjb25jbHVkZVxuICAgKiB0aGUgd2l6YXJkLlxuICAgKlxuICAgKiBXaGVuIGludm9rZWQsIHRoaXMgbWV0aG9kIHdpbGwgIGluaXRpYXRlIHRoZSB3b3JrIGludm9sdmVkIHdpdGggZmluYWxpemluZ1xuICAgKiBhbmQgZmluaXNoaW5nIHRoZSB3aXphcmQgd29ya2Zsb3cuIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCBnb2VzIHRocm91Z2ggYWxsXG4gICAqIGNoZWNrcyBhbmQgZXZlbnQgZW1pc3Npb25zIGFzIGlmIFdpemFyZC5maW5pc2goZmFsc2UpIGhhZCBiZWVuIGNhbGxlZC5cbiAgICpcbiAgICogSW4gbW9zdCBjYXNlcywgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byB1c2UgV2l6YXJkLmZpbmlzaChmYWxzZSkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgZmluaXNoKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tBbmRDb21taXRDdXJyZW50UGFnZSgnZmluaXNoJyk7XG4gIH1cblxuICAvKipcbiAgICogUHJvZ3JhbW1hdGljYWxseSBtb3ZlcyB0aGUgd2l6YXJkIHRvIHRoZSBwYWdlIGJlZm9yZSB0aGUgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiBJbiBtb3N0IGluc3RhbmNlcywgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byBjYWxsIFdpemFyZC5wcmV2aW91cygpXG4gICAqIHdoaWNoIGRvZXMgdGhlIHNhbWUgdGhpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgcHJldmlvdXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBhZ2VJc0ZpcnN0IHx8IHRoaXMud2l6YXJkU3RvcE5hdmlnYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2UgPSB0aGlzLnBhZ2VDb2xsZWN0aW9uLmdldFByZXZpb3VzUGFnZSh0aGlzLmN1cnJlbnRQYWdlKTtcblxuICAgIGlmICghcHJldmlvdXNQYWdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbW92ZWRUb1ByZXZpb3VzUGFnZS5uZXh0KHRydWUpO1xuXG4gICAgaWYgKHRoaXMuZm9yY2VGb3J3YXJkTmF2aWdhdGlvbikge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZS5jb21wbGV0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gcHJldmlvdXNQYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBhIGhvb2sgaW50byB0aGUgY2FuY2VsIHdvcmtmbG93IG9mIHRoZSB3aXphcmQgZnJvbSB0aGUgbmF2IHNlcnZpY2UuIE5vdGUgdGhhdFxuICAgKiB0aGlzIHJvdXRlIGdvZXMgdGhyb3VnaCBhbGwgY2hlY2tzIGFuZCBldmVudCBlbWlzc2lvbnMgYXMgaWYgYSBjYW5jZWwgYnV0dG9uIGhhZFxuICAgKiBiZWVuIGNsaWNrZWQuXG4gICAqXG4gICAqIEluIG1vc3QgY2FzZXMsIHVzZXJzIGxvb2tpbmcgZm9yIGEgaG9vayBpbnRvIHRoZSBjYW5jZWwgcm91dGluZSBhcmUgYWN0dWFsbHkgbG9va2luZ1xuICAgKiBmb3IgYSB3YXkgdG8gY2xvc2UgdGhlIHdpemFyZCBmcm9tIHRoZWlyIGhvc3QgY29tcG9uZW50IGJlY2F1c2UgdGhleSBoYXZlIHByZXZlbnRlZFxuICAgKiB0aGUgZGVmYXVsdCBjYW5jZWwgYWN0aW9uLlxuICAgKlxuICAgKiBJbiB0aGlzIGluc3RhbmNlLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSB1c2UgV2l6YXJkLmNsb3NlKCkgdG8gYXZvaWQgYW55IGV2ZW50XG4gICAqIGVtaXNzaW9uIGxvb3AgcmVzdWx0aW5nIGZyb20gYW4gZXZlbnQgaGFuZGxlciBjYWxsaW5nIGJhY2sgaW50byByb3V0aW5lIHRoYXQgd2lsbFxuICAgKiBhZ2FpbiBldm9rZSB0aGUgZXZlbnRzIGl0IGhhbmRsZXMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMuX2NhbmNlbFdpemFyZC5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYWxsIHJlcXVpcmVkIGNoZWNrcyB0byBkZXRlcm1pbmUgaWYgYSB1c2VyIGNhbiBuYXZpZ2F0ZSB0byBhIHBhZ2UuIENoZWNraW5nIGF0IGVhY2hcbiAgICogcG9pbnQgaWYgYSBwYWdlIGlzIG5hdmlnYWJsZSAtLSBjb21wbGV0ZWQgd2hlcmUgdGhlIHBhZ2UgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGxhc3QgY29tcGxldGVkXG4gICAqIHBhZ2UuXG4gICAqXG4gICAqIFRha2VzIHR3byBwYXJhbWV0ZXJzLiBUaGUgZmlyc3Qgb25lIG11c3QgYmUgZWl0aGVyIHRoZSBDbHJXaXphcmRQYWdlIG9iamVjdCBvciB0aGUgSUQgb2YgdGhlXG4gICAqIENscldpemFyZFBhZ2Ugb2JqZWN0IHRoYXQgeW91IHdhbnQgdG8gbWFrZSB0aGUgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIHBhcmFtZXRlciBpcyBvcHRpb25hbCBhbmQgaXMgYSBCb29sZWFuIGZsYWcgZm9yIFwibGF6eSBjb21wbGV0aW9uXCIuIFdoYXQgdGhpcyBtZWFuc1xuICAgKiBpcyB0aGUgV2l6YXJkIHdpbGwgbWFyayBhbGwgcGFnZXMgYmV0d2VlbiB0aGUgY3VycmVudCBwYWdlIGFuZCB0aGUgcGFnZSB5b3Ugd2FudCB0byBuYXZpZ2F0ZVxuICAgKiB0byBhcyBjb21wbGV0ZWQuIFRoaXMgaXMgdXNlZnVsIGZvciBpbmZvcm1hdGlvbmFsIHdpemFyZHMgdGhhdCBkbyBub3QgcmVxdWlyZSB1c2VyIGFjdGlvbixcbiAgICogYWxsb3dpbmcgYW4gZWFzeSBtZWFucyBmb3IgdXNlcnMgdG8ganVtcCBhaGVhZC5cbiAgICpcbiAgICogVG8gYXZvaWQgY2hlY2tzIG9uIG5hdmlnYXRpb24sIHVzZSBDbHJXaXphcmRQYWdlLm1ha2VDdXJyZW50KCkgaW5zdGVhZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICBnb1RvKHBhZ2VUb0dvVG9PcklkOiBhbnksIGxhenlDb21wbGV0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgbXlQYWdlcyA9IHRoaXMucGFnZUNvbGxlY3Rpb247XG4gICAgY29uc3QgcGFnZVRvR29UbyA9IHR5cGVvZiBwYWdlVG9Hb1RvT3JJZCA9PT0gJ3N0cmluZycgPyBteVBhZ2VzLmdldFBhZ2VCeUlkKHBhZ2VUb0dvVG9PcklkKSA6IHBhZ2VUb0dvVG9PcklkO1xuICAgIGNvbnN0IGN1cnJlbnRQYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcblxuICAgIC8vIG5vIHBvaW50IGluIGdvaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UuIHlvdSdyZSB0aGVyZSBhbHJlYWR5IVxuICAgIC8vIGFsc28gaGFyZCBibG9jayBvbiBhbnkgbmF2aWdhdGlvbiB3aGVuIHN0b3BOYXZpZ2F0aW9uIGlzIHRydWVcbiAgICBpZiAocGFnZVRvR29UbyA9PT0gY3VycmVudFBhZ2UgfHwgdGhpcy53aXphcmRTdG9wTmF2aWdhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQYWdlSW5kZXggPSBteVBhZ2VzLmdldFBhZ2VJbmRleChjdXJyZW50UGFnZSk7XG4gICAgY29uc3QgZ29Ub1BhZ2VJbmRleCA9IG15UGFnZXMuZ2V0UGFnZUluZGV4KHBhZ2VUb0dvVG8pO1xuICAgIGNvbnN0IGdvaW5nRm9yd2FyZCA9IGdvVG9QYWdlSW5kZXggPiBjdXJyZW50UGFnZUluZGV4O1xuICAgIGNvbnN0IHBhZ2VzVG9DaGVjayA9IG15UGFnZXMuZ2V0UGFnZVJhbmdlRnJvbVBhZ2VzKHRoaXMuY3VycmVudFBhZ2UsIHBhZ2VUb0dvVG8pO1xuICAgIGNvbnN0IG9rYXlUb01vdmUgPSBsYXp5Q29tcGxldGUgfHwgdGhpcy5jYW5Hb1RvKHBhZ2VzVG9DaGVjayk7XG5cbiAgICBpZiAoIW9rYXlUb01vdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZ29pbmdGb3J3YXJkICYmIGxhenlDb21wbGV0ZSkge1xuICAgICAgcGFnZXNUb0NoZWNrLmZvckVhY2goKHBhZ2U6IENscldpemFyZFBhZ2UpID0+IHtcbiAgICAgICAgaWYgKHBhZ2UgIT09IHBhZ2VUb0dvVG8pIHtcbiAgICAgICAgICBwYWdlLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoIWdvaW5nRm9yd2FyZCAmJiB0aGlzLmZvcmNlRm9yd2FyZE5hdmlnYXRpb24pIHtcbiAgICAgIHBhZ2VzVG9DaGVjay5mb3JFYWNoKChwYWdlOiBDbHJXaXphcmRQYWdlKSA9PiB7XG4gICAgICAgIHBhZ2UuY29tcGxldGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gcGFnZVRvR29UbztcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIGEgcmFuZ2Ugb2YgQ2xyV2l6YXJkUGFnZSBvYmplY3RzIGFzIGEgcGFyYW1ldGVyLiBQZXJmb3JtcyB0aGUgd29yayBvZiBjaGVja2luZ1xuICAgKiB0aG9zZSBvYmplY3RzIHRvIGRldGVybWluZSBpZiBuYXZpZ2F0aW9uIGNhbiBiZSBhY2NvbXBsaXNoZWQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgY2FuR29UbyhwYWdlc1RvQ2hlY2s6IENscldpemFyZFBhZ2VbXSk6IGJvb2xlYW4ge1xuICAgIGxldCBva2F5VG9Nb3ZlID0gdHJ1ZTtcbiAgICBjb25zdCBteVBhZ2VzID0gdGhpcy5wYWdlQ29sbGVjdGlvbjtcblxuICAgIC8vIHByZXZpb3VzIHBhZ2UgY2FuIGJlIGltcG9ydGFudCB3aGVuIG1vdmluZyBiZWNhdXNlIGlmIGl0J3MgY29tcGxldGVkIGl0XG4gICAgLy8gYWxsb3dzIHVzIHRvIG1vdmUgdG8gdGhlIHBhZ2UgZXZlbiBpZiBpdCdzIGluY29tcGxldGUuLi5cbiAgICBsZXQgcHJldmlvdXNQYWdlUGFzc2VzOiBib29sZWFuO1xuXG4gICAgaWYgKCFwYWdlc1RvQ2hlY2sgfHwgcGFnZXNUb0NoZWNrLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwYWdlc1RvQ2hlY2suZm9yRWFjaCgocGFnZTogQ2xyV2l6YXJkUGFnZSkgPT4ge1xuICAgICAgaWYgKCFva2F5VG9Nb3ZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhZ2UuY29tcGxldGVkKSB7XG4gICAgICAgIC8vIGRlZmF1bHQgaXMgdHJ1ZS4ganVzdCBqdW1wIG91dCBpbnN0ZWFkIG9mIGNvbXBsaWNhdGluZyBpdC5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBzbyB3ZSBrbm93IG91ciBwYWdlIGlzIG5vdCBjb21wbGV0ZWQuLi5cbiAgICAgIGNvbnN0IHByZXZpb3VzUGFnZSA9IG15UGFnZXMuZ2V0UGFnZUluZGV4KHBhZ2UpID4gMCA/IG15UGFnZXMuZ2V0UHJldmlvdXNQYWdlKHBhZ2UpIDogbnVsbDtcbiAgICAgIHByZXZpb3VzUGFnZVBhc3NlcyA9IHByZXZpb3VzUGFnZSA9PT0gbnVsbCB8fCBwcmV2aW91c1BhZ2UuY29tcGxldGVkID09PSB0cnVlO1xuXG4gICAgICAvLyB3ZSBhcmUgZmFsc2UgaWYgbm90IHRoZSBjdXJyZW50IHBhZ2UgQU5EIHByZXZpb3VzIHBhZ2UgaXMgbm90IGNvbXBsZXRlZFxuICAgICAgLy8gKGJ1dCBtdXN0IGhhdmUgYSBwcmV2aW91cyBwYWdlKVxuICAgICAgaWYgKCFwYWdlLmN1cnJlbnQgJiYgIXByZXZpb3VzUGFnZVBhc3Nlcykge1xuICAgICAgICBva2F5VG9Nb3ZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBmYWxscyB0aHJvdWdoIHRvIHRydWUgYXMgZGVmYXVsdFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9rYXlUb01vdmU7XG4gIH1cblxuICAvKipcbiAgICogTG9va3MgdGhyb3VnaCB0aGUgY29sbGVjdGlvbiBvZiBwYWdlcyB0byBmaW5kIHRoZSBmaXJzdCBvbmUgdGhhdCBpcyBpbmNvbXBsZXRlXG4gICAqIGFuZCBtYWtlcyB0aGF0IHBhZ2UgdGhlIGN1cnJlbnQvYWN0aXZlIHBhZ2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmROYXZpZ2F0aW9uU2VydmljZVxuICAgKi9cbiAgc2V0TGFzdEVuYWJsZWRQYWdlQ3VycmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBhbGxQYWdlczogQ2xyV2l6YXJkUGFnZVtdID0gdGhpcy5wYWdlQ29sbGVjdGlvbi5wYWdlc0FzQXJyYXk7XG4gICAgbGV0IGxhc3RDb21wbGV0ZWRQYWdlSW5kZXg6IG51bWJlciA9IG51bGw7XG5cbiAgICBhbGxQYWdlcy5mb3JFYWNoKChwYWdlOiBDbHJXaXphcmRQYWdlLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocGFnZS5jb21wbGV0ZWQpIHtcbiAgICAgICAgbGFzdENvbXBsZXRlZFBhZ2VJbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGxhc3RDb21wbGV0ZWRQYWdlSW5kZXggPT09IG51bGwpIHtcbiAgICAgIC8vIGFsd2F5cyBpcyBhdCBsZWFzdCB0aGUgZmlyc3QgaXRlbS4uLlxuICAgICAgbGFzdENvbXBsZXRlZFBhZ2VJbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmIChsYXN0Q29tcGxldGVkUGFnZUluZGV4ICsgMSA8IGFsbFBhZ2VzLmxlbmd0aCkge1xuICAgICAgbGFzdENvbXBsZXRlZFBhZ2VJbmRleCA9IGxhc3RDb21wbGV0ZWRQYWdlSW5kZXggKyAxO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFBhZ2UgPSBhbGxQYWdlc1tsYXN0Q29tcGxldGVkUGFnZUluZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgY29sbGVjdGlvbiBvZiBwYWdlcyBhbmQgbWFrZXMgdGhhdCBwYWdlIHRoZVxuICAgKiBjdXJyZW50L2FjdGl2ZSBwYWdlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2VcbiAgICovXG4gIHNldEZpcnN0UGFnZUN1cnJlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZUNvbGxlY3Rpb24ucGFnZXNBc0FycmF5WzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHN0ZXBuYXYgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgd2l6YXJkIHdoZW4gcGFnZXMgYXJlIGR5bmFtaWNhbGx5XG4gICAqIGFkZGVkIG9yIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBvZiBwYWdlcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlXG4gICAqL1xuICB1cGRhdGVOYXZpZ2F0aW9uKCk6IHZvaWQge1xuICAgIGxldCB0b1NldEN1cnJlbnQ6IENscldpemFyZFBhZ2U7XG5cbiAgICB0aGlzLnBhZ2VDb2xsZWN0aW9uLnVwZGF0ZUNvbXBsZXRlZFN0YXRlcygpO1xuXG4gICAgY29uc3QgY3VycmVudFBhZ2VSZW1vdmVkID0gdGhpcy5wYWdlQ29sbGVjdGlvbi5wYWdlc0FzQXJyYXkuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA8IDA7XG4gICAgaWYgKGN1cnJlbnRQYWdlUmVtb3ZlZCkge1xuICAgICAgdG9TZXRDdXJyZW50ID0gdGhpcy5wYWdlQ29sbGVjdGlvbi5maW5kRmlyc3RJbmNvbXBsZXRlUGFnZSgpO1xuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRvU2V0Q3VycmVudDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==