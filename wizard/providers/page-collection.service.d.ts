import { QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { ClrWizardPage } from '../wizard-page';
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
export declare class PageCollectionService {
    /**
     * A reference to the Wizard.pages QueryList.
     *
     * Populated when the wizard is created.
     *
     * @memberof PageCollectionService
     */
    pages: QueryList<ClrWizardPage>;
    /**
     *
     * @memberof PageCollectionService
     */
    private _pagesReset;
    /**
     * Converts the PageCollectionService.pages QueryList to an array and returns it.
     *
     * Useful for many instances when you would prefer a QueryList to act like an array.
     *
     * @memberof PageCollectionService
     */
    get pagesAsArray(): ClrWizardPage[];
    /**
     * Returns the length of the pages query list.
     *
     * @memberof PageCollectionService
     */
    get pagesCount(): number;
    /**
     * Returns the next-to-last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get penultimatePage(): ClrWizardPage;
    /**
     * Returns the last page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get lastPage(): ClrWizardPage;
    /**
     * Returns the first page in the query list of pages. Operates as a getter
     * so that it isn't working with stale data.
     *
     * @memberof PageCollectionService
     */
    get firstPage(): ClrWizardPage;
    /**
     * An observable that the navigation service listens to in order to know when
     * the page collection completed states have been reset to false so that way it
     * can also reset the navigation to make the first page in the page collection
     * current/active.
     *
     * @memberof PageCollectionService
     */
    get pagesReset(): Observable<boolean>;
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
    getPageById(id: string): ClrWizardPage;
    /**
     * Accepts s number as a parameter and treats that number as the index of the page
     * you're looking for in the collection of pages. Returns a  wizard page object.
     *
     * @memberof PageCollectionService
     */
    getPageByIndex(index: number): ClrWizardPage;
    /**
     * Takes a wizard page object as a parameter and returns its index in the
     * collection of pages.
     *
     * @memberof PageCollectionService
     */
    getPageIndex(page: ClrWizardPage): number;
    /**
     * Accepts two numeric indexes and returns an array of wizard page objects that include
     * all wizard pages in the page collection from the first index to the second.
     *
     * @memberof PageCollectionService
     */
    pageRange(start: number, end: number): ClrWizardPage[];
    /**
     * Accepts two wizard page objects and returns those page objects with all other page
     * objects between them in the page collection. It doesn't care which page is ahead of the
     * other in the parameters. It will be smart enough to figure that out  on its own.
     *
     * @memberof PageCollectionService
     */
    getPageRangeFromPages(page: ClrWizardPage, otherPage: ClrWizardPage): ClrWizardPage[];
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately before it in the page collection. Returns null if there is
     * no page before the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getPreviousPage(page: ClrWizardPage): ClrWizardPage;
    /**
     * Accepts a wizard page object as a parameter and returns a Boolean that says if
     * the page you sent it is complete.
     *
     * @memberof PageCollectionService
     */
    previousPageIsCompleted(page: ClrWizardPage): boolean;
    /**
     * Takes a wizard page object as a parameter and returns the wizard page object of
     * the page immediately after it in the page collection. Returns null if there is
     * no page after the page it is passed.
     *
     * @memberof PageCollectionService
     */
    getNextPage(page: ClrWizardPage): ClrWizardPage;
    /**
     * Takes a wizard page object as a parameter and generates a step item id from the
     * page ID. Returns the generated step item ID as a string.
     *
     * @memberof PageCollectionService
     */
    getStepItemIdForPage(page: ClrWizardPage): string;
    /**
     * Generally only used internally to mark that a specific page has been "committed".
     * This involves marking the page complete and firing the ClrWizardPage.onCommit
     * (clrWizardPageOnCommit) output. Takes the wizard page object that you intend to
     * mark completed as a parameter.
     *
     * @memberof PageCollectionService
     */
    commitPage(page: ClrWizardPage): void;
    /**
     * Sets all completed states of the pages in the page collection to false and
     * notifies the navigation service to likewise reset the navigation.
     *
     * @memberof PageCollectionService
     */
    reset(): void;
    /**
     * Rolls through all the pages in the page collection to make sure there are no
     * incomplete pages sandwiched between completed pages in the workflow. Identifies
     * the first incomplete page index and sets all pages behind it to a completed
     * state of false.
     *
     * @memberof PageCollectionService
     */
    updateCompletedStates(): void;
    /**
     * Retrieves the index of the first incomplete page in the page collection.
     *
     * @memberof PageCollectionService
     */
    findFirstIncompletePageIndex(): number;
    findFirstIncompletePage(): ClrWizardPage;
    /**
     * Consolidates guard logic that prevents a couple of unfortunate edge cases with
     * look ups on the collection of pages.
     *
     * @memberof PageCollectionService
     */
    private checkResults;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageCollectionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageCollectionService>;
}
