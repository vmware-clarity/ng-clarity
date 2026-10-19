/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createTestHelpers, TestContext } from '@clr/angular/testing';

import { BasicWizardTestComponent } from '../test-components/basic-wizard.mock';
import { ClrWizard } from '../wizard';
import { ClrWizardPage } from '../wizard-page';
import { PageCollectionService } from './page-collection.service';
import { WizardNavigationService } from './wizard-navigation.service';

describe('New Wizard Tests', () => {
  describe('Wizard Navigation Service', () => {
    const helpers = createTestHelpers();

    let context: TestContext<ClrWizard, BasicWizardTestComponent>;
    let wizardNavigationService: WizardNavigationService;
    let pageCollectionService: PageCollectionService;

    beforeEach(() => {
      context = helpers.create(ClrWizard, BasicWizardTestComponent);
      wizardNavigationService = context.getClarityProvider(WizardNavigationService);
      pageCollectionService = context.getClarityProvider(PageCollectionService);
      context.detectChanges();
    });

    it('currentPage should set the current page and emit the event', () => {
      wizardNavigationService.currentPage = pageCollectionService.getPageByIndex(1);
      expect(wizardNavigationService.currentPage).toEqual(pageCollectionService.getPageByIndex(1));
      wizardNavigationService.currentPage = pageCollectionService.lastPage;
      expect(wizardNavigationService.currentPage).toEqual(pageCollectionService.lastPage);
    });

    it('.next() should call finish() if the current page is the last page.', () => {
      const testPage = wizardNavigationService.pageCollection.lastPage;
      const wizard = context.clarityDirective;

      wizardNavigationService.currentPage = testPage;
      vi.spyOn(testPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);
      vi.spyOn(wizard.wizardFinished, 'emit').mockImplementation(() => undefined);

      wizardNavigationService.wizardFinished.subscribe(function () {
        wizard.wizardFinished.emit();
      });

      wizardNavigationService.next();

      expect(testPage.primaryButtonClicked.emit).toHaveBeenCalled();
      expect(testPage.onCommit.emit).toHaveBeenCalled();
      expect(testPage.completed).toBe(true);
      expect(wizard.wizardFinished.emit).toHaveBeenCalled();
    });

    it('.next() should set the current page to the next page.', () => {
      expect(wizardNavigationService.currentPage).toEqual(wizardNavigationService.pageCollection.getPageByIndex(0));

      wizardNavigationService.next();

      expect(wizardNavigationService.currentPage).toEqual(wizardNavigationService.pageCollection.getPageByIndex(1));
    });

    it('.next() should not navigate if the next page is disabled', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      testPage.nextStepDisabled = true;
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.next();
      expect(wizardNavigationService.currentPage).toBe(testPage);
    });

    it('.next() should not do anything if set to stop navigation', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.wizardStopNavigation = true;
      wizardNavigationService.next();
      expect(wizardNavigationService.currentPage, 'wizard did not navigate').toBe(testPage);
    });

    it('.finish() should commit the current page and emit the event', () => {
      const testPage = wizardNavigationService.pageCollection.lastPage;

      vi.spyOn(testPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);
      vi.spyOn(context.clarityDirective.wizardFinished, 'emit').mockImplementation(() => undefined);

      wizardNavigationService.currentPage = testPage;

      wizardNavigationService.finish();

      expect(testPage.primaryButtonClicked.emit).toHaveBeenCalled();
      expect(testPage.onCommit.emit).toHaveBeenCalled();
      expect(testPage.completed).toBe(true);
      expect(context.clarityDirective.wizardFinished.emit).toHaveBeenCalled();
    });

    it('.finish() should not commit the current page and emit events if next is disabled', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);

      testPage.nextStepDisabled = true;
      context.detectChanges();

      vi.spyOn(testPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);
      vi.spyOn(context.clarityDirective.wizardFinished, 'emit').mockImplementation(() => undefined);

      wizardNavigationService.wizardFinished.subscribe(function () {
        context.clarityDirective.wizardFinished.emit();
      });

      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.finish();
      expect(testPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
      expect(testPage.onCommit.emit).not.toHaveBeenCalled();
      expect(testPage.completed).toBe(false);
      expect(context.clarityDirective.wizardFinished.emit).not.toHaveBeenCalled();
    });

    it('.previous() should do nothing if the current page is the first page', () => {
      const testPage = wizardNavigationService.pageCollection.firstPage;
      const pageCollectionSpy = vi
        .spyOn(wizardNavigationService.pageCollection, 'getPreviousPage')
        .mockImplementation(() => undefined);
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.previous();
      expect(wizardNavigationService.currentPage).toBe(testPage);
      expect(pageCollectionSpy).not.toHaveBeenCalled();
    });

    it('.previous() should not do anything if stop navigation is true', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.wizardStopNavigation = true;
      wizardNavigationService.previous();
      expect(wizardNavigationService.currentPage).toBe(testPage);
    });

    it('.previous() should set the current page to the previous page', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const previousPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.previous();
      expect(wizardNavigationService.currentPage).toEqual(previousPage);
    });

    it('.previous() set current page to incomplete if set to forceForward navigation', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const previousPage = wizardNavigationService.pageCollection.getPageByIndex(1);

      wizardNavigationService.currentPage = testPage;
      testPage.completed = true;

      wizardNavigationService.forceForwardNavigation = true;
      wizardNavigationService.previous();

      expect(wizardNavigationService.currentPage).toEqual(previousPage);
      expect(testPage.completed, 'forceForward should set old current page to incomplete').toBe(false);
    });

    it('.goTo() should not do anything if the given page is equal to the current page', () => {
      const navSvc = wizardNavigationService;
      const startPage = navSvc.pageCollection.getPageByIndex(0);
      const testPage = navSvc.pageCollection.getPageByIndex(1);
      const goToPage = navSvc.pageCollection.getPageByIndex(1);
      const pageCollectionSpy = vi.spyOn(navSvc.pageCollection, 'getPageIndex').mockImplementation(() => undefined);

      startPage.completed = true;
      navSvc.currentPage = testPage;

      navSvc.goTo(goToPage);
      expect(navSvc.currentPage, 'does not navigate with object').toBe(testPage);

      navSvc.goTo(goToPage.id);
      expect(navSvc.currentPage, 'does not navigate with id').toBe(testPage);

      expect(pageCollectionSpy).not.toHaveBeenCalled();
    });

    it('.goTo() should not do anything if stop navigation is true', () => {
      const navSvc = wizardNavigationService;
      const startPage = navSvc.pageCollection.getPageByIndex(0);
      const goToPage = navSvc.pageCollection.getPageByIndex(1);

      navSvc.currentPage = startPage;
      startPage.completed = true;
      navSvc.wizardStopNavigation = true;
      navSvc.goTo(goToPage);

      expect(navSvc.currentPage).not.toBe(goToPage);
      expect(navSvc.currentPage).toBe(startPage);
    });

    it('.goTo() should set the current page as the given page', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const goToPage = wizardNavigationService.pageCollection.getPageByIndex(2);

      // goTo checks completed states
      startPage.completed = true;
      testPage.completed = true;

      wizardNavigationService.goTo(goToPage);
      context.detectChanges();

      const pageAsExpected = wizardNavigationService.currentPage === goToPage;

      expect(pageAsExpected).toBe(true);
    });

    it('.goTo() should not mark pages incomplete if moving forward and wizard is set to forceForward', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const goToPage = wizardNavigationService.pageCollection.getPageByIndex(2);

      // goTo checks completed states
      startPage.completed = true;
      testPage.completed = true;
      wizardNavigationService.forceForwardNavigation = true;

      wizardNavigationService.goTo(goToPage);

      expect(wizardNavigationService.currentPage).toEqual(goToPage);
      expect(startPage.completed).toBe(true);
      expect(testPage.completed).toBe(true);
    });

    it('.goTo() should mark pages incomplete if moving backward and wizard is set to forceForward', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const fourthPage = wizardNavigationService.pageCollection.getPageByIndex(3);

      // goTo checks completed states
      startPage.completed = true;
      secondPage.completed = true;
      thirdPage.completed = true;
      wizardNavigationService.forceForwardNavigation = true;

      wizardNavigationService.goTo(fourthPage);
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'move forward as expected').toEqual(fourthPage);
      expect(startPage.completed, 'validate startPage.completed is true as expected').toBe(true);
      expect(secondPage.completed, 'validate secondPage.completed is true as expected').toBe(true);
      expect(thirdPage.completed, 'validate thirdPage.completed is true as expected').toBe(true);
      expect(fourthPage.completed, 'validate fourthPage.completed is false as expected').toBe(false);

      wizardNavigationService.goTo(secondPage);
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'now move backward').toEqual(secondPage);
      expect(startPage.completed, 'startPage.completed should still be true').toBe(true);
      expect(secondPage.completed, 'secondPage.completed should be set to false').toBe(false);
      expect(thirdPage.completed, 'thirdPage.completed should be set to false').toBe(false);
      expect(fourthPage.completed, 'fourthPage.completed should remain false').toBe(false);
    });

    it('.goTo() should mark pages complete if moving forward and told to lazyComplete', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const fourthPage = wizardNavigationService.pageCollection.getPageByIndex(3);

      expect(startPage.completed, 'validate startPage.completed is false as expected').toBe(false);
      expect(secondPage.completed, 'validate secondPage.completed is false as expected').toBe(false);
      expect(thirdPage.completed, 'validate thirdPage.completed is false as expected').toBe(false);
      expect(fourthPage.completed, 'validate fourthPage.completed is false as expected').toBe(false);

      // lazyComplete (second parameter as true) ignores completed states
      wizardNavigationService.goTo(fourthPage, true);
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'move forward as expected').toEqual(fourthPage);
      expect(startPage.completed, 'validate startPage.completed is true as expected').toBe(true);
      expect(secondPage.completed, 'validate secondPage.completed is true as expected').toBe(true);
      expect(thirdPage.completed, 'validate thirdPage.completed is true as expected').toBe(true);
      expect(fourthPage.completed, 'validate fourthPage.completed is false as expected').toBe(false);
    });

    it('.goTo() should not allow lazyComplete by default', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const fourthPage = wizardNavigationService.pageCollection.getPageByIndex(3);

      expect(startPage.completed, 'validate startPage.completed is false as expected').toBe(false);
      expect(secondPage.completed, 'validate secondPage.completed is false as expected').toBe(false);
      expect(thirdPage.completed, 'validate thirdPage.completed is false as expected').toBe(false);
      expect(fourthPage.completed, 'validate fourthPage.completed is false as expected').toBe(false);

      wizardNavigationService.goTo(fourthPage);
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'wizard did not move forward').toEqual(startPage);
      expect(startPage.completed, 'validate startPage.completed is still false as expected').toBe(false);
      expect(secondPage.completed, 'validate secondPage.completed is still false as expected').toBe(false);
      expect(thirdPage.completed, 'validate thirdPage.completed is still false as expected').toBe(false);
      expect(fourthPage.completed, 'validate fourthPage.completed is still false as expected').toBe(false);
    });

    it('.goTo() should not mark last page complete if moving forward with lazy complete', () => {
      const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const fourthPage = wizardNavigationService.pageCollection.getPageByIndex(3);

      expect(startPage.completed, 'validate startPage.completed is false as expected').toBe(false);
      expect(secondPage.completed, 'validate secondPage.completed is false as expected').toBe(false);
      expect(thirdPage.completed, 'validate thirdPage.completed is false as expected').toBe(false);
      expect(fourthPage.completed, 'validate fourthPage.completed is false as expected').toBe(false);

      wizardNavigationService.goTo(thirdPage, true);
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'wizard moved forward').toEqual(thirdPage);
      expect(startPage.completed, 'validate startPage.completed was turned true as expected').toBe(true);
      expect(secondPage.completed, 'validate secondPage.completed was turned true as expected').toBe(true);
      expect(thirdPage.completed, 'validate thirdPage.completed is still false as expected').toBe(false);
      expect(fourthPage.completed, 'validate fourthPage.completed is still false as expected').toBe(false);
    });

    it('.goTo() should emit the current page for navItemChanged subject', () => {
      // const startPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
      let pageTest: ClrWizardPage;
      wizardNavigationService.currentPageChange.subscribe(page => (pageTest = page));

      expect(pageTest).toBeUndefined();
      wizardNavigationService.goTo(secondPage, true);
      context.detectChanges();
      expect(pageTest).toBe(secondPage);
    });

    it('.setFirstPageCurrent() should set the first page as the current page', () => {
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(2);
      const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const pageCollectionBeforeReset = wizardNavigationService.pageCollection;
      wizardNavigationService.currentPage = testPage;
      wizardNavigationService.setFirstPageCurrent();
      const pageCollectionAfterReset = wizardNavigationService.pageCollection;
      expect(wizardNavigationService.currentPage).toEqual(firstPage);
      expect(pageCollectionBeforeReset).toEqual(pageCollectionAfterReset);
    });

    it(".forceNext() should throw an error if there's no next page to go to", () => {
      const testPage = wizardNavigationService.pageCollection.lastPage;
      wizardNavigationService.currentPage = testPage;
      expect(wizardNavigationService.currentPage).toEqual(testPage);
      expect(() => {
        wizardNavigationService.forceNext();
      }).toThrowError();
    });

    it('.forceNext() should do nothing if stop navigation is set', () => {
      const testPage = wizardNavigationService.pageCollection.firstPage;
      wizardNavigationService.currentPage = testPage;
      expect(wizardNavigationService.currentPage).toEqual(testPage);
      wizardNavigationService.wizardStopNavigation = true;
      wizardNavigationService.forceNext();
      expect(wizardNavigationService.currentPage).toBe(testPage);
    });

    it('.forceNext() set next page to be current and commit old current page if incomplete', () => {
      const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
      const testPage = wizardNavigationService.pageCollection.getPageByIndex(1);

      vi.spyOn(wizardNavigationService.pageCollection, 'commitPage');

      expect(wizardNavigationService.currentPage, 'initialized to first page').toBe(firstPage);

      wizardNavigationService.forceNext();
      context.detectChanges();

      expect(wizardNavigationService.currentPage, 'moved to next page').toBe(testPage);
      expect(wizardNavigationService.pageCollection.commitPage).toHaveBeenCalledTimes(1);
      expect(wizardNavigationService.pageCollection.commitPage).toHaveBeenCalledWith(firstPage);
    });

    describe('.checkAndCommitCurrentPage() -- ', () => {
      it('should do nothing if the current page is not ready to complete', () => {
        const currentPage = wizardNavigationService.currentPage;
        currentPage.nextStepDisabled = true;

        // whole lotta spies!
        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        context.detectChanges();
        expect(currentPage.readyToComplete, 'validate page is not ready to complete').toBe(false);
        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(currentPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
      });

      it('should do nothing if stop navigation is set to true', () => {
        const currentPage = wizardNavigationService.currentPage;
        currentPage.nextStepDisabled = false;
        wizardNavigationService.wizardStopNavigation = true;

        // whole lotta spies!
        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        context.detectChanges();
        expect(currentPage.readyToComplete, 'validate page is ok to navigate').toBe(true);
        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(currentPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
      });

      it('should do nothing if the action type is finish and stop navigation is true', () => {
        const lastPage = wizardNavigationService.pageCollection.lastPage;
        wizardNavigationService.currentPage = lastPage;
        const currentPage = wizardNavigationService.currentPage;
        wizardNavigationService.wizardStopNavigation = true;
        currentPage.nextStepDisabled = false;

        expect(currentPage, 'validate current page is last page').toBe(lastPage);

        // whole lotta spies!
        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        wizardNavigationService.checkAndCommitCurrentPage('finish');

        expect(currentPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
      });

      it('should do nothing if the action type is finish and current page is not the last page', () => {
        const lastPage = wizardNavigationService.pageCollection.getPageByIndex(3);
        const currentPage = wizardNavigationService.currentPage;
        const lastPageIsNotCurrent = wizardNavigationService.currentPage !== lastPage;

        // whole lotta spies!
        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        expect(lastPageIsNotCurrent, 'verify last page is not the current page').toBe(true);

        wizardNavigationService.checkAndCommitCurrentPage('finish');

        expect(currentPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
      });

      it('should emit that a primary button was clicked', () => {
        const currentPage = wizardNavigationService.currentPage;
        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        wizardNavigationService.checkAndCommitCurrentPage('next');
        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
      });

      it('should emit finish button was clicked', () => {
        const lastPage = wizardNavigationService.pageCollection.lastPage;

        wizardNavigationService.currentPage = lastPage;
        context.detectChanges();
        const currentPage = wizardNavigationService.currentPage;

        const lastPageIsCurrent = currentPage === lastPage;
        expect(lastPageIsCurrent, 'verify last page is the current page').toBe(true);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.finishButtonClicked, 'emit').mockImplementation(() => undefined);

        wizardNavigationService.checkAndCommitCurrentPage('finish');

        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.finishButtonClicked.emit).toHaveBeenCalledTimes(1);
      });

      it('should emit danger button was clicked', () => {
        const lastPage = wizardNavigationService.pageCollection.lastPage;

        wizardNavigationService.currentPage = lastPage;
        context.detectChanges();

        const currentPage = wizardNavigationService.currentPage;
        const lastPageIsCurrent = currentPage === lastPage;
        expect(lastPageIsCurrent, 'verify last page is the current page').toBe(true);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.finishButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        wizardNavigationService.checkAndCommitCurrentPage('danger');

        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.finishButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
      });

      it('should emit next button was clicked', () => {
        const currentPage = wizardNavigationService.currentPage;

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.finishButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.finishButtonClicked.emit).not.toHaveBeenCalledTimes(1);
        expect(currentPage.nextButtonClicked.emit).toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).toHaveBeenCalled();
      });

      it('should commit the current page -- but only once', () => {
        const currentPage = wizardNavigationService.currentPage;
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        wizardNavigationService.checkAndCommitCurrentPage('next');
        expect(currentPage.onCommit.emit).toHaveBeenCalledTimes(1);
      });

      it('should only commit page once on last page if there are wizard overrides', () => {
        const wiz = context.clarityDirective;
        const testPage = pageCollectionService.lastPage;
        vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);

        wiz.navService.currentPage = testPage;
        expect(wiz.currentPage, 'last page was made current').toBe(testPage);
        context.detectChanges();

        wiz.stopNext = true;
        context.detectChanges();
        expect(wiz.navService.wizardHasAltNext, 'navService registers that we have an alt next').toBe(true);

        wizardNavigationService.checkAndCommitCurrentPage('finish');

        expect(testPage.onCommit.emit).toHaveBeenCalledTimes(1);
      });

      it('should notify wizardFinished if finish', () => {
        let calledAsExpected = false;
        const checkMe = wizardNavigationService.wizardFinished.subscribe(() => {
          calledAsExpected = true;
        });
        const lastPage = wizardNavigationService.pageCollection.lastPage;

        wizardNavigationService.currentPage = lastPage;
        context.detectChanges();
        const currentPage = wizardNavigationService.currentPage;

        const lastPageIsCurrent = currentPage === lastPage;
        expect(lastPageIsCurrent, 'verify last page is the current page').toBe(true);

        wizardNavigationService.checkAndCommitCurrentPage('finish');

        expect(calledAsExpected, 'wizard notification sent').toBe(true);

        checkMe.unsubscribe();
      });

      it('should notify wizardFinished if danger button on last page', () => {
        let calledAsExpected = false;
        const checkMe = wizardNavigationService.wizardFinished.subscribe(() => {
          calledAsExpected = true;
        });
        const lastPage = wizardNavigationService.pageCollection.lastPage;

        wizardNavigationService.currentPage = lastPage;
        context.detectChanges();
        const currentPage = wizardNavigationService.currentPage;

        const lastPageIsCurrent = currentPage === lastPage;
        expect(lastPageIsCurrent, 'verify last page is the current page').toBe(true);

        wizardNavigationService.checkAndCommitCurrentPage('danger');

        expect(calledAsExpected, 'wizard notification sent').toBe(true);

        checkMe.unsubscribe();
      });

      it('should notify movedToNextPage if wizard has alt-next and next clicked', () => {
        let calledAsExpected = false;
        const checkMe = wizardNavigationService.movedToNextPage.subscribe(() => {
          calledAsExpected = true;
        });

        wizardNavigationService.wizardHasAltNext = true;
        context.detectChanges();

        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(calledAsExpected, 'next page notification sent to wizard').toBe(true);

        checkMe.unsubscribe();
      });

      it('should notify movedToNextPage if wizard has next is triggered', () => {
        let calledAsExpected = false;
        const checkMe = wizardNavigationService.movedToNextPage.subscribe(() => {
          calledAsExpected = true;
        });

        wizardNavigationService.next();
        context.detectChanges();
        expect(calledAsExpected, 'next page notification sent to wizard').toBe(true);
        checkMe.unsubscribe();
      });

      it('should notify movedToNextPage if wizard has alt-next and danger-next clicked', () => {
        let calledAsExpected = false;
        const checkMe = wizardNavigationService.movedToNextPage.subscribe(() => {
          calledAsExpected = true;
        });

        wizardNavigationService.wizardHasAltNext = true;
        context.detectChanges();

        wizardNavigationService.checkAndCommitCurrentPage('danger');

        expect(calledAsExpected, 'next page notification sent to wizard').toBe(true);

        checkMe.unsubscribe();
      });

      it('should emit onCommit if next overridden at page level', () => {
        const currentPage = wizardNavigationService.currentPage;
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);

        currentPage.stopNext = true;
        context.detectChanges();

        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(currentPage.onCommit.emit).toHaveBeenCalledTimes(1);
      });

      it('should emit onCommit if next overridden at wizard level', () => {
        const currentPage = wizardNavigationService.currentPage;
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);

        wizardNavigationService.wizardHasAltNext = true;
        wizardNavigationService.checkAndCommitCurrentPage('next');

        expect(currentPage.onCommit.emit).toHaveBeenCalledTimes(1);
      });

      it('should not commit page, fire events, or navigate if next overridden at wizard level', () => {
        const currentPage = wizardNavigationService.currentPage;
        const expectedPage = wizardNavigationService.pageCollection.getPageByIndex(0);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        wizardNavigationService.wizardHasAltNext = true;
        wizardNavigationService.checkAndCommitCurrentPage('next');
        const currentAsExpected = currentPage === expectedPage;

        // still need some events fired
        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).toHaveBeenCalled();

        expect(currentPage.onCommit.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
        expect(currentAsExpected, 'wizard did not navigate').toBe(true);
      });

      it('should not commit page, fire events, or navigate if next overridden at page level', () => {
        const currentPage = wizardNavigationService.currentPage;
        const expectedPage = wizardNavigationService.pageCollection.getPageByIndex(0);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        currentPage.stopNext = true;
        context.detectChanges();

        wizardNavigationService.checkAndCommitCurrentPage('next');
        const currentAsExpected = currentPage === expectedPage;

        // still need some events fired
        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).toHaveBeenCalled();
        expect(currentPage.onCommit.emit).toHaveBeenCalled();

        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
        expect(currentAsExpected, 'wizard did not navigate').toBe(true);
      });

      it('should not commit page, fire events, or navigate if stop navigation is set', () => {
        const currentPage = wizardNavigationService.currentPage;
        const expectedPage = wizardNavigationService.pageCollection.getPageByIndex(0);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext').mockImplementation(() => undefined);

        wizardNavigationService.wizardStopNavigation = true;
        wizardNavigationService.checkAndCommitCurrentPage('next');
        const currentAsExpected = currentPage === expectedPage;

        // should not fire events at all
        expect(currentPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(currentPage.nextButtonClicked.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.pageCollection.commitPage).not.toHaveBeenCalled();
        expect(currentPage.onCommit.emit).not.toHaveBeenCalled();
        expect(wizardNavigationService.forceNext).not.toHaveBeenCalled();
        expect(currentAsExpected, 'wizard did not navigate').toBe(true);
      });

      it('should navigate if not overridden and next clicked', () => {
        const currentPage = wizardNavigationService.currentPage;
        const expectedPage = wizardNavigationService.pageCollection.getPageByIndex(1);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.nextButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext');

        expect(wizardNavigationService.wizardHasAltNext, 'wizard alt-next false by default').toBe(false);
        expect(currentPage.stopNext, 'page alt-next false by default').toBe(false);
        expect(currentPage.preventDefault, 'page prevent default false by default').toBe(false);

        wizardNavigationService.checkAndCommitCurrentPage('next');
        const currentAsExpected = wizardNavigationService.currentPage === expectedPage;

        // still need some events fired
        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.nextButtonClicked.emit).toHaveBeenCalledTimes(1);
        // expect(currentPage.onCommit.emit).toHaveBeenCalledTimes(1);
        expect(wizardNavigationService.pageCollection.commitPage).toHaveBeenCalledTimes(1);
        expect(wizardNavigationService.forceNext).toHaveBeenCalledTimes(1);

        expect(currentAsExpected, 'wizard navigated').toBe(true);
      });

      it('should navigate if not overridden and danger-next clicked', () => {
        const currentPage = wizardNavigationService.currentPage;
        const expectedPage = wizardNavigationService.pageCollection.getPageByIndex(1);

        vi.spyOn(currentPage.primaryButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.dangerButtonClicked, 'emit').mockImplementation(() => undefined);
        vi.spyOn(currentPage.onCommit, 'emit').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService.pageCollection, 'commitPage').mockImplementation(() => undefined);
        vi.spyOn(wizardNavigationService, 'forceNext');

        expect(wizardNavigationService.wizardHasAltNext, 'wizard alt-next false by default').toBe(false);
        expect(currentPage.stopNext, 'page alt-next false by default').toBe(false);
        expect(currentPage.preventDefault, 'page prevent default false by default').toBe(false);

        wizardNavigationService.checkAndCommitCurrentPage('danger');
        const currentAsExpected = wizardNavigationService.currentPage === expectedPage;

        // these get called in routines outside of checkAndCommit by default. simplify in the future?
        expect(currentPage.onCommit.emit).not.toHaveBeenCalled();

        // still need some events fired
        expect(wizardNavigationService.pageCollection.commitPage).toHaveBeenCalledTimes(1);
        expect(currentPage.primaryButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(currentPage.dangerButtonClicked.emit).toHaveBeenCalledTimes(1);
        expect(wizardNavigationService.forceNext).toHaveBeenCalledTimes(1);

        expect(currentAsExpected, 'wizard navigated').toBe(true);
      });
    });

    describe('.canGoTo() -- ', () => {
      it('should return false if pages parameter is falsy', () => {
        expect(wizardNavigationService.canGoTo(null), 'null returns false').toBe(false);
      });

      it('should return false if pages parameter is empty array', () => {
        expect(wizardNavigationService.canGoTo([]), 'empty array returns false').toBe(false);
      });

      it('should return true if all pages passed to it are completed', () => {
        const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
        const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
        const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);

        firstPage.completed = true;
        secondPage.completed = true;
        thirdPage.completed = true;
        const pagesToTest = [firstPage, secondPage, thirdPage];

        expect(wizardNavigationService.canGoTo(pagesToTest)).toBe(true);
      });

      it('should return true if last page is incomplete but page before it is complete', () => {
        const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
        const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
        const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);

        firstPage.completed = true;
        secondPage.completed = true;
        thirdPage.completed = false;
        const pagesToTest = [firstPage, secondPage, thirdPage];

        expect(wizardNavigationService.canGoTo(pagesToTest)).toBe(true);
      });

      it('should return true if last page is incomplete but current page', () => {
        const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
        const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);

        firstPage.completed = true;
        secondPage.completed = false;
        wizardNavigationService.currentPage = secondPage;

        const pagesToTest = [firstPage, secondPage];

        expect(wizardNavigationService.canGoTo(pagesToTest)).toBe(true);
      });

      it('should return false if last page is incomplete and page before it is also incomplete', () => {
        const firstPage = wizardNavigationService.pageCollection.getPageByIndex(0);
        const secondPage = wizardNavigationService.pageCollection.getPageByIndex(1);
        const thirdPage = wizardNavigationService.pageCollection.getPageByIndex(2);

        firstPage.completed = true;
        secondPage.completed = false;
        thirdPage.completed = false;
        const pagesToTest = [firstPage, secondPage, thirdPage];

        expect(wizardNavigationService.canGoTo(pagesToTest)).toBe(false);
      });
    });
  });
});
