import * as i0 from '@angular/core';
import { EventEmitter, QueryList, TemplateRef, OnInit, OnDestroy, AfterContentInit, DoCheck, ElementRef, IterableDiffers } from '@angular/core';
import { HeadingLevel, ClrCommonStringsService } from '@clr/angular/utils';
import { Observable, Subscription } from 'rxjs';
import * as i12 from '@angular/common';
import * as i13 from '@clr/angular/icon';
import * as i14 from '@clr/angular/modal';
import * as i15 from '@clr/angular/emphasis/alert';

declare class ButtonHubService {
    buttonsReady: boolean;
    private _previousBtnClicked;
    private _nextBtnClicked;
    private _dangerBtnClicked;
    private _cancelBtnClicked;
    private _finishBtnClicked;
    private _customBtnClicked;
    get previousBtnClicked(): Observable<void>;
    get nextBtnClicked(): Observable<void>;
    get dangerBtnClicked(): Observable<void>;
    get cancelBtnClicked(): Observable<void>;
    get finishBtnClicked(): Observable<void>;
    get customBtnClicked(): Observable<string>;
    buttonClicked(buttonType: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonHubService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonHubService>;
}

declare class ClrWizardHeaderAction {
    title: string;
    _id: string;
    disabled: boolean;
    headerActionClicked: EventEmitter<string>;
    get id(): string;
    click(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardHeaderAction, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardHeaderAction, "clr-wizard-header-action", never, { "title": { "alias": "title"; "required": false; }; "_id": { "alias": "id"; "required": false; }; "disabled": { "alias": "clrWizardHeaderActionDisabled"; "required": false; }; }, { "headerActionClicked": "actionClicked"; }, never, ["*"], false, never>;
}

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
declare class PageCollectionService {
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

declare class ClrWizardPageButtons {
    pageButtonsTemplateRef: TemplateRef<any>;
    constructor(pageButtonsTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageButtons, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageButtons, "[clrPageButtons]", never, {}, {}, never, never, false, never>;
}

declare class ClrWizardPageHeaderActions {
    pageHeaderActionsTemplateRef: TemplateRef<any>;
    constructor(pageHeaderActionsTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageHeaderActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageHeaderActions, "[clrPageHeaderActions]", never, {}, {}, never, never, false, never>;
}

declare class ClrWizardPageNavTitle {
    pageNavTitleTemplateRef: TemplateRef<any>;
    constructor(pageNavTitleTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageNavTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageNavTitle, "[clrPageNavTitle]", never, {}, {}, never, never, false, never>;
}

declare class ClrWizardPageTitle {
    pageTitleTemplateRef: TemplateRef<any>;
    headingLevel: HeadingLevel;
    constructor(pageTitleTemplateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPageTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardPageTitle, "[clrPageTitle]", never, { "headingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, never, false, never>;
}

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
declare class ClrWizardPage implements OnInit {
    private navService;
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
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
    _id: any;
    /**
     * Overrides all actions from the page level, so you can use an alternate function for
     * validation or data-munging with a ClrWizardPage.onCommit (clrWizardPageOnCommit output),
     * ClrWizardPage.onCancel (clrWizardPageOnCancel output), or one
     * of the granular page-level button click event emitters.
     *
     * @memberof WizardPage
     *
     */
    preventDefault: boolean | string;
    /**
     * Emits when the value of ClrWizardPage.nextStepDisabled changes.
     * Should emit the new value of nextStepDisabled.
     *
     * @memberof WizardPage
     *
     */
    nextStepDisabledChange: EventEmitter<boolean>;
    /**
     * Emits when the value of ClrWizardPage.previousStepDisabled changes.
     * Should emit the new value of previousStepDisabled.
     *
     * @memberof WizardPage
     *
     */
    previousStepDisabledChange: EventEmitter<boolean>;
    /**
     *
     * @memberof WizardPage
     *
     */
    stopCancelChange: EventEmitter<boolean>;
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
    onCommit: EventEmitter<string>;
    /**
     * Emits an event when ClrWizardPage becomes the current page of the
     * Wizard.
     *
     * @memberof WizardPage
     *
     */
    onLoad: EventEmitter<string>;
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
    pageOnCancel: EventEmitter<ClrWizardPage>;
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
    finishButtonClicked: EventEmitter<ClrWizardPage>;
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
    previousButtonClicked: EventEmitter<ClrWizardPage>;
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
    nextButtonClicked: EventEmitter<ClrWizardPage>;
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
    dangerButtonClicked: EventEmitter<ClrWizardPage>;
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
    primaryButtonClicked: EventEmitter<string>;
    customButtonClicked: EventEmitter<string>;
    /**
     * Contains a reference to the page title which is used for a number
     * of different tasks for display in the wizard.
     *
     * @memberof WizardPage
     *
     */
    pageTitle: ClrWizardPageTitle;
    /**
     * Contains a reference to the desired title for the page's step in the
     * navigation on the left side of the wizard. Can be projected to change the
     * navigation link's text.
     *
     * If not defined, then ClrWizardPage.pageTitle will be displayed in the stepnav.
     *
     * @memberof WizardPage
     *
     */
    pageNavTitle: ClrWizardPageNavTitle;
    /**
     * Contains a reference to the buttons defined within the page. If not defined,
     * the wizard defaults to the set of buttons defined as a direct child of the
     * wizard.
     *
     * @memberof WizardPage
     *
     */
    _buttons: ClrWizardPageButtons;
    /**
     * Contains a reference to the header actions defined within the page. If not defined,
     * the wizard defaults to the set of header actions defined as a direct child of the
     * wizard.
     *
     * @memberof WizardPage
     *
     */
    _headerActions: ClrWizardPageHeaderActions;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _nextStepDisabled;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _previousStepDisabled;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _hasError;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _stopCancel;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _stopNext;
    /**
     *
     * @memberof WizardPage
     *
     */
    private _complete;
    /**
     * Creates an instance of ClrWizardPage.
     *
     * @memberof WizardPage
     */
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, buttonService: ButtonHubService);
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
    get nextStepDisabled(): boolean;
    set nextStepDisabled(val: boolean);
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
    get previousStepDisabled(): boolean;
    set previousStepDisabled(val: boolean);
    /**
     * Whether the page has an error and also resolve the "falsy" value. The
     * current logic treat a "0" or an empty string as false and likewise will treat any
     * "truthy" value as true.
     *
     * @memberof WizardPage
     *
     */
    get hasError(): boolean;
    set hasError(val: boolean);
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
    get stopCancel(): boolean;
    set stopCancel(val: boolean);
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
    get stopNext(): boolean;
    set stopNext(val: boolean);
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
    get id(): string;
    /**
     * A read-only getter that serves as a convenience for those who would rather
     * not think in the terms of !ClrWizardPage.nextStepDisabled. For some use cases,
     * ClrWizardPage.readyToComplete is more logical and declarative.
     *
     * @memberof WizardPage
     *
     */
    get readyToComplete(): boolean;
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
    get completed(): boolean;
    /**
     * A ClrWizardPage can be manually set to completed using this boolean setter.
     * It is recommended that users rely on the convenience functions in the wizard
     * and navigation service instead of manually setting pages’ completion state.
     *
     * @memberof ClrWizardPage
     */
    set completed(value: boolean);
    /**
     * Checks with the navigation service to see if it is the current page.
     *
     * @memberof WizardPage
     *
     */
    get current(): boolean;
    get disabled(): boolean;
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
    get enabled(): boolean;
    /**
     * A read-only getter that returns whether or not the page before this
     * ClrWizardPage is completed. This is useful for determining whether or not
     * a page is navigable if it is not current or already completed.
     *
     * @memberof WizardPage
     *
     */
    get previousCompleted(): boolean;
    /**
     *
     * @memberof WizardPage
     *
     */
    get title(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get navTitle(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get headerActions(): TemplateRef<any>;
    /**
     *
     * @memberof WizardPage
     *
     */
    get hasHeaderActions(): boolean;
    /**
     *
     * @memberof WizardPage
     *
     */
    get buttons(): TemplateRef<any>;
    /**
     * A read-only getter that returns a boolean that says whether or
     * not the ClrWizardPage includes buttons. Used to determine if the
     * Wizard should override the default button set defined as
     * its direct children.
     *
     * @memberof WizardPage
     *
     */
    get hasButtons(): boolean;
    /**
     * A read-only getter that returns the id used by the step nav item associated with the page.
     *
     * ClrWizardPage needs this ID string for aria information.
     *
     * @memberof WizardPage
     *
     */
    get stepItemId(): string;
    /**
     * Links the nav service and establishes the current page if one is not defined.
     *
     * @memberof WizardPage
     *
     */
    ngOnInit(): void;
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
    makeCurrent(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardPage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardPage, "clr-wizard-page", never, { "_id": { "alias": "id"; "required": false; }; "preventDefault": { "alias": "clrWizardPagePreventDefault"; "required": false; }; "nextStepDisabled": { "alias": "clrWizardPageNextDisabled"; "required": false; }; "previousStepDisabled": { "alias": "clrWizardPagePreviousDisabled"; "required": false; }; "hasError": { "alias": "clrWizardPageHasError"; "required": false; }; "stopCancel": { "alias": "clrWizardPagePreventDefaultCancel"; "required": false; }; "stopNext": { "alias": "clrWizardPagePreventDefaultNext"; "required": false; }; }, { "nextStepDisabledChange": "clrWizardPageNextDisabledChange"; "previousStepDisabledChange": "clrWizardPagePreviousDisabledChange"; "stopCancelChange": "clrWizardPagePreventDefaultCancelChange"; "onCommit": "clrWizardPageOnCommit"; "onLoad": "clrWizardPageOnLoad"; "pageOnCancel": "clrWizardPageOnCancel"; "finishButtonClicked": "clrWizardPageFinish"; "previousButtonClicked": "clrWizardPagePrevious"; "nextButtonClicked": "clrWizardPageNext"; "dangerButtonClicked": "clrWizardPageDanger"; "primaryButtonClicked": "clrWizardPagePrimary"; "customButtonClicked": "clrWizardPageCustomButton"; }, ["pageTitle", "pageNavTitle", "_buttons", "_headerActions"], ["*"], false, never>;
}

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
declare class WizardNavigationService implements OnDestroy {
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
    /**
     * Is notified when a previous button is clicked in the wizard. Performs checks
     * before alerting the current page of the button click. Enacts navigation to
     * the previous page if not overridden at the page level.
     *
     * @memberof WizardNavigationService
     */
    previousButtonSubscription: Subscription;
    /**
     * Is notified when a Next button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    nextButtonSubscription: Subscription;
    /**
     * Is notified when a danger button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    dangerButtonSubscription: Subscription;
    /**
     * Is notified when a  finish button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    finishButtonSubscription: Subscription;
    /**
     * Is notified when a Custom button is clicked in the wizard.
     *
     * @memberof WizardNavigationService
     */
    customButtonSubscription: Subscription;
    /**
     * Is notified when a Cancel button is clicked in the wizard. Notifies the wizard,
     * which handles all cancel functionality, if cancel is not overridden at the page
     * level.
     *
     * @memberof WizardNavigationService
     */
    cancelButtonSubscription: Subscription;
    /**
     * Resets navigation to make the first page current when the page collection service
     * emits an event notifying WizardNavigationService that it has reset all pages
     * to their pristine, incomplete state.
     *
     * @memberof WizardNavigationService
     */
    pagesResetSubscription: Subscription;
    /**
     * A Boolean flag used by the ClrWizardPage to avoid a race condition when pages are
     * loading and there is no current page defined.
     *
     * @memberof WizardNavigationService
     */
    navServiceLoaded: boolean;
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
    forceForwardNavigation: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.stopCancel (clrWizardPreventDefaultCancel) input. When true, the cancel
     * routine is subverted and must be reinstated in the host component calling Wizard.close()
     * at some point.
     *
     * @memberof WizardNavigationService
     */
    wizardHasAltCancel: boolean;
    /**
     * A boolean flag shared across the Wizard subcomponents that follows the value
     * of the Wizard.stopNext (clrWizardPreventDefaultNext) input. When true, the next and finish
     * routines are subverted and must be reinstated in the host component calling Wizard.next(),
     * Wizard.forceNext(), Wizard.finish(), or Wizard.forceFinish().
     *
     * @memberof WizardNavigationService
     */
    wizardHasAltNext: boolean;
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
    wizardStopNavigation: boolean;
    /**
     * A boolean flag shared with the stepnav items that prevents user clicks on
     * stepnav items from navigating the wizard.
     *
     * @memberof WizardNavigationService
     */
    wizardDisableStepnav: boolean;
    /**
     * @memberof WizardNavigationService
     */
    private _currentPage;
    /**
     *
     * @memberof WizardNavigationService
     */
    private _currentChanged;
    /**
     * @memberof WizardNavigationService
     */
    private _movedToNextPage;
    /**
     * @memberof WizardNavigationService
     */
    private _wizardFinished;
    /**
     * @memberof WizardNavigationService
     */
    private _movedToPreviousPage;
    /**
     * @memberof WizardNavigationService
     */
    private _cancelWizard;
    /**
     * Creates an instance of WizardNavigationService. Also sets up subscriptions
     * that listen to the button service to determine when a button has been clicked
     * in the wizard. Is also responsible for taking action when the page collection
     * requests that navigation be reset to its pristine state.
     *
     * @memberof WizardNavigationService
     */
    constructor(pageCollection: PageCollectionService, buttonService: ButtonHubService);
    /**
     * An Observable that is predominantly used amongst the subcomponents and services
     * of the wizard. It is recommended that users listen to the ClrWizardPage.onLoad
     * (clrWizardPageOnLoad) output instead of this Observable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageChanged(): Observable<ClrWizardPage>;
    /**
     * @memberof WizardNavigationService
     */
    get currentPageTitle(): TemplateRef<any>;
    /**
     * Returns a Boolean that tells you whether or not the current page is the first
     * page in the Wizard.
     *
     * This is helpful for determining whether a page is navigable.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsFirst(): boolean;
    /**
     * Returns a Boolean that tells you whether or not the current page is the
     * last page in the Wizard.
     *
     * This is used to determine which buttons should display in the wizard footer.
     *
     * @memberof WizardNavigationService
     */
    get currentPageIsLast(): boolean;
    /**
     * Returns the ClrWizardPage object of the current page or null.
     *
     * @memberof WizardNavigationService
     */
    get currentPage(): ClrWizardPage;
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
    set currentPage(page: ClrWizardPage);
    /**
     * An observable used internally to alert the wizard that forward navigation
     * has occurred. It is recommended that you use the Wizard.onMoveNext
     * (clrWizardOnNext) output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get movedToNextPage(): Observable<boolean>;
    /**
     * An observable used internally to alert the wizard that the nav service
     * has approved completion of the wizard.
     *
     * It is recommended that you use the Wizard.wizardFinished (clrWizardOnFinish)
     * output instead of this one.
     *
     * @memberof WizardNavigationService
     */
    get wizardFinished(): Observable<void>;
    /**
     * Notifies the wizard when backwards navigation has occurred via the
     * previous button.
     *
     * @memberof WizardNavigationService
     */
    get movedToPreviousPage(): Observable<boolean>;
    /**
     * Notifies the wizard that a user is trying to cancel it.
     *
     * @memberof WizardNavigationService
     */
    get notifyWizardCancel(): Observable<any>;
    /**
     *
     * @memberof WizardNavigationService
     */
    ngOnDestroy(): void;
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
    next(): void;
    /**
     * Bypasses checks and most event emissions to force a page to navigate forward.
     *
     * Comparable to calling Wizard.next() or Wizard.forceNext().
     *
     * @memberof WizardNavigationService
     */
    forceNext(): void;
    /**
     * Accepts a button/action type as a parameter. Encapsulates all logic for
     * event emissions, state of the current page, and wizard and page level overrides.
     *
     * Avoid calling this function directly unless you really know what you're doing.
     *
     * @memberof WizardNavigationService
     */
    checkAndCommitCurrentPage(buttonType: string): void;
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
    finish(): void;
    /**
     * Programmatically moves the wizard to the page before the current page.
     *
     * In most instances, it makes more sense to call Wizard.previous()
     * which does the same thing.
     *
     * @memberof WizardNavigationService
     */
    previous(): void;
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
    cancel(): void;
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
    goTo(pageToGoToOrId: any, lazyComplete?: boolean): void;
    /**
     * Accepts a range of ClrWizardPage objects as a parameter. Performs the work of checking
     * those objects to determine if navigation can be accomplished.
     *
     * @memberof WizardNavigationService
     */
    canGoTo(pagesToCheck: ClrWizardPage[]): boolean;
    /**
     * Looks through the collection of pages to find the first one that is incomplete
     * and makes that page the current/active page.
     *
     * @memberof WizardNavigationService
     */
    setLastEnabledPageCurrent(): void;
    /**
     * Finds the first page in the collection of pages and makes that page the
     * current/active page.
     *
     * @memberof WizardNavigationService
     */
    setFirstPageCurrent(): void;
    /**
     * Updates the stepnav on the left side of the wizard when pages are dynamically
     * added or removed from the collection of pages.
     *
     * @memberof WizardNavigationService
     */
    updateNavigation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WizardNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WizardNavigationService>;
}

declare class HeaderActionService {
    navService: WizardNavigationService;
    wizardHeaderActions: QueryList<ClrWizardHeaderAction>;
    constructor(navService: WizardNavigationService);
    get wizardHasHeaderActions(): boolean;
    get currentPageHasHeaderActions(): boolean;
    get showWizardHeaderActions(): boolean;
    get displayHeaderActionsWrapper(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<HeaderActionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HeaderActionService>;
}

declare class ClrWizardTitle {
    headingLevel: HeadingLevel;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrWizardTitle, "clr-wizard-title", never, { "headingLevel": { "alias": "clrHeadingLevel"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrWizard implements OnDestroy, AfterContentInit, DoCheck {
    private platformId;
    commonStrings: ClrCommonStringsService;
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    buttonService: ButtonHubService;
    headerActionService: HeaderActionService;
    private elementRef;
    /**
     * Set the aria-label for the stepnav section of the wizard. Set using `[clrWizardStepnavAriaLabel]` input.
     */
    stepnavAriaLabel: string;
    /**
     * Set the modal size of the wizard. Set using `[clrWizardSize]` input.
     */
    size: string;
    /**
     * Enable "in page" wizard. Set using `[clrWizardInPage]` input.
     */
    inPage: boolean;
    /**
     * Make an "in page" wizard fill the `.content-area`. Set using `[clrWizardInPageFillContentArea]` input.
     * If you can't use this option, you will likely need to provide custom CSS to set the wizard's height and margins.
     */
    inPageFillContentArea: boolean;
    /**
     * Tells the modal part of the wizard whether it should have a close "X"
     * in the top right corner. Set using `[clrWizardClosable]` input.
     */
    closable: boolean;
    /**
     * Used to communicate to the underlying modal that animations are not
     * wanted. Primary use is for the display of static/inline wizards.
     * Set using `[clrWizardPreventModalAnimation]` input.
     */
    _stopModalAnimations: boolean;
    /**
     * Emits when the wizard is opened or closed.
     * Listen via `(clrWizardOpenChange)` event.
     */
    _openChanged: EventEmitter<boolean>;
    /**
     * Emits when the wizard is canceled. Listen via `(clrWizardOnCancel)` event.
     * Can be combined with the `[clrWizardPreventDefaultCancel]` input to create
     * wizard-level custom cancel routines.
     */
    onCancel: EventEmitter<any>;
    /**
     * Emits when the wizard is completed. Listen via `(clrWizardOnFinish)` event.
     * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
     * wizard-level custom completion routines.
     */
    wizardFinished: EventEmitter<any>;
    /**
     * Emits when the wizard is reset. Listen via `(clrWizardOnReset)` event.
     */
    onReset: EventEmitter<any>;
    /**
     * Emits when the current page has changed. Listen via `(clrWizardCurrentPageChanged)` event.
     * output. Useful for non-blocking validation.
     */
    currentPageChanged: EventEmitter<any>;
    /**
     * Emits when the wizard moves to the next page. Listen via `(clrWizardOnNext)` event.
     * Can be combined with the `[clrWizardPreventDefaultNext]` input to create
     * wizard-level custom navigation routines, which are useful for validation.
     */
    onMoveNext: EventEmitter<any>;
    /**
     * Emits when the wizard moves to the previous page. Can be useful for validation.
     * Listen via `(clrWizardOnPrevious)` event.
     */
    onMovePrevious: EventEmitter<any>;
    pageTitle: ElementRef<HTMLElement>;
    pages: QueryList<ClrWizardPage>;
    headerActions: QueryList<ClrWizardHeaderAction>;
    _open: boolean;
    wizardId: string;
    protected wizardTitle: ClrWizardTitle;
    private readonly bodyElementRef;
    private _title;
    private _forceForward;
    private _stopNext;
    private _stopCancel;
    private _stopNavigation;
    private _disableStepnav;
    private differ;
    private subscriptions;
    private readonly modal;
    constructor(platformId: any, commonStrings: ClrCommonStringsService, navService: WizardNavigationService, pageCollection: PageCollectionService, buttonService: ButtonHubService, headerActionService: HeaderActionService, elementRef: ElementRef<HTMLElement>, differs: IterableDiffers);
    get title(): ElementRef<HTMLElement>;
    set title(title: ElementRef<HTMLElement>);
    /**
     * Resets page completed states when navigating backwards.
     * Set using `[clrWizardForceForwardNavigation]` input.
     */
    get forceForward(): boolean;
    set forceForward(value: boolean);
    /**
     * Toggles open/close of the wizard component.
     * Set using the `[clrWizardOpen]` input.
     */
    set clrWizardOpen(open: boolean);
    /**
     * Prevents ClrWizard from moving to the next page or closing itself on finishing.
     * Set using the `[clrWizardPreventDefaultNext]` input. Note that using stopNext
     * will require you to create your own calls to .next() and .finish() in your
     * host component to make the ClrWizard work as expected.
     */
    get stopNext(): boolean;
    set stopNext(value: boolean);
    /**
     * Prevents ClrWizard from closing when the cancel button or close "X" is clicked.
     * Set using the `[clrWizardPreventDefaultCancel]` input.
     *
     * Note that using stopCancel will require you to create your own calls to `close()` in your host compone`nt
     * to make the ClrWizard work as expected. Useful for doing checks or prompts
     * before closing a ClrWizard.
     */
    get stopCancel(): boolean;
    set stopCancel(value: boolean);
    /**
     * Prevents ClrWizard from performing any form of navigation away from the current
     * page. Set using the `[clrWizardPreventNavigation]` input.
     * Note that stopNavigation is meant to freeze the wizard in place, typically
     * during a long validation or background action where you want the wizard to
     * display loading content but not allow the user to execute navigation in
     * the stepnav, close X, or the  back, finish, or next buttons.
     */
    get stopNavigation(): boolean;
    set stopNavigation(value: boolean);
    /**
     * Prevents clicks on the links in the stepnav from working.
     * Set using `[clrWizardDisableStepnav]` input.
     * A more granular bypassing of navigation which can be useful when your
     * ClrWizard is in a state of completion and you don't want users to be
     * able to jump backwards and change things.
     */
    get disableStepnav(): boolean;
    set disableStepnav(value: boolean);
    get currentPage(): ClrWizardPage;
    set currentPage(page: ClrWizardPage);
    get isLast(): boolean;
    get isFirst(): boolean;
    get isInline(): boolean;
    get stopModalAnimations(): boolean;
    ngAfterContentInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
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
    finish(skipChecksAndEmits?: boolean): void;
    /**
     * Marks the wizard as finished but does run checks and emissions.
     * Good for a last step in an alternate workflow. Does the same thing as
     * calling `ClrWizard.finish(true)` or `ClrWizard.finish()` without a parameter.
     */
    forceFinish(): void;
    /**
     * Opens the wizard. If there is no current page defined, sets the first page in the wizard to be current.
     */
    open(): void;
    /**
     * Closes the wizard. Call this directly instead of `cancel()` to implement alternative cancel functionality.
     */
    close(): void;
    /**
     * Used to open and close the wizard. By default the wizard will
     * close if invoked with no parameter. If parameter is true wizard will open
     * else if false will close.
     */
    toggle(open: boolean): void;
    /**
     * Moves the wizard to the previous page.
     */
    previous(): void;
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
    next(skipChecksAndEmits?: boolean): void;
    /**
     * Moves the wizard to the next page without the checks and emissions.
     * Good for a last step in an alternate workflow.
     * Alias for `ClrWizard.next(true)` or `ClrWizard.next()`
     */
    forceNext(): void;
    /**
     * Cancels and closes the wizard. Do not use this for an override of the cancel
     * the functionality with `[clrWizardPreventDefaultCancel]`, `[clrWizardPreventPageDefaultCancel]`,
     * or `[clrWizardPagePreventDefault]` because it will initiate the same checks
     * and event emissions that invoked your event handler. Use `ClrWizard.close()` instead.
     */
    cancel(): void;
    /**
     * Overrides behavior of the underlying modal to avoid collisions with
     * alternative cancel functionality. In most cases, use `ClrWizard.cancel()` instead.
     */
    modalCancel(): void;
    /**
     * Checks for alternative cancel flows defined at the current page or
     * wizard level. Performs a canceled if not. Emits events that initiate
     * the alternative cancel outputs `(clrWizardPageOnCancel)` and `(clrWizardOnCancel)`.
     */
    checkAndCancel(): void;
    /**
     * Navigates to a given page in the Wizard. Navigation will invoke the wizard’s default
     * checks and event emissions.
     *
     * The format of the expected ID parameter can be found in the return of the
     * ClrWizardPage.id getter, usually prefixed with `clr-wizard-page-` and then either a
     * numeric ID or the ID specified for the `ClrWizardPage` component’s `id` input.
     */
    goTo(pageId: string): void;
    /**
     * Reset sets all WizardPages to incomplete and sets the first page in the `ClrWizard` to
     * be the current page, resetting the wizard navigation.
     * Use `(clrWizardOnReset)` event to reset the data or model of your wizard.
     */
    reset(): void;
    private listenForNextPageChanges;
    private listenForPreviousPageChanges;
    private listenForCancelChanges;
    private listenForFinishedChanges;
    private listenForPageChanges;
    private updateNavOnPageChanges;
    private initializeButtons;
    private emitWizardFinished;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizard, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizard, "clr-wizard", never, { "stepnavAriaLabel": { "alias": "clrWizardStepnavAriaLabel"; "required": false; }; "size": { "alias": "clrWizardSize"; "required": false; }; "inPage": { "alias": "clrWizardInPage"; "required": false; }; "inPageFillContentArea": { "alias": "clrWizardInPageFillContentArea"; "required": false; }; "closable": { "alias": "clrWizardClosable"; "required": false; }; "_stopModalAnimations": { "alias": "clrWizardPreventModalAnimation"; "required": false; }; "forceForward": { "alias": "clrWizardForceForwardNavigation"; "required": false; }; "clrWizardOpen": { "alias": "clrWizardOpen"; "required": false; }; "stopNext": { "alias": "clrWizardPreventDefaultNext"; "required": false; }; "stopCancel": { "alias": "clrWizardPreventDefaultCancel"; "required": false; }; "stopNavigation": { "alias": "clrWizardPreventNavigation"; "required": false; }; "disableStepnav": { "alias": "clrWizardDisableStepnav"; "required": false; }; }, { "_openChanged": "clrWizardOpenChange"; "onCancel": "clrWizardOnCancel"; "wizardFinished": "clrWizardOnFinish"; "onReset": "clrWizardOnReset"; "currentPageChanged": "clrWizardCurrentPageChanged"; "onMoveNext": "clrWizardOnNext"; "onMovePrevious": "clrWizardOnPrevious"; }, ["wizardTitle", "pages", "headerActions"], ["clr-wizard-title", "clr-wizard-header-action", "*", "clr-wizard-button"], false, never>;
}

declare class ClrWizardStepnav {
    pageService: PageCollectionService;
    label: string;
    constructor(pageService: PageCollectionService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnav, "clr-wizard-stepnav", never, { "label": { "alias": "label"; "required": false; }; }, {}, never, never, false, never>;
}

declare class ClrWizardStepnavItem implements OnInit, OnDestroy {
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    commonStrings: ClrCommonStringsService;
    private readonly elementRef;
    page: ClrWizardPage;
    private subscription;
    /**
     * This is used to prevent the steps from scrolling as the user clicks on the steps.
     */
    private skipNextScroll;
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, commonStrings: ClrCommonStringsService, elementRef: ElementRef<HTMLElement>);
    get id(): string;
    get stepAriaCurrent(): string;
    get isDisabled(): boolean;
    get isCurrent(): boolean;
    get isComplete(): boolean;
    get hasError(): boolean;
    get canNavigate(): boolean;
    protected get stepIconId(): string;
    protected get stepTextId(): string;
    protected get stepNumberId(): string;
    protected get stepTitleId(): string;
    protected get labelledby(): string;
    protected get icon(): {
        shape: string;
        label: string;
    } | null;
    ngOnInit(): void;
    ngOnDestroy(): void;
    click(): void;
    private pageGuard;
    private ensureCurrentStepIsScrolledIntoView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnavItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnavItem, "[clr-wizard-stepnav-item]", never, { "page": { "alias": "page"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const DEFAULT_BUTTON_TYPES: any;
declare const CUSTOM_BUTTON_TYPES: any;
declare class ClrWizardButton {
    navService: WizardNavigationService;
    buttonService: ButtonHubService;
    type: string;
    disabled: boolean;
    hidden: boolean;
    wasClicked: EventEmitter<string>;
    constructor(navService: WizardNavigationService, buttonService: ButtonHubService);
    get isCancel(): boolean;
    get isNext(): boolean;
    get isPrevious(): boolean;
    get isFinish(): boolean;
    get isDanger(): boolean;
    get isPrimaryAction(): boolean;
    get _disabledAttribute(): string | null;
    get isDisabled(): boolean;
    get isHidden(): boolean;
    click(): void;
    private checkDefaultAndCustomType;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardButton, "clr-wizard-button", never, { "type": { "alias": "type"; "required": false; }; "disabled": { "alias": "clrWizardButtonDisabled"; "required": false; }; "hidden": { "alias": "clrWizardButtonHidden"; "required": false; }; }, { "wasClicked": "clrWizardButtonClicked"; }, never, ["*"], false, never>;
}

declare const CLR_WIZARD_DIRECTIVES: any[];
declare class ClrWizardModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrWizardModule, [typeof ClrWizard, typeof ClrWizardPage, typeof ClrWizardStepnav, typeof ClrWizardStepnavItem, typeof ClrWizardButton, typeof ClrWizardHeaderAction, typeof ClrWizardTitle, typeof ClrWizardPageTitle, typeof ClrWizardPageNavTitle, typeof ClrWizardPageButtons, typeof ClrWizardPageHeaderActions], [typeof i12.CommonModule, typeof i13.ClrIcon, typeof i14.ClrModalModule, typeof i15.ClrAlertModule], [typeof ClrWizard, typeof ClrWizardPage, typeof ClrWizardStepnav, typeof ClrWizardStepnavItem, typeof ClrWizardButton, typeof ClrWizardHeaderAction, typeof ClrWizardTitle, typeof ClrWizardPageTitle, typeof ClrWizardPageNavTitle, typeof ClrWizardPageButtons, typeof ClrWizardPageHeaderActions]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrWizardModule>;
}

export { CLR_WIZARD_DIRECTIVES, CUSTOM_BUTTON_TYPES, ClrWizard, ClrWizardButton, ClrWizardHeaderAction, ClrWizardModule, ClrWizardPage, ClrWizardPageButtons, ClrWizardPageHeaderActions, ClrWizardPageNavTitle, ClrWizardPageTitle, ClrWizardStepnav, ClrWizardStepnavItem, ClrWizardTitle, DEFAULT_BUTTON_TYPES };
