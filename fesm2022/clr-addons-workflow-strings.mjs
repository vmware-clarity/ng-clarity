import * as i0 from '@angular/core';
import { Injectable } from '@angular/core';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * User-visible strings used in the workflow library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * workflows in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module, where you use the workflow components
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: WorkflowStrings, useClass: LocalizedWorkflowStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
class WorkflowStrings {
    constructor() {
        /**
         * Cancel button label.
         */
        this.cancel = 'Cancel';
        /**
         * 'Back' wizard button label.
         */
        this.back = 'Back';
        /**
         * 'Next' wizard button label.
         */
        this.next = 'Next';
        /**
         * 'Finish' wizard button label.
         */
        this.finish = 'Finish';
        /**
         * Workflow error step strings.
         */
        this.error = {
            title: 'Error Loading Data',
            description: 'An error occurred while trying to load data. This could be due to temporary outage. ' +
                'You can retry the operation by clicking retry button.',
            details: 'Error Details',
            retry: 'Retry',
        };
        /**
         * Loading indicator label.
         */
        this.loading = 'Loading...';
        /**
         * Label for Ok button in Multi page Dialog.
         */
        this.defaultOkButtonLabel = 'OK';
        /**
         * Label for Cancel button in Multi page Dialog.
         */
        this.defaultCancelButtonLabel = 'Cancel';
        /**
         * Step status indicators.
         */
        this.step = {
            completed: 'Completed',
            inProgress: 'In Progress',
            error: 'Error',
        };
        /**
         * Summary Page
         */
        this.summary = {
            title: 'Ready To Complete',
            description: 'Review your selections before finishing the wizard',
        };
        /**
         * Default error message that will be displayed if an error occurs when the dialog is submitted.
         */
        this.defaultDialogSubmitError = 'Dialog contains invalid data.';
        /**
         * Default error message that will be displayed if an error occurs when the wizard is submitted.
         */
        this.defaultWizardSubmitError = 'Wizard contains invalid data.';
        /**
         * Open step nav panel aria label.
         */
        this.openStepNavAriaLabel = 'Show wizard steps';
        /**
         * Close step nav panel aria label.
         */
        this.closeStepNavAriaLabel = 'Close wizard steps';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WorkflowStrings, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WorkflowStrings }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: WorkflowStrings, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { WorkflowStrings };
//# sourceMappingURL=clr-addons-workflow-strings.mjs.map
