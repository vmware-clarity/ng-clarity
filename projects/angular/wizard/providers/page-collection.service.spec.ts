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
import { errorLike } from '../../../test-matchers';

describe('New Wizard Tests', () => {
  describe('Page Collection Service', () => {
    const helpers = createTestHelpers();

    let context: TestContext<ClrWizard, BasicWizardTestComponent>;
    let pageCollectionService: PageCollectionService;

    beforeEach(() => {
      context = helpers.create(ClrWizard, BasicWizardTestComponent);
      pageCollectionService = context.getClarityProvider(PageCollectionService);
      context.detectChanges();
    });

    it('.pagesAsArray should return the array of wizard pages', () => {
      expect(pageCollectionService.pagesAsArray).toEqual(context.clarityDirective.pages.toArray());
    });

    it('.pagesCount should return correct number of pages', () => {
      expect(pageCollectionService.pagesCount).toEqual(5);
    });

    it('.lastPage should return the last wizard page', () => {
      expect(pageCollectionService.lastPage.id).toEqual(context.clarityDirective.pages.last.id);
    });

    it('.firstPage should return the first wizard page', () => {
      expect(pageCollectionService.firstPage.id).toEqual(context.clarityDirective.pages.first.id);
    });

    it('.getPageById() should return the wizard page with a matching id', () => {
      // checkResults() method is tested here as well
      const firstPageId = context.clarityDirective.pages.first.id;
      const firstPageIdNumber = firstPageId.match(/\d+/)[0];
      const lastPageId = context.clarityDirective.pages.last.id;
      const nonExistingPageId = 'N0N-EX1ST1N-ID';

      expect(pageCollectionService.getPageById(firstPageId)).toEqual(pageCollectionService.firstPage);
      expect(pageCollectionService.getPageById(lastPageId)).toEqual(pageCollectionService.lastPage);

      expect(function () {
        pageCollectionService.getPageById(nonExistingPageId);
      }).toThrowError(errorLike('No page can be found with the id ' + nonExistingPageId + '.'));

      // Manually setting this id to make multiple pages have the same id.
      pageCollectionService.getPageById(lastPageId)._id = firstPageIdNumber;

      expect(function () {
        pageCollectionService.getPageById(firstPageId);
      }).toThrowError(errorLike('More than one page has the requested id ' + firstPageId + '.'));
    });

    it('.getPageByIndex() should return the index of the wizard page', () => {
      expect(pageCollectionService.getPageByIndex(0)).toEqual(pageCollectionService.firstPage);
      expect(pageCollectionService.getPageByIndex(4)).toEqual(pageCollectionService.lastPage);

      expect(function () {
        pageCollectionService.getPageByIndex(-20);
      }).toThrowError(errorLike('Cannot retrieve page with index of -20'));

      expect(function () {
        pageCollectionService.getPageByIndex(10);
      }).toThrowError(errorLike('Page index is greater than length of pages array.'));
    });

    it('.getPageIndex() should return the index of a wizard page', () => {
      expect(pageCollectionService.getPageIndex(pageCollectionService.firstPage)).toBe(0);
    });

    it('.pageRange() should return the range of wizard pages', () => {
      expect(pageCollectionService.pageRange(0, 0)).toEqual([pageCollectionService.firstPage]);

      expect(pageCollectionService.pageRange(4, 4)).toEqual([pageCollectionService.lastPage]);

      expect(pageCollectionService.pageRange(1, 3)).toEqual(pageCollectionService.pagesAsArray.slice(1, 4));

      expect(pageCollectionService.pageRange(1, 3)).toEqual(pageCollectionService.pagesAsArray.slice(1, 4));

      expect(pageCollectionService.pageRange(3, 3)).toEqual(pageCollectionService.pagesAsArray.slice(3, 4));

      expect(pageCollectionService.pageRange(-1, 3)).toEqual([]);

      expect(pageCollectionService.pageRange(-3, -1)).toEqual([]);

      expect(pageCollectionService.pageRange(1, -3)).toEqual([]);

      expect(pageCollectionService.pageRange(null, 3)).toEqual([]);

      expect(pageCollectionService.pageRange(3, undefined)).toEqual([]);

      expect(pageCollectionService.pageRange(null, undefined)).toEqual([]);
    });

    it('.getPageRangeFromPages() should return the range of wizard pages', () => {
      expect(
        pageCollectionService.getPageRangeFromPages(pageCollectionService.firstPage, pageCollectionService.lastPage)
      ).toEqual(pageCollectionService.pageRange(0, 4));

      expect(
        pageCollectionService.getPageRangeFromPages(pageCollectionService.firstPage, pageCollectionService.firstPage)
      ).toEqual(pageCollectionService.pageRange(0, 0));

      expect(
        pageCollectionService.getPageRangeFromPages(
          pageCollectionService.getPageByIndex(1),
          pageCollectionService.getPageByIndex(3)
        )
      ).toEqual(pageCollectionService.pageRange(1, 3));
    });

    it('.getPreviousPage() should return the previous page of the current page', () => {
      expect(pageCollectionService.getPreviousPage(pageCollectionService.lastPage)).toEqual(
        pageCollectionService.getPageByIndex(3)
      );

      expect(pageCollectionService.getPreviousPage(pageCollectionService.getPageByIndex(2))).toEqual(
        pageCollectionService.getPageByIndex(1)
      );

      expect(pageCollectionService.getPreviousPage(pageCollectionService.firstPage)).toBeNull();
    });

    it('.getNextPage() should return the next page of the current page', () => {
      expect(pageCollectionService.getNextPage(pageCollectionService.firstPage)).toEqual(
        pageCollectionService.getPageByIndex(1)
      );

      expect(pageCollectionService.getNextPage(pageCollectionService.getPageByIndex(2))).toEqual(
        pageCollectionService.getPageByIndex(3)
      );

      expect(pageCollectionService.getNextPage(pageCollectionService.lastPage)).toBeNull();
    });

    it('.getStepItemIdForPage() should return the step id of the page', () => {
      const firstPageId = context.clarityDirective.pages.first.id;
      const lastPageId = context.clarityDirective.pages.last.id;

      const firstPageStepId = firstPageId.replace('page', 'step');
      const lastPageStepId = lastPageId.replace('page', 'step');

      expect(pageCollectionService.getStepItemIdForPage(pageCollectionService.firstPage)).toBe(firstPageStepId);
      expect(pageCollectionService.getStepItemIdForPage(pageCollectionService.lastPage)).toBe(lastPageStepId);
    });

    it(".commitPage() should set the page's completed property to true", () => {
      const testPage = pageCollectionService.getPageByIndex(2);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);

      pageCollectionService.commitPage(testPage);

      expect(testPage.onCommit.emit).toHaveBeenCalledTimes(1);
      expect(testPage.completed).toBe(true);
    });

    it('.commitPage() should not fire page.onCommit when page has overrides', () => {
      const testPage = pageCollectionService.getPageByIndex(2);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);

      testPage.stopNext = true;
      context.detectChanges();

      pageCollectionService.commitPage(testPage);

      expect(testPage.onCommit.emit).not.toHaveBeenCalled();
      expect(testPage.completed).toBe(true);
    });

    it('.commitPage() should only fire page.onCommit once if there are wizard overrides', () => {
      const testPage = pageCollectionService.getPageByIndex(2);
      vi.spyOn(testPage.onCommit, 'emit').mockImplementation(() => undefined);

      context.clarityDirective.stopNext = true;
      context.detectChanges();

      pageCollectionService.commitPage(testPage);

      expect(testPage.onCommit.emit).toHaveBeenCalledTimes(1);
      expect(testPage.completed).toBe(true);
    });

    it('.reset() should set the completed properties back to false.', () => {
      pageCollectionService.firstPage.completed = true;
      pageCollectionService.lastPage.completed = true;

      pageCollectionService.reset();

      expect(pageCollectionService.firstPage.completed).toBe(false);
      expect(pageCollectionService.lastPage.completed).toBe(false);
    });

    it('.previousPageIsCompleted() should return true if previous page is completed', () => {
      const secondPage = pageCollectionService.getPageByIndex(1);
      pageCollectionService.firstPage.completed = true;
      context.detectChanges();
      expect(pageCollectionService.previousPageIsCompleted(secondPage)).toBe(true);
    });

    it('.previousPageIsCompleted() should return true if there is no previous page', () => {
      const firstPage = pageCollectionService.firstPage;
      expect(pageCollectionService.previousPageIsCompleted(firstPage)).toBe(true);
    });

    it('.previousPageIsCompleted() should return false if previous page is not complete', () => {
      const secondPage = pageCollectionService.getPageByIndex(1);
      expect(pageCollectionService.firstPage.completed, 'verify first page is not completed').toBe(false);
      expect(
        pageCollectionService.previousPageIsCompleted(secondPage),
        "second page's previous page is not complete"
      ).toBe(false);
    });

    it("updateCompletedStates() shouldn't update completed state if all pages completed", () => {
      const pageArray = [];
      pageArray.push(pageCollectionService.firstPage);
      pageArray.push(pageCollectionService.getPageByIndex(1));
      pageArray.push(pageCollectionService.getPageByIndex(2));
      pageArray.push(pageCollectionService.getPageByIndex(3));
      pageArray.push(pageCollectionService.getPageByIndex(4));

      pageArray.forEach((page: ClrWizardPage) => {
        page.completed = true;
      });
      pageCollectionService.updateCompletedStates();

      expect(pageCollectionService.firstPage.completed, 'first page not updated').toBe(true);
      expect(pageCollectionService.getPageByIndex(1).completed, 'second page not updated').toBe(true);
      expect(pageCollectionService.getPageByIndex(2).completed, 'third page not updated').toBe(true);
      expect(pageCollectionService.getPageByIndex(3).completed, 'fourth page not updated').toBe(true);
      expect(pageCollectionService.getPageByIndex(4).completed, 'fifth page not updated').toBe(true);
    });

    it('updateCompletedStates() should mark pages after first incomplete page as incomplete', () => {
      const pageArray = [];
      pageArray.push(pageCollectionService.firstPage);
      pageArray.push(pageCollectionService.getPageByIndex(1));
      pageArray.push(pageCollectionService.getPageByIndex(3));
      pageArray.push(pageCollectionService.getPageByIndex(4));

      pageArray.forEach((page: ClrWizardPage) => {
        page.completed = true;
      });

      pageCollectionService.updateCompletedStates();

      expect(pageCollectionService.firstPage.completed, 'first page not changed').toBe(true);
      expect(pageCollectionService.getPageByIndex(1).completed, 'second page not changed').toBe(true);
      expect(pageCollectionService.getPageByIndex(2).completed, 'third page never set').toBe(false);
      expect(pageCollectionService.getPageByIndex(3).completed, 'fourth page changed').toBe(false);
      expect(pageCollectionService.getPageByIndex(4).completed, 'fifth page changed').toBe(false);
    });

    it('findFirstIncompletePageIndex() should return index of first incomplete page', () => {
      pageCollectionService.firstPage.completed = true;
      pageCollectionService.getPageByIndex(1).completed = false;
      pageCollectionService.getPageByIndex(2).completed = true;
      pageCollectionService.getPageByIndex(3).completed = false;
      pageCollectionService.getPageByIndex(4).completed = true;
      expect(pageCollectionService.findFirstIncompletePageIndex()).toBe(1);
    });

    it('findFirstIncompletePageIndex() should return last index if all pages complete', () => {
      const pageArray = [];
      const expectedIndex = pageCollectionService.pagesCount - 1;

      pageArray.push(pageCollectionService.firstPage);
      pageArray.push(pageCollectionService.getPageByIndex(1));
      pageArray.push(pageCollectionService.getPageByIndex(2));
      pageArray.push(pageCollectionService.getPageByIndex(3));
      pageArray.push(pageCollectionService.getPageByIndex(4));

      pageArray.forEach((page: ClrWizardPage) => {
        page.completed = true;
      });

      const indexToTest = pageCollectionService.findFirstIncompletePageIndex();

      expect(indexToTest).toBe(expectedIndex);
    });
  });
});
