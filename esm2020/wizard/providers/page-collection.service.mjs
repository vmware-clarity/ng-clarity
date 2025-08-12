/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
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
export class PageCollectionService {
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
}
PageCollectionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: PageCollectionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PageCollectionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: PageCollectionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: PageCollectionService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy93aXphcmQvcHJvdmlkZXJzL3BhZ2UtY29sbGVjdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUV0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUkvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQURsQztRQVdFOzs7V0FHRztRQUNLLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztLQTJXOUM7SUF6V0M7Ozs7OztPQU1HO0lBQ0gsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFBSSxlQUFlO1FBQ2pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFbEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksUUFBUTtRQUNWLE1BQU0sU0FBUyxHQUFH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RTtZQUN4QixXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDbkM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsdUJBQXVCO1FBQ3JCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDOUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssWUFBWSxDQUFDLE9BQXdCLEVBQUUsZUFBdUI7UUFDcEUsTUFBTSxlQUFlLEdBQVcsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFFcEQsSUFBSSxlQUFlLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLEdBQUcsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ3JGO2FBQU0sSUFBSSxlQUFlLEdBQUcsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLEdBQUcsZUFBZSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzlFO2FBQU07WUFDTCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQjtJQUNILENBQUM7O2tIQXhYVSxxQkFBcUI7c0hBQXJCLHFCQUFxQjsyRkFBckIscUJBQXFCO2tCQURqQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBRdWVyeUxpc3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC1wYWdlJztcblxuLyoqXG4gKiBQYWdlQ29sbGVjdGlvblNlcnZpY2UgbWFuYWdlcyB0aGUgY29sbGVjdGlvbiBvZiBwYWdlcyBhc3NpZ25lZCB0byB0aGUgd2l6YXJkIGFuZCBvZmZlcnNcbiAqIGEgbnVtYmVyIG9mIGZ1bmN0aW9ucyB1c2VmdWwgYWNyb3NzIHRoZSB3aXphcmRzIHByb3ZpZGVycyBhbmQgc3ViY29tcG9uZW50cyAtLSBhbGwgcmVsYXRlZFxuICogdG8gZXNzZW50aWFsbHkgbG9va3VwcyBvbiB0aGUgY29sbGVjdGlvbiBvZiBwYWdlcy5cbiAqXG4gKiBUaGUgZWFzaWVzdCB3YXkgdG8gYWNjZXNzIFBhZ2VDb2xsZWN0aW9uU2VydmljZSBpcyB2aWEgdGhlIHdpemFyZC4gVGhlXG4gKiBmb2xsb3dpbmcgZXhhbXBsZSB3b3VsZCBhbGxvdyB5b3UgdG8gYWNjZXNzIHlvdXIgaW5zdGFuY2Ugb2YgdGhlIHdpemFyZCBmcm9tIHlvdXIgaG9zdFxuICogY29tcG9uZW50IGFuZCB0aGVyZWJ5IGFjY2VzcyB0aGUgcGFnZSBjb2xsZWN0aW9uIHZpYSBZb3VySG9zdENvbXBvbmVudC53aXphcmQucGFnZUNvbGxlY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIDxjbHItd2l6YXJkICN3aXphcmQgLi4uPlxuICpcbiAqIEBleGFtcGxlXG4gKiBleHBvcnQgY2xhc3MgWW91ckhvc3RDb21wb25lbnQge1xuICogICBAVmlld0NoaWxkKFwid2l6YXJkXCIpIHdpemFyZDogV2l6YXJkO1xuICogICAuLi5cbiAqIH1cbiAqXG4gKiBUaGUgaGVhcnQgb2YgdGhlIHBhZ2UgY29sbGVjdGlvbiBpcyB0aGUgcXVlcnkgbGlzdCBvZiBwYWdlcywgd2hpY2ggaXQgaXMgYXNzaWduZWQgYXMgYVxuICogcmVmZXJlbmNlIHRvIHRoZSBXaXphcmQucGFnZXMgUXVlcnlMaXN0IHdoZW4gdGhlIHdpemFyZCBpcyBjcmVhdGVkLlxuICpcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBhZ2VDb2xsZWN0aW9uU2VydmljZSB7XG4gIC8qKlxuICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgV2l6YXJkLnBhZ2VzIFF1ZXJ5TGlzdC5cbiAgICpcbiAgICogUG9wdWxhdGVkIHdoZW4gdGhlIHdpemFyZCBpcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBwYWdlczogUXVlcnlMaXN0PENscldpemFyZFBhZ2U+O1xuXG4gIC8qKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBwcml2YXRlIF9wYWdlc1Jlc2V0ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKipcbiAgICogQ29udmVydHMgdGhlIFBhZ2VDb2xsZWN0aW9uU2VydmljZS5wYWdlcyBRdWVyeUxpc3QgdG8gYW4gYXJyYXkgYW5kIHJldHVybnMgaXQuXG4gICAqXG4gICAqIFVzZWZ1bCBmb3IgbWFueSBpbnN0YW5jZXMgd2hlbiB5b3Ugd291bGQgcHJlZmVyIGEgUXVlcnlMaXN0IHRvIGFjdCBsaWtlIGFuIGFycmF5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBnZXQgcGFnZXNBc0FycmF5KCk6IENscldpemFyZFBhZ2VbXSB7XG4gICAgcmV0dXJuIHRoaXMucGFnZXMgPyB0aGlzLnBhZ2VzLnRvQXJyYXkoKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgcGFnZXMgcXVlcnkgbGlzdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IHBhZ2VzQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlcyA/IHRoaXMucGFnZXMubGVuZ3RoIDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBuZXh0LXRvLWxhc3QgcGFnZSBpbiB0aGUgcXVlcnkgbGlzdCBvZiBwYWdlcy4gT3BlcmF0ZXMgYXMgYSBnZXR0ZXJcbiAgICogc28gdGhhdCBpdCBpc24ndCB3b3JraW5nIHdpdGggc3RhbGUgZGF0YS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IHBlbnVsdGltYXRlUGFnZSgpOiBDbHJXaXphcmRQYWdlIHtcbiAgICBjb25zdCBwYWdlQ291bnQgPSB0aGlzLnBhZ2VzQ291bnQ7XG5cbiAgICBpZiAocGFnZUNvdW50IDwgMikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFnZXNBc0FycmF5W3BhZ2VDb3VudCAtIDJdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxhc3QgcGFnZSBpbiB0aGUgcXVlcnkgbGlzdCBvZiBwYWdlcy4gT3BlcmF0ZXMgYXMgYSBnZXR0ZXJcbiAgICogc28gdGhhdCBpdCBpc24ndCB3b3JraW5nIHdpdGggc3RhbGUgZGF0YS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IGxhc3RQYWdlKCk6IENscldpemFyZFBhZ2Uge1xuICAgIGNvbnN0IHBhZ2VDb3VudCA9IHRoaXMucGFnZXNDb3VudDtcblxuICAgIGlmIChwYWdlQ291bnQgPCAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYWdlc0FzQXJyYXlbcGFnZUNvdW50IC0gMV07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgcXVlcnkgbGlzdCBvZiBwYWdlcy4gT3BlcmF0ZXMgYXMgYSBnZXR0ZXJcbiAgICogc28gdGhhdCBpdCBpc24ndCB3b3JraW5nIHdpdGggc3RhbGUgZGF0YS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0IGZpcnN0UGFnZSgpOiBDbHJXaXphcmRQYWdlIHtcbiAgICBpZiAoIXRoaXMucGFnZXNDb3VudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFnZXNBc0FycmF5WzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdGhhdCB0aGUgbmF2aWdhdGlvbiBzZXJ2aWNlIGxpc3RlbnMgdG8gaW4gb3JkZXIgdG8ga25vdyB3aGVuXG4gICAqIHRoZSBwYWdlIGNvbGxlY3Rpb24gY29tcGxldGVkIHN0YXRlcyBoYXZlIGJlZW4gcmVzZXQgdG8gZmFsc2Ugc28gdGhhdCB3YXkgaXRcbiAgICogY2FuIGFsc28gcmVzZXQgdGhlIG5hdmlnYXRpb24gdG8gbWFrZSB0aGUgZmlyc3QgcGFnZSBpbiB0aGUgcGFnZSBjb2xsZWN0aW9uXG4gICAqIGN1cnJlbnQvYWN0aXZlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBnZXQgcGFnZXNSZXNldCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZXNSZXNldC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIG1vc3RseSBpbnRlcm5hbGx5LCBidXQgYWNjZXB0cyBhIHN0cmluZyBJRCBhbmQgcmV0dXJucyBhIENscldpemFyZFBhZ2VcbiAgICogb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgSUQgcGFzc2VkLiBOb3RlIHRoYXQgSURzIGhlcmUgc2hvdWxkIGluY2x1ZGUgdGhlIHByZWZpeFxuICAgKiBcImNsci13aXphcmQtcGFnZS1cIi5cbiAgICpcbiAgICogUmV0dXJucyB0aGUgbmV4dC10by1sYXN0IHBhZ2UgaW4gdGhlIHF1ZXJ5IGxpc3Qgb2YgcGFnZXMuIE9wZXJhdGVzIGFzIGEgZ2V0dGVyXG4gICAqIHNvIHRoYXQgaXQgaXNuJ3Qgd29ya2luZyB3aXRoIHN0YWxlIGRhdGEuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIGdldFBhZ2VCeUlkKGlkOiBzdHJpbmcpOiBDbHJXaXphcmRQYWdlIHtcbiAgICBjb25zdCBmb3VuZFBhZ2VzOiBDbHJXaXphcmRQYWdlW10gPSB0aGlzLnBhZ2VzLmZpbHRlcigocGFnZTogQ2xyV2l6YXJkUGFnZSkgPT4gaWQgPT09IHBhZ2UuaWQpO1xuICAgIHJldHVybiB0aGlzLmNoZWNrUmVzdWx0cyhmb3VuZFBhZ2VzLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBzIG51bWJlciBhcyBhIHBhcmFtZXRlciBhbmQgdHJlYXRzIHRoYXQgbnVtYmVyIGFzIHRoZSBpbmRleCBvZiB0aGUgcGFnZVxuICAgKiB5b3UncmUgbG9va2luZyBmb3IgaW4gdGhlIGNvbGxlY3Rpb24gb2YgcGFnZXMuIFJldHVybnMgYSAgd2l6YXJkIHBhZ2Ugb2JqZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBnZXRQYWdlQnlJbmRleChpbmRleDogbnVtYmVyKTogQ2xyV2l6YXJkUGFnZSB7XG4gICAgY29uc3QgcGFnZUNvdW50ID0gdGhpcy5wYWdlc0NvdW50O1xuICAgIGNvbnN0IHBhZ2VzTGFzdEluZGV4OiBudW1iZXIgPSBwYWdlQ291bnQgPiAxID8gcGFnZUNvdW50IC0gMSA6IDA7XG5cbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCByZXRyaWV2ZSBwYWdlIHdpdGggaW5kZXggb2YgJyArIGluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPiBwYWdlc0xhc3RJbmRleCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYWdlIGluZGV4IGlzIGdyZWF0ZXIgdGhhbiBsZW5ndGggb2YgcGFnZXMgYXJyYXkuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFnZXNBc0FycmF5W2luZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHdpemFyZCBwYWdlIG9iamVjdCBhcyBhIHBhcmFtZXRlciBhbmQgcmV0dXJucyBpdHMgaW5kZXggaW4gdGhlXG4gICAqIGNvbGxlY3Rpb24gb2YgcGFnZXMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIGdldFBhZ2VJbmRleChwYWdlOiBDbHJXaXphcmRQYWdlKTogbnVtYmVyIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucGFnZXNBc0FycmF5LmluZGV4T2YocGFnZSk7XG5cbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVlc3RlZCBwYWdlIGNhbm5vdCBiZSBmb3VuZCBpbiBjb2xsZWN0aW9uIG9mIHBhZ2VzLicpO1xuICAgIH1cblxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2NlcHRzIHR3byBudW1lcmljIGluZGV4ZXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2Ygd2l6YXJkIHBhZ2Ugb2JqZWN0cyB0aGF0IGluY2x1ZGVcbiAgICogYWxsIHdpemFyZCBwYWdlcyBpbiB0aGUgcGFnZSBjb2xsZWN0aW9uIGZyb20gdGhlIGZpcnN0IGluZGV4IHRvIHRoZSBzZWNvbmQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIHBhZ2VSYW5nZShzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcik6IENscldpemFyZFBhZ2VbXSB7XG4gICAgbGV0IHBhZ2VzOiBDbHJXaXphcmRQYWdlW10gPSBbXTtcblxuICAgIGlmIChzdGFydCA8IDAgfHwgZW5kIDwgMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA9PT0gbnVsbCB8fCB0eXBlb2Ygc3RhcnQgPT09ICd1bmRlZmluZWQnIHx8IGlzTmFOKHN0YXJ0KSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChlbmQgPT09IG51bGwgfHwgdHlwZW9mIGVuZCA9PT0gJ3VuZGVmaW5lZCcgfHwgaXNOYU4oZW5kKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChlbmQgPiB0aGlzLnBhZ2VzQ291bnQpIHtcbiAgICAgIGVuZCA9IHRoaXMucGFnZXNDb3VudDtcbiAgICB9XG5cbiAgICBwYWdlcyA9IHRoaXMucGFnZXNBc0FycmF5O1xuXG4gICAgaWYgKGVuZCAtIHN0YXJ0ID09PSAwKSB7XG4gICAgICAvLyBqdXN0IHJldHVybiB0aGUgb25lIHBhZ2UgdGhleSB3YW50XG4gICAgICByZXR1cm4gW3RoaXMuZ2V0UGFnZUJ5SW5kZXgoc3RhcnQpXTtcbiAgICB9XG5cbiAgICAvLyBzbGljZSBlbmQgZG9lcyBub3QgaW5jbHVkZSBpdGVtIHJlZmVyZW5jZWQgYnkgZW5kIGluZGV4LCB3aGljaCBpcyB3ZWlyZCBmb3IgdXNlcnNcbiAgICAvLyBpbmNyZW1lbnRpbmcgZW5kIGluZGV4IGhlcmUgdG8gY29ycmVjdCB0aGF0IHNvIHVzZXJzIGFuZCBvdGhlciBtZXRob2RzXG4gICAgLy8gZG9uJ3QgaGF2ZSB0byB0aGluayBhYm91dCBpdFxuICAgIGVuZCA9IGVuZCArIDE7XG5cbiAgICAvLyBzbGljZSBkb2VzIG5vdCByZXR1cm4gdGhlIGxhc3Qgb25lIGluIHRoZSByYW5nZSBidXQgaXQgZG9lcyBpbmNsdWRlIHRoZSBmaXJzdCBvbmVcbiAgICAvLyBkb2VzIG5vdCBtb2RpZnkgb3JpZ2luYWwgYXJyYXlcbiAgICByZXR1cm4gcGFnZXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyB0d28gd2l6YXJkIHBhZ2Ugb2JqZWN0cyBhbmQgcmV0dXJucyB0aG9zZSBwYWdlIG9iamVjdHMgd2l0aCBhbGwgb3RoZXIgcGFnZVxuICAgKiBvYmplY3RzIGJldHdlZW4gdGhlbSBpbiB0aGUgcGFnZSBjb2xsZWN0aW9uLiBJdCBkb2Vzbid0IGNhcmUgd2hpY2ggcGFnZSBpcyBhaGVhZCBvZiB0aGVcbiAgICogb3RoZXIgaW4gdGhlIHBhcmFtZXRlcnMuIEl0IHdpbGwgYmUgc21hcnQgZW5vdWdoIHRvIGZpZ3VyZSB0aGF0IG91dCAgb24gaXRzIG93bi5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0UGFnZVJhbmdlRnJvbVBhZ2VzKHBhZ2U6IENscldpemFyZFBhZ2UsIG90aGVyUGFnZTogQ2xyV2l6YXJkUGFnZSk6IENscldpemFyZFBhZ2VbXSB7XG4gICAgY29uc3QgcGFnZUluZGV4ID0gdGhpcy5nZXRQYWdlSW5kZXgocGFnZSk7XG4gICAgY29uc3Qgb3RoZXJQYWdlSW5kZXggPSB0aGlzLmdldFBhZ2VJbmRleChvdGhlclBhZ2UpO1xuICAgIGxldCBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgbGV0IGVuZEluZGV4OiBudW1iZXI7XG5cbiAgICBpZiAocGFnZUluZGV4IDw9IG90aGVyUGFnZUluZGV4KSB7XG4gICAgICBzdGFydEluZGV4ID0gcGFnZUluZGV4O1xuICAgICAgZW5kSW5kZXggPSBvdGhlclBhZ2VJbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRJbmRleCA9IG90aGVyUGFnZUluZGV4O1xuICAgICAgZW5kSW5kZXggPSBwYWdlSW5kZXg7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhZ2VSYW5nZShzdGFydEluZGV4LCBlbmRJbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB3aXphcmQgcGFnZSBvYmplY3QgYXMgYSBwYXJhbWV0ZXIgYW5kIHJldHVybnMgdGhlIHdpemFyZCBwYWdlIG9iamVjdCBvZlxuICAgKiB0aGUgcGFnZSBpbW1lZGlhdGVseSBiZWZvcmUgaXQgaW4gdGhlIHBhZ2UgY29sbGVjdGlvbi4gUmV0dXJucyBudWxsIGlmIHRoZXJlIGlzXG4gICAqIG5vIHBhZ2UgYmVmb3JlIHRoZSBwYWdlIGl0IGlzIHBhc3NlZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgZ2V0UHJldmlvdXNQYWdlKHBhZ2U6IENscldpemFyZFBhZ2UpIHtcbiAgICBjb25zdCBteVBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KHBhZ2UpO1xuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gbXlQYWdlSW5kZXggLSAxO1xuICAgIGlmIChwcmV2aW91c1BhZ2VJbmRleCA8IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRQYWdlQnlJbmRleChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0cyBhIHdpemFyZCBwYWdlIG9iamVjdCBhcyBhIHBhcmFtZXRlciBhbmQgcmV0dXJucyBhIEJvb2xlYW4gdGhhdCBzYXlzIGlmXG4gICAqIHRoZSBwYWdlIHlvdSBzZW50IGl0IGlzIGNvbXBsZXRlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBwcmV2aW91c1BhZ2VJc0NvbXBsZXRlZChwYWdlOiBDbHJXaXphcmRQYWdlKSB7XG4gICAgaWYgKCFwYWdlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlID0gdGhpcy5nZXRQcmV2aW91c1BhZ2UocGFnZSk7XG5cbiAgICBpZiAobnVsbCA9PT0gcHJldmlvdXNQYWdlKSB7XG4gICAgICAvLyBwYWdlIGlzIHRoZSBmaXJzdCBwYWdlLiBubyBwcmV2aW91cyBwYWdlLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXZpb3VzUGFnZS5jb21wbGV0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB3aXphcmQgcGFnZSBvYmplY3QgYXMgYSBwYXJhbWV0ZXIgYW5kIHJldHVybnMgdGhlIHdpemFyZCBwYWdlIG9iamVjdCBvZlxuICAgKiB0aGUgcGFnZSBpbW1lZGlhdGVseSBhZnRlciBpdCBpbiB0aGUgcGFnZSBjb2xsZWN0aW9uLiBSZXR1cm5zIG51bGwgaWYgdGhlcmUgaXNcbiAgICogbm8gcGFnZSBhZnRlciB0aGUgcGFnZSBpdCBpcyBwYXNzZWQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIGdldE5leHRQYWdlKHBhZ2U6IENscldpemFyZFBhZ2UpIHtcbiAgICBjb25zdCBteVBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KHBhZ2UpO1xuICAgIGNvbnN0IG5leHRQYWdlSW5kZXggPSBteVBhZ2VJbmRleCArIDE7XG5cbiAgICBpZiAobmV4dFBhZ2VJbmRleCA+PSB0aGlzLnBhZ2VzQXNBcnJheS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRQYWdlQnlJbmRleChuZXh0UGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHdpemFyZCBwYWdlIG9iamVjdCBhcyBhIHBhcmFtZXRlciBhbmQgZ2VuZXJhdGVzIGEgc3RlcCBpdGVtIGlkIGZyb20gdGhlXG4gICAqIHBhZ2UgSUQuIFJldHVybnMgdGhlIGdlbmVyYXRlZCBzdGVwIGl0ZW0gSUQgYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIGdldFN0ZXBJdGVtSWRGb3JQYWdlKHBhZ2U6IENscldpemFyZFBhZ2UpIHtcbiAgICBjb25zdCBwYWdlSWQgPSBwYWdlLmlkO1xuICAgIGNvbnN0IHBhZ2VJZFBhcnRzID0gcGFnZUlkLnNwbGl0KCctJykucmV2ZXJzZSgpO1xuXG4gICAgcGFnZUlkUGFydHNbMV0gPSAnc3RlcCc7XG4gICAgcmV0dXJuIHBhZ2VJZFBhcnRzLnJldmVyc2UoKS5qb2luKCctJyk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhbGx5IG9ubHkgdXNlZCBpbnRlcm5hbGx5IHRvIG1hcmsgdGhhdCBhIHNwZWNpZmljIHBhZ2UgaGFzIGJlZW4gXCJjb21taXR0ZWRcIi5cbiAgICogVGhpcyBpbnZvbHZlcyBtYXJraW5nIHRoZSBwYWdlIGNvbXBsZXRlIGFuZCBmaXJpbmcgdGhlIENscldpemFyZFBhZ2Uub25Db21taXRcbiAgICogKGNscldpemFyZFBhZ2VPbkNvbW1pdCkgb3V0cHV0LiBUYWtlcyB0aGUgd2l6YXJkIHBhZ2Ugb2JqZWN0IHRoYXQgeW91IGludGVuZCB0b1xuICAgKiBtYXJrIGNvbXBsZXRlZCBhcyBhIHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIFBhZ2VDb2xsZWN0aW9uU2VydmljZVxuICAgKi9cbiAgY29tbWl0UGFnZShwYWdlOiBDbHJXaXphcmRQYWdlKSB7XG4gICAgY29uc3QgcGFnZUhhc092ZXJyaWRlcyA9IHBhZ2Uuc3RvcE5leHQgfHwgcGFnZS5wcmV2ZW50RGVmYXVsdDtcbiAgICBwYWdlLmNvbXBsZXRlZCA9IHRydWU7XG5cbiAgICBpZiAoIXBhZ2VIYXNPdmVycmlkZXMpIHtcbiAgICAgIC8vIHByZXZlbnQgbG9vcCBvZiBldmVudCBlbWlzc2lvbjsgYWx0ZXJuYXRlIGZsb3dzIHdvcmsgb2ZmXG4gICAgICAvLyBvZiBldmVudCBlbWl0dGVycyB0aGlzIGlzIGhvdyB0aGV5IGJyZWFrIHRoYXQgY3ljbGUuXG4gICAgICBwYWdlLm9uQ29tbWl0LmVtaXQocGFnZS5pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIGNvbXBsZXRlZCBzdGF0ZXMgb2YgdGhlIHBhZ2VzIGluIHRoZSBwYWdlIGNvbGxlY3Rpb24gdG8gZmFsc2UgYW5kXG4gICAqIG5vdGlmaWVzIHRoZSBuYXZpZ2F0aW9uIHNlcnZpY2UgdG8gbGlrZXdpc2UgcmVzZXQgdGhlIG5hdmlnYXRpb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucGFnZXNBc0FycmF5LmZvckVhY2goKHBhZ2U6IENscldpemFyZFBhZ2UpID0+IHtcbiAgICAgIHBhZ2UuY29tcGxldGVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy5fcGFnZXNSZXNldC5uZXh0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJvbGxzIHRocm91Z2ggYWxsIHRoZSBwYWdlcyBpbiB0aGUgcGFnZSBjb2xsZWN0aW9uIHRvIG1ha2Ugc3VyZSB0aGVyZSBhcmUgbm9cbiAgICogaW5jb21wbGV0ZSBwYWdlcyBzYW5kd2ljaGVkIGJldHdlZW4gY29tcGxldGVkIHBhZ2VzIGluIHRoZSB3b3JrZmxvdy4gSWRlbnRpZmllc1xuICAgKiB0aGUgZmlyc3QgaW5jb21wbGV0ZSBwYWdlIGluZGV4IGFuZCBzZXRzIGFsbCBwYWdlcyBiZWhpbmQgaXQgdG8gYSBjb21wbGV0ZWRcbiAgICogc3RhdGUgb2YgZmFsc2UuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIHVwZGF0ZUNvbXBsZXRlZFN0YXRlcygpOiB2b2lkIHtcbiAgICBjb25zdCBmaXJzdEluY29tcGxldGVJbmRleCA9IHRoaXMuZmluZEZpcnN0SW5jb21wbGV0ZVBhZ2VJbmRleCgpO1xuXG4gICAgaWYgKGZpcnN0SW5jb21wbGV0ZUluZGV4ID09PSB0aGlzLnBhZ2VzQXNBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICAvLyBhbGwgY29tcGxldGUgbm8gbmVlZCB0byBkbyBhbnl0aGluZ1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucGFnZXNBc0FycmF5LmZvckVhY2goKHBhZ2U6IENscldpemFyZFBhZ2UsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChpbmRleCA+IGZpcnN0SW5jb21wbGV0ZUluZGV4KSB7XG4gICAgICAgIHBhZ2UuY29tcGxldGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgaW5jb21wbGV0ZSBwYWdlIGluIHRoZSBwYWdlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBQYWdlQ29sbGVjdGlvblNlcnZpY2VcbiAgICovXG4gIGZpbmRGaXJzdEluY29tcGxldGVQYWdlSW5kZXgoKTogbnVtYmVyIHtcbiAgICBsZXQgcmV0dXJuSW5kZXg6IG51bWJlciA9IG51bGw7XG4gICAgdGhpcy5wYWdlc0FzQXJyYXkuZm9yRWFjaCgocGFnZTogQ2xyV2l6YXJkUGFnZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKG51bGwgPT09IHJldHVybkluZGV4ICYmIGZhbHNlID09PSBwYWdlLmNvbXBsZXRlZCkge1xuICAgICAgICByZXR1cm5JbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZmFsbHRocm91Z2gsIGFsbCBjb21wbGV0ZWQsIHJldHVybiBsYXN0IHBhZ2VcbiAgICBpZiAobnVsbCA9PT0gcmV0dXJuSW5kZXgpIHtcbiAgICAgIHJldHVybkluZGV4ID0gdGhpcy5wYWdlc0NvdW50IC0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuSW5kZXg7XG4gIH1cblxuICBmaW5kRmlyc3RJbmNvbXBsZXRlUGFnZSgpOiBDbHJXaXphcmRQYWdlIHtcbiAgICBjb25zdCBteUluY29tcGxldGVJbmRleCA9IHRoaXMuZmluZEZpcnN0SW5jb21wbGV0ZVBhZ2VJbmRleCgpO1xuICAgIHJldHVybiB0aGlzLnBhZ2VzQXNBcnJheVtteUluY29tcGxldGVJbmRleF07XG4gIH1cblxuICAvKipcbiAgICogQ29uc29saWRhdGVzIGd1YXJkIGxvZ2ljIHRoYXQgcHJldmVudHMgYSBjb3VwbGUgb2YgdW5mb3J0dW5hdGUgZWRnZSBjYXNlcyB3aXRoXG4gICAqIGxvb2sgdXBzIG9uIHRoZSBjb2xsZWN0aW9uIG9mIHBhZ2VzLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlXG4gICAqL1xuICBwcml2YXRlIGNoZWNrUmVzdWx0cyhyZXN1bHRzOiBDbHJXaXphcmRQYWdlW10sIHJlcXVlc3RlZFBhZ2VJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZm91bmRQYWdlc0NvdW50OiBudW1iZXIgPSByZXN1bHRzLmxlbmd0aCB8fCAwO1xuXG4gICAgaWYgKGZvdW5kUGFnZXNDb3VudCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTW9yZSB0aGFuIG9uZSBwYWdlIGhhcyB0aGUgcmVxdWVzdGVkIGlkICcgKyByZXF1ZXN0ZWRQYWdlSWQgKyAnLicpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRQYWdlc0NvdW50IDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBwYWdlIGNhbiBiZSBmb3VuZCB3aXRoIHRoZSBpZCAnICsgcmVxdWVzdGVkUGFnZUlkICsgJy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdHNbMF07XG4gICAgfVxuICB9XG59XG4iXX0=