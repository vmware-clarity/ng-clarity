import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { ButtonHubService } from './providers/button-hub.service';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardPageButtons } from './wizard-page-buttons';
import { ClrWizardPageHeaderActions } from './wizard-page-header-actions';
import { ClrWizardPageNavTitle } from './wizard-page-navtitle';
import { ClrWizardPageTitle } from './wizard-page-title';
import * as i0 from "@angular/core";
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
export declare class ClrWizardPage implements OnInit {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardPage, "clr-wizard-page", never, { "_id": "id"; "preventDefault": "clrWizardPagePreventDefault"; "nextStepDisabled": "clrWizardPageNextDisabled"; "previousStepDisabled": "clrWizardPagePreviousDisabled"; "hasError": "clrWizardPageHasError"; "stopCancel": "clrWizardPagePreventDefaultCancel"; "stopNext": "clrWizardPagePreventDefaultNext"; }, { "nextStepDisabledChange": "clrWizardPageNextDisabledChange"; "previousStepDisabledChange": "clrWizardPagePreviousDisabledChange"; "stopCancelChange": "clrWizardPagePreventDefaultCancelChange"; "onCommit": "clrWizardPageOnCommit"; "onLoad": "clrWizardPageOnLoad"; "pageOnCancel": "clrWizardPageOnCancel"; "finishButtonClicked": "clrWizardPageFinish"; "previousButtonClicked": "clrWizardPagePrevious"; "nextButtonClicked": "clrWizardPageNext"; "dangerButtonClicked": "clrWizardPageDanger"; "primaryButtonClicked": "clrWizardPagePrimary"; "customButtonClicked": "clrWizardPageCustomButton"; }, ["pageTitle", "pageNavTitle", "_buttons", "_headerActions"], ["*"], false, never>;
}
