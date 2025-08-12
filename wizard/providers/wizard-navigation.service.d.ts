import { OnDestroy, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ClrWizardPage } from '../wizard-page';
import { ButtonHubService } from './button-hub.service';
import { PageCollectionService } from './page-collection.service';
import * as i0 from "@angular/core";
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
export declare class WizardNavigationService implements OnDestroy {
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
