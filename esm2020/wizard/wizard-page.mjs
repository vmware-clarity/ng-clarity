/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import { ClrWizardPageButtons } from './wizard-page-buttons';
import { ClrWizardPageHeaderActions } from './wizard-page-header-actions';
import { ClrWizardPageNavTitle } from './wizard-page-navtitle';
import { ClrWizardPageTitle } from './wizard-page-title';
import * as i0 from "@angular/core";
import * as i1 from "./providers/wizard-navigation.service";
import * as i2 from "./providers/page-collection.service";
import * as i3 from "./providers/button-hub.service";
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
export class ClrWizardPage {
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
        return this.pageTitle.pageTitleTemplateRef;
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
        return this.pageTitle.pageTitleTemplateRef;
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
}
ClrWizardPage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardPage, deps: [{ token: i1.WizardNavigationService }, { token: i2.PageCollectionService }, { token: i3.ButtonHubService }], target: i0.ɵɵFactoryTarget.Component });
ClrWizardPage.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardPage, selector: "clr-wizard-page", inputs: { _id: ["id", "_id"], preventDefault: ["clrWizardPagePreventDefault", "preventDefault"], nextStepDisabled: ["clrWizardPageNextDisabled", "nextStepDisabled"], previousStepDisabled: ["clrWizardPagePreviousDisabled", "previousStepDisabled"], hasError: ["clrWizardPageHasError", "hasError"], stopCancel: ["clrWizardPagePreventDefaultCancel", "stopCancel"], stopNext: ["clrWizardPagePreventDefaultNext", "stopNext"] }, outputs: { nextStepDisabledChange: "clrWizardPageNextDisabledChange", previousStepDisabledChange: "clrWizardPagePreviousDisabledChange", stopCancelChange: "clrWizardPagePreventDefaultCancelChange", onCommit: "clrWizardPageOnCommit", onLoad: "clrWizardPageOnLoad", pageOnCancel: "clrWizardPageOnCancel", finishButtonClicked: "clrWizardPageFinish", previousButtonClicked: "clrWizardPagePrevious", nextButtonClicked: "clrWizardPageNext", dangerButtonClicked: "clrWizardPageDanger", primaryButtonClicked: "clrWizardPagePrimary", customButtonClicked: "clrWizardPageCustomButton" }, host: { properties: { "id": "id", "attr.aria-hidden": "!current", "attr.aria-labelledby": "stepItemId", "class.active": "current", "class.clr-wizard-page": "true" } }, queries: [{ propertyName: "pageTitle", first: true, predicate: ClrWizardPageTitle, descendants: true, static: true }, { propertyName: "pageNavTitle", first: true, predicate: ClrWizardPageNavTitle, descendants: true, static: true }, { propertyName: "_buttons", first: true, predicate: ClrWizardPageButtons, descendants: true, static: true }, { propertyName: "_headerActions", first: true, predicate: ClrWizardPageHeaderActions, descendants: true, static: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardPage, decorators: [{
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
                }]
        }], ctorParameters: function () { return [{ type: i1.WizardNavigationService }, { type: i2.PageCollectionService }, { type: i3.ButtonHubService }]; }, propDecorators: { _id: [{
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
                args: [ClrWizardPageTitle, { static: true }]
            }], pageNavTitle: [{
                type: ContentChild,
                args: [ClrWizardPageNavTitle, { static: true }]
            }], _buttons: [{
                type: ContentChild,
                args: [ClrWizardPageButtons, { static: true }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy93aXphcmQvd2l6YXJkLXBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUsxRyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFFekQsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO0FBRXhCOzs7Ozs7Ozs7R0FTRztBQVlILE1BQU0sT0FBTyxhQUFhO0lBcVJ4Qjs7OztPQUlHO0lBQ0gsWUFDVSxVQUFtQyxFQUNwQyxjQUFxQyxFQUNyQyxhQUErQjtRQUY5QixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNwQyxtQkFBYyxHQUFkLGNBQWMsQ0FBdUI7UUFDckMsa0JBQWEsR0FBYixhQUFhLENBQWtCO1FBNVJ4Qzs7Ozs7Ozs7OztXQVVHO1FBQ1UsUUFBRyxHQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV2RDs7Ozs7Ozs7V0FRRztRQUNtQyxtQkFBYyxHQUFxQixLQUFLLENBQUM7UUFFL0U7Ozs7OztXQU1HO1FBQ3dDLDJCQUFzQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFFaEc7Ozs7OztXQU1HO1FBQzRDLCtCQUEwQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFFeEc7Ozs7V0FJRztRQUNnRCxxQkFBZ0IsR0FBRyxJQUFJLFlB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QUFRO3NCQUE3RCxZQUFZO3VCQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFVUSxjQUFjO3NCQUF6RSxZQUFZO3VCQUFDLDBCQUEwQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFzRXRELGdCQUFnQjtzQkFEbkIsS0FBSzt1QkFBQywyQkFBMkI7Z0JBMkI5QixvQkFBb0I7c0JBRHZCLEtBQUs7dUJBQUMsK0JBQStCO2dCQXFCbEMsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLHVCQUF1QjtnQkF1QjFCLFVBQVU7c0JBRGIsS0FBSzt1QkFBQyxtQ0FBbUM7Z0JBMEJ0QyxRQUFRO3NCQURYLEtBQUs7dUJBQUMsaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEJ1dHRvbkh1YlNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9idXR0b24taHViLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFnZUNvbGxlY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcGFnZS1jb2xsZWN0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy93aXphcmQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENscldpemFyZFBhZ2VCdXR0b25zIH0gZnJvbSAnLi93aXphcmQtcGFnZS1idXR0b25zJztcbmltcG9ydCB7IENscldpemFyZFBhZ2VIZWFkZXJBY3Rpb25zIH0gZnJvbSAnLi93aXphcmQtcGFnZS1oZWFkZXItYWN0aW9ucyc7XG5pbXBvcnQgeyBDbHJXaXphcmRQYWdlTmF2VGl0bGUgfSBmcm9tICcuL3dpemFyZC1wYWdlLW5hdnRpdGxlJztcbmltcG9ydCB7IENscldpemFyZFBhZ2VUaXRsZSB9IGZyb20gJy4vd2l6YXJkLXBhZ2UtdGl0bGUnO1xuXG5sZXQgd2l6YXJkUGFnZUluZGV4ID0gMDtcblxuLyoqXG4gKiBUaGUgQ2xyV2l6YXJkUGFnZSBjb21wb25lbnQgaXMgcmVzcG9uc2libGUgZm9yIGRpc3BsYXlpbmcgdGhlIGNvbnRlbnQgb2YgZWFjaCBzdGVwXG4gKiBpbiB0aGUgd2l6YXJkIHdvcmtmbG93LlxuICpcbiAqIENscldpemFyZFBhZ2UgY29tcG9uZW50IGhhcyBob29rcyBpbnRvIHRoZSBuYXZpZ2F0aW9uIHNlcnZpY2UgKENscldpemFyZFBhZ2UubmF2U2VydmljZSksXG4gKiBwYWdlIGNvbGxlY3Rpb24gKENscldpemFyZFBhZ2UucGFnZUNvbGxlY3Rpb24pLCBhbmQgYnV0dG9uIHNlcnZpY2VcbiAqIChDbHJXaXphcmRQYWdlLmJ1dHRvblNlcnZpY2UpLiBUaGVzZSB0aHJlZSBwcm92aWRlcnMgYXJlIHNoYXJlZCBhY3Jvc3MgdGhlIGNvbXBvbmVudHNcbiAqIHdpdGhpbiBlYWNoIGluc3RhbmNlIG9mIGEgV2l6YXJkLlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLXdpemFyZC1wYWdlJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIuYXJpYS1oaWRkZW5dJzogJyFjdXJyZW50JyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdzdGVwSXRlbUlkJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnY3VycmVudCcsXG4gICAgJ1tjbGFzcy5jbHItd2l6YXJkLXBhZ2VdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmRQYWdlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgLyoqXG4gICAqIEFuIGlucHV0IHZhbHVlIHRoYXQgaXMgdXNlZCBpbnRlcm5hbGx5IHRvIGdlbmVyYXRlIHRoZSBDbHJXaXphcmRQYWdlIElEIGFzXG4gICAqIHdlbGwgYXMgdGhlIHN0ZXAgbmF2IGl0ZW0gSUQuXG4gICAqXG4gICAqIFR5cGVkIGFzIGFueSBiZWNhdXNlIGl0IHNob3VsZCBiZSBhYmxlIHRvIGFjY2VwdCBudW1iZXJzIGFzIHdlbGwgYXNcbiAgICogc3RyaW5ncy4gUGFzc2luZyBhbiBpbmRleCBmb3Igd2l6YXJkIHdob3NlIHBhZ2VzIGFyZSBjcmVhdGVkIHdpdGggYW5cbiAgICogbmdGb3IgbG9vcCBpcyBhIGNvbW1vbiB1c2UgY2FzZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBJbnB1dCgnaWQnKSBfaWQ6IGFueSA9ICh3aXphcmRQYWdlSW5kZXgrKykudG9TdHJpbmcoKTtcblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGFsbCBhY3Rpb25zIGZyb20gdGhlIHBhZ2UgbGV2ZWwsIHNvIHlvdSBjYW4gdXNlIGFuIGFsdGVybmF0ZSBmdW5jdGlvbiBmb3JcbiAgICogdmFsaWRhdGlvbiBvciBkYXRhLW11bmdpbmcgd2l0aCBhIENscldpemFyZFBhZ2Uub25Db21taXQgKGNscldpemFyZFBhZ2VPbkNvbW1pdCBvdXRwdXQpLFxuICAgKiBDbHJXaXphcmRQYWdlLm9uQ2FuY2VsIChjbHJXaXphcmRQYWdlT25DYW5jZWwgb3V0cHV0KSwgb3Igb25lXG4gICAqIG9mIHRoZSBncmFudWxhciBwYWdlLWxldmVsIGJ1dHRvbiBjbGljayBldmVudCBlbWl0dGVycy5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUGFnZVByZXZlbnREZWZhdWx0JykgcHJldmVudERlZmF1bHQ6IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbiB0aGUgdmFsdWUgb2YgQ2xyV2l6YXJkUGFnZS5uZXh0U3RlcERpc2FibGVkIGNoYW5nZXMuXG4gICAqIFNob3VsZCBlbWl0IHRoZSBuZXcgdmFsdWUgb2YgbmV4dFN0ZXBEaXNhYmxlZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZFBhZ2VOZXh0RGlzYWJsZWRDaGFuZ2UnKSBuZXh0U3RlcERpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSB2YWx1ZSBvZiBDbHJXaXphcmRQYWdlLnByZXZpb3VzU3RlcERpc2FibGVkIGNoYW5nZXMuXG4gICAqIFNob3VsZCBlbWl0IHRoZSBuZXcgdmFsdWUgb2YgcHJldmlvdXNTdGVwRGlzYWJsZWQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRQYWdlUHJldmlvdXNEaXNhYmxlZENoYW5nZScpIHByZXZpb3VzU3RlcERpc2FibGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkUGFnZVByZXZlbnREZWZhdWx0Q2FuY2VsQ2hhbmdlJykgc3RvcENhbmNlbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlciBjYXJyaWVkIG92ZXIgZnJvbSBhIGxlZ2FjeSB2ZXJzaW9uIG9mIENscldpemFyZFBhZ2UuXG4gICAqIEZpcmVzIGFuIGV2ZW50IG9uIENscldpemFyZFBhZ2Ugd2hlbmV2ZXIgdGhlIG5leHQgb3IgZmluaXNoIGJ1dHRvbnNcbiAgICogYXJlIGNsaWNrZWQgYW5kIHRoZSBwYWdlIGlzIHRoZSBjdXJyZW50IHBhZ2Ugb2YgdGhlIFdpemFyZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgYXV0b21hdGljYWxseSBlbWl0IGFuIGV2ZW50IHdoZW4gYSBjdXN0b21cbiAgICogYnV0dG9uIGlzIHVzZWQgaW4gcGxhY2Ugb2YgYSBuZXh0IG9yIGZpbmlzaCBidXR0b24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBAT3V0cHV0KCdjbHJXaXphcmRQYWdlT25Db21taXQnKSBvbkNvbW1pdCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPihmYWxzZSk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gQ2xyV2l6YXJkUGFnZSBiZWNvbWVzIHRoZSBjdXJyZW50IHBhZ2Ugb2YgdGhlXG4gICAqIFdpemFyZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZFBhZ2VPbkxvYWQnKSBvbkxvYWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgQ2xyV2l6YXJkUGFnZSBpbnZva2VzIHRoZSBjYW5jZWwgcm91dGluZSBmb3IgdGhlIHdpemFyZC5cbiAgICpcbiAgICogQ2FuIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGUgQ2xyV2l6YXJkUGFnZS5zdG9wQ2FuY2VsXG4gICAqIChjbHJXaXphcmRQYWdlUHJldmVudERlZmF1bHRDYW5jZWwpIG9yIENscldpemFyZFBhZ2UucHJldmVudERlZmF1bHRcbiAgICogKGNscldpemFyZFBhZ2VQYWdlUHJldmVudERlZmF1bHQpIGlucHV0cyB0byBpbXBsZW1lbnQgY3VzdG9tIGNhbmNlbFxuICAgKiBmdW5jdGlvbmFsaXR5IGF0IHRoZSBwYWdlIGxldmVsLiBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd291bGQgbGlrZSB0byBkb1xuICAgKiB2YWxpZGF0aW9uLCBzYXZlIGRhdGEsIG9yIHdhcm4gdXNlcnMgYmVmb3JlIGNhbmNlbGxpbmcgdGhlIHdpemFyZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgcmVxdWlyZXMgeW91IHRvIGNhbGwgV2l6YXJkLmNsb3NlKCkgZnJvbSB0aGUgaG9zdCBjb21wb25lbnQuXG4gICAqIFRoaXMgY29uc3RpdHVlcyBhIGZ1bGwgcmVwbGFjZW1lbnQgb2YgdGhlIGNhbmNlbCBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkUGFnZU9uQ2FuY2VsJykgcGFnZU9uQ2FuY2VsID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJXaXphcmRQYWdlPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSBmaW5pc2ggYnV0dG9uIGlzIGNsaWNrZWQgYW5kIHRoZSBDbHJXaXphcmRQYWdlIGlzXG4gICAqIHRoZSB3aXphcmQncyBjdXJyZW50IHBhZ2UuXG4gICAqXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlIENscldpemFyZFBhZ2UucHJldmVudERlZmF1bHRcbiAgICogKGNscldpemFyZFBhZ2VQYWdlUHJldmVudERlZmF1bHQpIGlucHV0IHRvIGltcGxlbWVudCBjdXN0b20gZmluaXNoXG4gICAqIGZ1bmN0aW9uYWxpdHkgYXQgdGhlIHBhZ2UgbGV2ZWwuIFRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3b3VsZCBsaWtlIHRvIGRvXG4gICAqIHZhbGlkYXRpb24sIHNhdmUgZGF0YSwgb3Igd2FybiB1c2VycyBiZWZvcmUgYWxsb3dpbmcgdGhlbSB0byBjb21wbGV0ZVxuICAgKiB0aGUgd2l6YXJkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyByZXF1aXJlcyB5b3UgdG8gY2FsbCBXaXphcmQuZmluaXNoKCkgb3IgV2l6YXJkLmZvcmNlRmluaXNoKClcbiAgICogZnJvbSB0aGUgaG9zdCBjb21wb25lbnQuIFRoaXMgY29tYmluYXRpb24gY3JlYXRlcyBhIGZ1bGwgcmVwbGFjZW1lbnQgb2ZcbiAgICogdGhlIGZpbmlzaCBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkUGFnZUZpbmlzaCcpIGZpbmlzaEJ1dHRvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENscldpemFyZFBhZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIHByZXZpb3VzIGJ1dHRvbiBpcyBjbGlja2VkIGFuZCB0aGUgQ2xyV2l6YXJkUGFnZSBpc1xuICAgKiB0aGUgd2l6YXJkJ3MgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiBDYW4gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBDbHJXaXphcmRQYWdlLnByZXZlbnREZWZhdWx0XG4gICAqIChjbHJXaXphcmRQYWdlUGFnZVByZXZlbnREZWZhdWx0KSBpbnB1dCB0byBpbXBsZW1lbnQgY3VzdG9tIGJhY2t3YXJkc1xuICAgKiBuYXZpZ2F0aW9uIGF0IHRoZSBwYWdlIGxldmVsLiBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd291bGQgbGlrZSB0byBkb1xuICAgKiB2YWxpZGF0aW9uLCBzYXZlIGRhdGEsIG9yIHdhcm4gdXNlcnMgYmVmb3JlIGFsbG93aW5nIHRoZW0gdG8gZ29cbiAgICogYmFja3dhcmRzIGluIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHlvdSB0byBjYWxsIFdpemFyZC5wcmV2aW91cygpXG4gICAqIGZyb20gdGhlIGhvc3QgY29tcG9uZW50LiBUaGlzIGNvbWJpbmF0aW9uIGNyZWF0ZXMgYSBmdWxsIHJlcGxhY2VtZW50IG9mXG4gICAqIHRoZSBiYWNrd2FyZHMgbmF2aWdhdGlvbiBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkUGFnZVByZXZpb3VzJykgcHJldmlvdXNCdXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJXaXphcmRQYWdlPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSBuZXh0IGJ1dHRvbiBpcyBjbGlja2VkIGFuZCB0aGUgQ2xyV2l6YXJkUGFnZSBpc1xuICAgKiB0aGUgd2l6YXJkJ3MgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiBDYW4gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBDbHJXaXphcmRQYWdlLnByZXZlbnREZWZhdWx0XG4gICAqIChjbHJXaXphcmRQYWdlUGFnZVByZXZlbnREZWZhdWx0KSBpbnB1dCB0byBpbXBsZW1lbnQgY3VzdG9tIGZvcndhcmRzXG4gICAqIG5hdmlnYXRpb24gYXQgdGhlIHBhZ2UgbGV2ZWwuIFRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3b3VsZCBsaWtlIHRvIGRvXG4gICAqIHZhbGlkYXRpb24sIHNhdmUgZGF0YSwgb3Igd2FybiB1c2VycyBiZWZvcmUgYWxsb3dpbmcgdGhlbSB0byBnb1xuICAgKiB0byB0aGUgbmV4dCBwYWdlIGluIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHlvdSB0byBjYWxsIFdpemFyZC5mb3JjZU5leHQoKSBvciBXaXphcmQubmV4dCgpXG4gICAqIGZyb20gdGhlIGhvc3QgY29tcG9uZW50LiBUaGlzIGNvbWJpbmF0aW9uIGNyZWF0ZXMgYSBmdWxsIHJlcGxhY2VtZW50IG9mXG4gICAqIHRoZSBmb3J3YXJkIG5hdmlnYXRpb24gZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZFBhZ2VOZXh0JykgbmV4dEJ1dHRvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENscldpemFyZFBhZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gYSBkYW5nZXIgYnV0dG9uIGlzIGNsaWNrZWQgYW5kIHRoZSBDbHJXaXphcmRQYWdlIGlzXG4gICAqIHRoZSB3aXphcmQncyBjdXJyZW50IHBhZ2UuIEJ5IGRlZmF1bHQsIGEgZGFuZ2VyIGJ1dHRvbiB3aWxsIGFjdCBhc1xuICAgKiBlaXRoZXIgYSBcIm5leHRcIiBvciBcImZpbmlzaFwiIGJ1dHRvbiBkZXBlbmRpbmcgb24gaWYgdGhlIENscldpemFyZFBhZ2UgaXMgdGhlXG4gICAqIGxhc3QgcGFnZSBvciBub3QuXG4gICAqXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlIENscldpemFyZFBhZ2UucHJldmVudERlZmF1bHRcbiAgICogKGNscldpemFyZFBhZ2VQYWdlUHJldmVudERlZmF1bHQpIGlucHV0IHRvIGltcGxlbWVudCBjdXN0b20gZm9yd2FyZHNcbiAgICogb3IgZmluaXNoIG5hdmlnYXRpb24gYXQgdGhlIHBhZ2UgbGV2ZWwgd2hlbiB0aGUgZGFuZ2VyIGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgKiBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd291bGQgbGlrZSB0byBkbyB2YWxpZGF0aW9uLCBzYXZlIGRhdGEsIG9yIHdhcm5cbiAgICogdXNlcnMgYmVmb3JlIGFsbG93aW5nIHRoZW0gdG8gZ28gdG8gdGhlIG5leHQgcGFnZSBpbiB0aGUgd2l6YXJkIG9yXG4gICAqIGZpbmlzaCB0aGUgd2l6YXJkLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhpcyByZXF1aXJlcyB5b3UgdG8gY2FsbCBXaXphcmQuZmluaXNoKCksIFdpemFyZC5mb3JjZUZpbmlzaCgpLFxuICAgKiBXaXphcmQuZm9yY2VOZXh0KCkgb3IgV2l6YXJkLm5leHQoKSBmcm9tIHRoZSBob3N0IGNvbXBvbmVudC4gVGhpc1xuICAgKiBjb21iaW5hdGlvbiBjcmVhdGVzIGEgZnVsbCByZXBsYWNlbWVudCBvZiB0aGUgZm9yd2FyZCBuYXZpZ2F0aW9uIGFuZFxuICAgKiBmaW5pc2ggZnVuY3Rpb25hbGl0eS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBPdXRwdXQoJ2NscldpemFyZFBhZ2VEYW5nZXInKSBkYW5nZXJCdXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJXaXphcmRQYWdlPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIGEgbmV4dCwgZmluaXNoLCBvciBkYW5nZXIgYnV0dG9uIGlzIGNsaWNrZWQgYW5kIHRoZVxuICAgKiBDbHJXaXphcmRQYWdlIGlzIHRoZSB3aXphcmQncyBjdXJyZW50IHBhZ2UuXG4gICAqXG4gICAqIENhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlIENscldpemFyZFBhZ2UucHJldmVudERlZmF1bHRcbiAgICogKGNscldpemFyZFBhZ2VQYWdlUHJldmVudERlZmF1bHQpIGlucHV0IHRvIGltcGxlbWVudCBjdXN0b20gZm9yd2FyZHNcbiAgICogb3IgZmluaXNoIG5hdmlnYXRpb24gYXQgdGhlIHBhZ2UgbGV2ZWwsIHJlZ2FyZGxlc3Mgb2YgdGhlIHR5cGUgb2ZcbiAgICogcHJpbWFyeSBidXR0b24uXG4gICAqXG4gICAqIFRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3b3VsZCBsaWtlIHRvIGRvIHZhbGlkYXRpb24sIHNhdmUgZGF0YSwgb3Igd2FyblxuICAgKiB1c2VycyBiZWZvcmUgYWxsb3dpbmcgdGhlbSB0byBnbyB0byB0aGUgbmV4dCBwYWdlIGluIHRoZSB3aXphcmQgb3JcbiAgICogZmluaXNoIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIHJlcXVpcmVzIHlvdSB0byBjYWxsIFdpemFyZC5maW5pc2goKSwgV2l6YXJkLmZvcmNlRmluaXNoKCksXG4gICAqIFdpemFyZC5mb3JjZU5leHQoKSBvciBXaXphcmQubmV4dCgpIGZyb20gdGhlIGhvc3QgY29tcG9uZW50LiBUaGlzXG4gICAqIGNvbWJpbmF0aW9uIGNyZWF0ZXMgYSBmdWxsIHJlcGxhY2VtZW50IG9mIHRoZSBmb3J3YXJkIG5hdmlnYXRpb24gYW5kXG4gICAqIGZpbmlzaCBmdW5jdGlvbmFsaXR5LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xyV2l6YXJkUGFnZVByaW1hcnknKSBwcmltYXJ5QnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBPdXRwdXQoJ2NscldpemFyZFBhZ2VDdXN0b21CdXR0b24nKSBjdXN0b21CdXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZSBwYWdlIHRpdGxlIHdoaWNoIGlzIHVzZWQgZm9yIGEgbnVtYmVyXG4gICAqIG9mIGRpZmZlcmVudCB0YXNrcyBmb3IgZGlzcGxheSBpbiB0aGUgd2l6YXJkLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJXaXphcmRQYWdlVGl0bGUsIHsgc3RhdGljOiB0cnVlIH0pIHBhZ2VUaXRsZTogQ2xyV2l6YXJkUGFnZVRpdGxlO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBhIHJlZmVyZW5jZSB0byB0aGUgZGVzaXJlZCB0aXRsZSBmb3IgdGhlIHBhZ2UncyBzdGVwIGluIHRoZVxuICAgKiBuYXZpZ2F0aW9uIG9uIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIHdpemFyZC4gQ2FuIGJlIHByb2plY3RlZCB0byBjaGFuZ2UgdGhlXG4gICAqIG5hdmlnYXRpb24gbGluaydzIHRleHQuXG4gICAqXG4gICAqIElmIG5vdCBkZWZpbmVkLCB0aGVuIENscldpemFyZFBhZ2UucGFnZVRpdGxlIHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSBzdGVwbmF2LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJXaXphcmRQYWdlTmF2VGl0bGUsIHsgc3RhdGljOiB0cnVlIH0pIHBhZ2VOYXZUaXRsZTogQ2xyV2l6YXJkUGFnZU5hdlRpdGxlO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBhIHJlZmVyZW5jZSB0byB0aGUgYnV0dG9ucyBkZWZpbmVkIHdpdGhpbiB0aGUgcGFnZS4gSWYgbm90IGRlZmluZWQsXG4gICAqIHRoZSB3aXphcmQgZGVmYXVsdHMgdG8gdGhlIHNldCBvZiBidXR0b25zIGRlZmluZWQgYXMgYSBkaXJlY3QgY2hpbGQgb2YgdGhlXG4gICAqIHdpemFyZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoQ2xyV2l6YXJkUGFnZUJ1dHRvbnMsIHsgc3RhdGljOiB0cnVlIH0pIF9idXR0b25zOiBDbHJXaXphcmRQYWdlQnV0dG9ucztcblxuICAvKipcbiAgICogQ29udGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIGhlYWRlciBhY3Rpb25zIGRlZmluZWQgd2l0aGluIHRoZSBwYWdlLiBJZiBub3QgZGVmaW5lZCxcbiAgICogdGhlIHdpemFyZCBkZWZhdWx0cyB0byB0aGUgc2V0IG9mIGhlYWRlciBhY3Rpb25zIGRlZmluZWQgYXMgYSBkaXJlY3QgY2hpbGQgb2YgdGhlXG4gICAqIHdpemFyZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoQ2xyV2l6YXJkUGFnZUhlYWRlckFjdGlvbnMsIHsgc3RhdGljOiB0cnVlIH0pIF9oZWFkZXJBY3Rpb25zOiBDbHJXaXphcmRQYWdlSGVhZGVyQWN0aW9ucztcblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIHByaXZhdGUgX25leHRTdGVwRGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIHByaXZhdGUgX3ByZXZpb3VzU3RlcERpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBwcml2YXRlIF9oYXNFcnJvciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBfc3RvcENhbmNlbCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBfc3RvcE5leHQgPSBmYWxzZTtcblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIHByaXZhdGUgX2NvbXBsZXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQ2xyV2l6YXJkUGFnZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbmF2U2VydmljZTogV2l6YXJkTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgcHVibGljIHBhZ2VDb2xsZWN0aW9uOiBQYWdlQ29sbGVjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGJ1dHRvblNlcnZpY2U6IEJ1dHRvbkh1YlNlcnZpY2VcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBBIHByb3BlcnR5IHRoYXQgdGVsbHMgd2hldGhlciBvciBub3QgdGhlIHdpemFyZCBzaG91bGQgYmUgYWxsb3dlZFxuICAgKiB0byBtb3ZlIHRvIHRoZSBuZXh0IHBhZ2UuXG4gICAqXG4gICAqIFVzZWZ1bCBmb3IgaW4tcGFnZSB2YWxpZGF0aW9uIGJlY2F1c2UgaXQgcHJldmVudHMgZm9yd2FyZCBuYXZpZ2F0aW9uXG4gICAqIGFuZCB2aXNpYmx5IGRpc2FibGVzIHRoZSBuZXh0IGJ1dHRvbi5cbiAgICpcbiAgICogRG9lcyBub3QgcmVxdWlyZSB0aGF0IHlvdSByZS1pbXBsZW1lbnQgbmF2aWdhdGlvbiByb3V0aW5lcyBsaWtlIHlvdVxuICAgKiB3b3VsZCBpZiB5b3Ugd2VyZSB1c2luZyBDbHJXaXphcmRQYWdlLnByZXZlbnREZWZhdWx0IG9yXG4gICAqIFdpemFyZC5wcmV2ZW50RGVmYXVsdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIEBJbnB1dCgnY2xyV2l6YXJkUGFnZU5leHREaXNhYmxlZCcpXG4gIGdldCBuZXh0U3RlcERpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9uZXh0U3RlcERpc2FibGVkO1xuICB9XG4gIHNldCBuZXh0U3RlcERpc2FibGVkKHZhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHZhbEJvb2wgPSAhIXZhbDtcbiAgICBpZiAodmFsQm9vbCAhPT0gdGhpcy5fbmV4dFN0ZXBEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fbmV4dFN0ZXBEaXNhYmxlZCA9IHZhbEJvb2w7XG4gICAgICB0aGlzLm5leHRTdGVwRGlzYWJsZWRDaGFuZ2UuZW1pdCh2YWxCb29sKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBwcm9wZXJ0eSB0aGF0IHRlbGxzIHdoZXRoZXIgb3Igbm90IHRoZSB3aXphcmQgc2hvdWxkIGJlIGFsbG93ZWRcbiAgICogdG8gbW92ZSB0byB0aGUgcHJldmlvdXMgcGFnZS5cbiAgICpcbiAgICogVXNlZnVsIGZvciBpbi1wYWdlIHZhbGlkYXRpb24gYmVjYXVzZSBpdCBwcmV2ZW50cyBiYWNrd2FyZCBuYXZpZ2F0aW9uXG4gICAqIGFuZCB2aXNpYmx5IGRpc2FibGVzIHRoZSBwcmV2aW91cyBidXR0b24uXG4gICAqXG4gICAqIERvZXMgbm90IHJlcXVpcmUgdGhhdCB5b3UgcmUtaW1wbGVtZW50IG5hdmlnYXRpb24gcm91dGluZXMgbGlrZSB5b3VcbiAgICogd291bGQgaWYgeW91IHdlcmUgdXNpbmcgQ2xyV2l6YXJkUGFnZS5wcmV2ZW50RGVmYXVsdCBvclxuICAgKiBXaXphcmQucHJldmVudERlZmF1bHQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFBhZ2VQcmV2aW91c0Rpc2FibGVkJylcbiAgZ2V0IHByZXZpb3VzU3RlcERpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c1N0ZXBEaXNhYmxlZDtcbiAgfVxuICBzZXQgcHJldmlvdXNTdGVwRGlzYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdmFsQm9vbCA9ICEhdmFsO1xuICAgIGlmICh2YWxCb29sICE9PSB0aGlzLl9wcmV2aW91c1N0ZXBEaXNhYmxlZCkge1xuICAgICAgdGhpcy5fcHJldmlvdXNTdGVwRGlzYWJsZWQgPSB2YWxCb29sO1xuICAgICAgdGhpcy5wcmV2aW91c1N0ZXBEaXNhYmxlZENoYW5nZS5lbWl0KHZhbEJvb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYWdlIGhhcyBhbiBlcnJvciBhbmQgYWxzbyByZXNvbHZlIHRoZSBcImZhbHN5XCIgdmFsdWUuIFRoZVxuICAgKiBjdXJyZW50IGxvZ2ljIHRyZWF0IGEgXCIwXCIgb3IgYW4gZW1wdHkgc3RyaW5nIGFzIGZhbHNlIGFuZCBsaWtld2lzZSB3aWxsIHRyZWF0IGFueVxuICAgKiBcInRydXRoeVwiIHZhbHVlIGFzIHRydWUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFBhZ2VIYXNFcnJvcicpXG4gIGdldCBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGFzRXJyb3I7XG4gIH1cbiAgc2V0IGhhc0Vycm9yKHZhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHZhbEJvb2wgPSAhIXZhbDtcbiAgICBpZiAodmFsQm9vbCAhPT0gdGhpcy5faGFzRXJyb3IpIHtcbiAgICAgIHRoaXMuX2hhc0Vycm9yID0gdmFsQm9vbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBjYW5jZWwgYWN0aW9uIGZyb20gdGhlIHBhZ2UgbGV2ZWwuIEFsbG93cyB5b3UgdG8gdXNlIGFuXG4gICAqIGFsdGVybmF0ZSBmdW5jdGlvbiBmb3IgdmFsaWRhdGlvbiBvciBkYXRhLW11bmdpbmcgYmVmb3JlIGNhbmNlbGxpbmcgdGhlXG4gICAqIHdpemFyZCB3aGVuIGNvbWJpbmVkIHdpdGggdGhlIENscldpemFyZFBhZ2Uub25DYW5jZWxcbiAgICogKHRoZSBjbHJXaXphcmRQYWdlT25DYW5jZWwgb3V0cHV0KS5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhhdCB5b3UgbWFudWFsbHkgY2xvc2UgdGhlIHdpemFyZCBmcm9tIHlvdXIgaG9zdCBjb21wb25lbnQsXG4gICAqIHVzdWFsbHkgd2l0aCBhIGNhbGwgdG8gV2l6YXJkLmZvcmNlTmV4dCgpIG9yIHdpemFyZC5uZXh0KCk7XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDbHJXaXphcmRQYWdlXG4gICAqL1xuICBASW5wdXQoJ2NscldpemFyZFBhZ2VQcmV2ZW50RGVmYXVsdENhbmNlbCcpXG4gIGdldCBzdG9wQ2FuY2VsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wQ2FuY2VsO1xuICB9XG4gIHNldCBzdG9wQ2FuY2VsKHZhbDogYm9vbGVhbikge1xuICAgIGNvbnN0IHZhbEJvb2wgPSAhIXZhbDtcbiAgICBpZiAodmFsQm9vbCAhPT0gdGhpcy5fc3RvcENhbmNlbCkge1xuICAgICAgdGhpcy5fc3RvcENhbmNlbCA9IHZhbEJvb2w7XG4gICAgICB0aGlzLnN0b3BDYW5jZWxDaGFuZ2UuZW1pdCh2YWxCb29sKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGZvcndhcmQgbmF2aWdhdGlvbiBmcm9tIHRoZSBwYWdlIGxldmVsLiBBbGxvd3MgeW91IHRvIHVzZSBhblxuICAgKiBhbHRlcm5hdGUgZnVuY3Rpb24gZm9yIHZhbGlkYXRpb24gb3IgZGF0YS1tdW5naW5nIGJlZm9yZSBtb3ZpbmcgdGhlXG4gICAqIHdpemFyZCB0byB0aGUgbmV4dCBwYWdld2hlbiBjb21iaW5lZCB3aXRoIHRoZSBDbHJXaXphcmRQYWdlLm9uQ29tbWl0XG4gICAqIChjbHJXaXphcmRQYWdlT25Db21taXQpIG9yIENscldpemFyZFBhZ2UubmV4dEJ1dHRvbkNsaWNrZWRcbiAgICogKGNscldpemFyZFBhZ2VOZXh0KSBvdXRwdXRzLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGF0IHlvdSBtYW51YWxseSB0ZWxsIHRoZSB3aXphcmQgdG8gbmF2aWdhdGUgZm9yd2FyZCBmcm9tXG4gICAqIHRoZSBob3N0Q29tcG9uZW50LCB1c3VhbGx5IHdpdGggYSBjYWxsIHRvIFdpemFyZC5mb3JjZU5leHQoKSBvclxuICAgKiB3aXphcmQubmV4dCgpO1xuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2xyV2l6YXJkUGFnZVxuICAgKi9cbiAgQElucHV0KCdjbHJXaXphcmRQYWdlUHJldmVudERlZmF1bHROZXh0JylcbiAgZ2V0IHN0b3BOZXh0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdG9wTmV4dDtcbiAgfVxuICBzZXQgc3RvcE5leHQodmFsOiBib29sZWFuKSB7XG4gICAgY29uc3QgdmFsQm9vbCA9ICEhdmFsO1xuICAgIGlmICh2YWxCb29sICE9PSB0aGlzLl9zdG9wTmV4dCkge1xuICAgICAgdGhpcy5fc3RvcE5leHQgPSB2YWxCb29sO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlYWQtb25seSBnZXR0ZXIgdGhhdCBnZW5lcmF0ZXMgYW4gSUQgc3RyaW5nIGZvciB0aGUgd2l6YXJkIHBhZ2UgZnJvbVxuICAgKiBlaXRoZXIgdGhlIHZhbHVlIHBhc3NlZCB0byB0aGUgQ2xyV2l6YXJkUGFnZSBcImlkXCIgaW5wdXQgb3IgYSB3aXphcmQgcGFnZVxuICAgKiBjb3VudGVyIHNoYXJlZCBhY3Jvc3MgYWxsIHdpemFyZCBwYWdlcyBpbiB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgdmFsdWUgcGFzc2VkIGludG8gdGhlIElEIGlucHV0IFdpbGwgYmUgcHJlZml4ZWQgd2l0aFxuICAgKiBcImNsci13aXphcmQtcGFnZS1cIi5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDbHJXaXphcmRQYWdlXG4gICAqL1xuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAvLyBjb3ZlcnMgdGhpbmdzIGxpa2UgbnVsbCwgdW5kZWZpbmVkLCBmYWxzZSwgYW5kIGVtcHR5IHN0cmluZ1xuICAgIC8vIHdoaWxlIGFsbG93aW5nIHplcm8gdG8gcGFzc1xuICAgIGNvbnN0IGlkSXNOb25aZXJvRmFsc3kgPSAhdGhpcy5faWQgJiYgdGhpcy5faWQgIT09IDA7XG5cbiAgICAvLyBpbiBhZGRpdGlvbiB0byBub24temVybyBmYWxzeSB3ZSBhbHNvIHdhbnQgdG8gbWFrZSBzdXJlIF9pZCBpcyBub3QgYSBuZWdhdGl2ZVxuICAgIC8vIG51bWJlci5cbiAgICBpZiAoaWRJc05vblplcm9GYWxzeSB8fCB0aGlzLl9pZCA8IDApIHtcbiAgICAgIC8vIGd1YXJkIGhlcmUgaW4gdGhlIGV2ZW50IHRoYXQgaW5wdXQgYmVjb21lcyB1bmRlZmluZWQgb3IgbnVsbCBieSBhY2NpZGVudFxuICAgICAgdGhpcy5faWQgPSAod2l6YXJkUGFnZUluZGV4KyspLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBgY2xyLXdpemFyZC1wYWdlLSR7dGhpcy5faWR9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlYWQtb25seSBnZXR0ZXIgdGhhdCBzZXJ2ZXMgYXMgYSBjb252ZW5pZW5jZSBmb3IgdGhvc2Ugd2hvIHdvdWxkIHJhdGhlclxuICAgKiBub3QgdGhpbmsgaW4gdGhlIHRlcm1zIG9mICFDbHJXaXphcmRQYWdlLm5leHRTdGVwRGlzYWJsZWQuIEZvciBzb21lIHVzZSBjYXNlcyxcbiAgICogQ2xyV2l6YXJkUGFnZS5yZWFkeVRvQ29tcGxldGUgaXMgbW9yZSBsb2dpY2FsIGFuZCBkZWNsYXJhdGl2ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIGdldCByZWFkeVRvQ29tcGxldGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLm5leHRTdGVwRGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogQSBwYWdlIGlzIG1hcmtlZCBhcyBjb21wbGV0ZWQgaWYgaXQgaXMgYm90aCByZWFkeVRvQ29tcGxldGUgYW5kIGNvbXBsZXRlZCxcbiAgICogYXMgaW4gdGhlIG5leHQgb3IgZmluaXNoIGFjdGlvbiBoYXMgYmVlbiBleGVjdXRlZCB3aGlsZSB0aGlzIHBhZ2Ugd2FzIGN1cnJlbnQuXG4gICAqXG4gICAqIE5vdGUgdGhlcmUgaXMgYW5kIG9wZW4gcXVlc3Rpb24gYWJvdXQgaG93IHRvIGhhbmRsZSBwYWdlcyB0aGF0IGFyZSBtYXJrZWRcbiAgICogY29tcGxldGUgYnV0IHdobyBhcmUgbm8gbG9uZ2VyIHJlYWR5VG9Db21wbGV0ZS4gVGhpcyBtaWdodCBpbmRpY2F0ZSBhbiBlcnJvclxuICAgKiBzdGF0ZSBmb3IgdGhlIENscldpemFyZFBhZ2UuIEN1cnJlbnRseSwgdGhlIHdpemFyZCBkb2VzIG5vdCBhY2tub3dsZWRnZSB0aGlzIHN0YXRlXG4gICAqIGFuZCBvbmx5IHJldHVybnMgdGhhdCB0aGUgcGFnZSBpcyBpbmNvbXBsZXRlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgZ2V0IGNvbXBsZXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGxldGUgJiYgdGhpcy5yZWFkeVRvQ29tcGxldGU7XG5cbiAgICAvLyBGT1IgVjI6IFVOV0lORCBDT01QTEVURUQsIFJFQURZVE9DT01QTEVURSwgQU5EIEVSUk9SU1xuICAgIC8vIFNVQ0ggVEhBVCBFUlJPUlMgSVMgSVRTIE9XTiBJTlBVVC4gSUYgQSBTVEVQIElTXG4gICAgLy8gSU5DT01QTEVURSBBTkQgRVJST1JFRCwgRVJST1JFRCBXSUxMIE5PVCBTSE9XLlxuICAgIC8vIEZJUlNUIFFVRVNUSU9OOiBBTSBJIEdSRVkgT1IgQ09MT1JFRD9cbiAgICAvLyBTRUNPTkQgUVVFU1RJT046IEFNIEkgR1JFRU4gT1IgUkVEP1xuICB9XG5cbiAgLyoqXG4gICAqIEEgQ2xyV2l6YXJkUGFnZSBjYW4gYmUgbWFudWFsbHkgc2V0IHRvIGNvbXBsZXRlZCB1c2luZyB0aGlzIGJvb2xlYW4gc2V0dGVyLlxuICAgKiBJdCBpcyByZWNvbW1lbmRlZCB0aGF0IHVzZXJzIHJlbHkgb24gdGhlIGNvbnZlbmllbmNlIGZ1bmN0aW9ucyBpbiB0aGUgd2l6YXJkXG4gICAqIGFuZCBuYXZpZ2F0aW9uIHNlcnZpY2UgaW5zdGVhZCBvZiBtYW51YWxseSBzZXR0aW5nIHBhZ2Vz4oCZIGNvbXBsZXRpb24gc3RhdGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDbHJXaXphcmRQYWdlXG4gICAqL1xuICBzZXQgY29tcGxldGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY29tcGxldGUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2l0aCB0aGUgbmF2aWdhdGlvbiBzZXJ2aWNlIHRvIHNlZSBpZiBpdCBpcyB0aGUgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgZ2V0IGN1cnJlbnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmF2U2VydmljZS5jdXJyZW50UGFnZSA9PT0gdGhpcztcbiAgfVxuXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZW5hYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlYWQtb25seSBnZXR0ZXIgdGhhdCByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBwYWdlIGlzIG5hdmlnYWJsZVxuICAgKiBpbiB0aGUgd2l6YXJkLiBBIHdpemFyZCBwYWdlIGNhbiBiZSBuYXZpZ2F0ZWQgdG8gaWYgaXQgaXMgY29tcGxldGVkXG4gICAqIG9yIHRoZSBwYWdlIGJlZm9yZSBpdCBpcyBjb21wbGV0ZWQuXG4gICAqXG4gICAqIFRoaXMgZ2V0dGVyIGhhbmRsZXMgdGhlIGxvZ2ljIGZvciBlbmFibGluZyBvciBkaXNhYmxpbmcgdGhlIGxpbmtzIGluXG4gICAqIHRoZSBzdGVwIG5hdiBvbiB0aGUgbGVmdCBTaWRlIG9mIHRoZSB3aXphcmQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50IHx8IHRoaXMuY29tcGxldGVkIHx8IHRoaXMucHJldmlvdXNDb21wbGV0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQSByZWFkLW9ubHkgZ2V0dGVyIHRoYXQgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgcGFnZSBiZWZvcmUgdGhpc1xuICAgKiBDbHJXaXphcmRQYWdlIGlzIGNvbXBsZXRlZC4gVGhpcyBpcyB1c2VmdWwgZm9yIGRldGVybWluaW5nIHdoZXRoZXIgb3Igbm90XG4gICAqIGEgcGFnZSBpcyBuYXZpZ2FibGUgaWYgaXQgaXMgbm90IGN1cnJlbnQgb3IgYWxyZWFkeSBjb21wbGV0ZWQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBnZXQgcHJldmlvdXNDb21wbGV0ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcHJldmlvdXNQYWdlID0gdGhpcy5wYWdlQ29sbGVjdGlvbi5nZXRQcmV2aW91c1BhZ2UodGhpcyk7XG5cbiAgICBpZiAoIXByZXZpb3VzUGFnZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZXZpb3VzUGFnZS5jb21wbGV0ZWQ7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIGdldCB0aXRsZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5wYWdlVGl0bGUucGFnZVRpdGxlVGVtcGxhdGVSZWY7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIGdldCBuYXZUaXRsZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICBpZiAodGhpcy5wYWdlTmF2VGl0bGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhZ2VOYXZUaXRsZS5wYWdlTmF2VGl0bGVUZW1wbGF0ZVJlZjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFnZVRpdGxlLnBhZ2VUaXRsZVRlbXBsYXRlUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBnZXQgaGVhZGVyQWN0aW9ucygpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICBpZiAoIXRoaXMuX2hlYWRlckFjdGlvbnMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9oZWFkZXJBY3Rpb25zLnBhZ2VIZWFkZXJBY3Rpb25zVGVtcGxhdGVSZWY7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIGdldCBoYXNIZWFkZXJBY3Rpb25zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX2hlYWRlckFjdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQG1lbWJlcm9mIFdpemFyZFBhZ2VcbiAgICpcbiAgICovXG4gIGdldCBidXR0b25zKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIGlmICghdGhpcy5fYnV0dG9ucykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2J1dHRvbnMucGFnZUJ1dHRvbnNUZW1wbGF0ZVJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlYWQtb25seSBnZXR0ZXIgdGhhdCByZXR1cm5zIGEgYm9vbGVhbiB0aGF0IHNheXMgd2hldGhlciBvclxuICAgKiBub3QgdGhlIENscldpemFyZFBhZ2UgaW5jbHVkZXMgYnV0dG9ucy4gVXNlZCB0byBkZXRlcm1pbmUgaWYgdGhlXG4gICAqIFdpemFyZCBzaG91bGQgb3ZlcnJpZGUgdGhlIGRlZmF1bHQgYnV0dG9uIHNldCBkZWZpbmVkIGFzXG4gICAqIGl0cyBkaXJlY3QgY2hpbGRyZW4uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBXaXphcmRQYWdlXG4gICAqXG4gICAqL1xuICBnZXQgaGFzQnV0dG9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9idXR0b25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVhZC1vbmx5IGdldHRlciB0aGF0IHJldHVybnMgdGhlIGlkIHVzZWQgYnkgdGhlIHN0ZXAgbmF2IGl0ZW0gYXNzb2NpYXRlZCB3aXRoIHRoZSBwYWdlLlxuICAgKlxuICAgKiBDbHJXaXphcmRQYWdlIG5lZWRzIHRoaXMgSUQgc3RyaW5nIGZvciBhcmlhIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgZ2V0IHN0ZXBJdGVtSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlQ29sbGVjdGlvbi5nZXRTdGVwSXRlbUlkRm9yUGFnZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaW5rcyB0aGUgbmF2IHNlcnZpY2UgYW5kIGVzdGFibGlzaGVzIHRoZSBjdXJyZW50IHBhZ2UgaWYgb25lIGlzIG5vdCBkZWZpbmVkLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgbmF2U2VydmljZSA9IHRoaXMubmF2U2VydmljZTtcbiAgICBpZiAoIW5hdlNlcnZpY2UuY3VycmVudFBhZ2UgJiYgIW5hdlNlcnZpY2UubmF2U2VydmljZUxvYWRlZCkge1xuICAgICAgdGhpcy5tYWtlQ3VycmVudCgpO1xuICAgICAgdGhpcy5uYXZTZXJ2aWNlLm5hdlNlcnZpY2VMb2FkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VzIHRoZSBuYXYgc2VydmljZSB0byBtYWtlIHRoZSBDbHJXaXphcmRQYWdlIHRoZSBjdXJyZW50IHBhZ2UgaW4gdGhlXG4gICAqIHdpemFyZC4gQnlwYXNzZXMgYWxsIGNoZWNrcyBidXQgc3RpbGwgZW1pdHMgdGhlIENscldpemFyZFBhZ2Uub25Mb2FkXG4gICAqIChjbHJXaXphcmRQYWdlT25Mb2FkKSBvdXRwdXQuXG4gICAqXG4gICAqIEluIG1vc3QgY2FzZXMsIGl0IGlzIGJldHRlciB0byB1c2UgdGhlIGRlZmF1bHQgbmF2aWdhdGlvbiBmdW5jdGlvbnNcbiAgICogaW4gV2l6YXJkLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgV2l6YXJkUGFnZVxuICAgKlxuICAgKi9cbiAgbWFrZUN1cnJlbnQoKTogdm9pZCB7XG4gICAgdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlID0gdGhpcztcbiAgfVxufVxuIl19