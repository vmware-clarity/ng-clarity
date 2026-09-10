import * as i0 from '@angular/core';

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
declare class WorkflowStrings {
    /**
     * Cancel button label.
     */
    readonly cancel: string;
    /**
     * 'Back' wizard button label.
     */
    readonly back: string;
    /**
     * 'Next' wizard button label.
     */
    readonly next: string;
    /**
     * 'Finish' wizard button label.
     */
    readonly finish: string;
    /**
     * Workflow error step strings.
     */
    error: {
        /**
         * Error page title label.
         */
        readonly title: string;
        /**
         * Error page description label.
         */
        readonly description: string;
        /**
         * 'Error Details' label.
         */
        readonly details: string;
        /**
         * 'Retry' button label
         */
        readonly retry: string;
    };
    /**
     * Loading indicator label.
     */
    readonly loading: string;
    /**
     * Label for Ok button in Multi page Dialog.
     */
    readonly defaultOkButtonLabel: string;
    /**
     * Label for Cancel button in Multi page Dialog.
     */
    readonly defaultCancelButtonLabel: string;
    /**
     * Step status indicators.
     */
    readonly step: {
        /**
         * Indicates Completed Step
         */
        readonly completed: string;
        /**
         * Indicates that Step is in progress
         */
        readonly inProgress: string;
        /**
         * Indicates that Step is in error state
         */
        readonly error: string;
    };
    /**
     * Summary Page
     */
    readonly summary: {
        /**
         * Ready to Complete page title
         */
        readonly title: string;
        /**
         * Ready to Complete page description
         */
        readonly description: string;
    };
    /**
     * Default error message that will be displayed if an error occurs when the dialog is submitted.
     */
    readonly defaultDialogSubmitError: string;
    /**
     * Default error message that will be displayed if an error occurs when the wizard is submitted.
     */
    readonly defaultWizardSubmitError: string;
    /**
     * Open step nav panel aria label.
     */
    readonly openStepNavAriaLabel: string;
    /**
     * Close step nav panel aria label.
     */
    readonly closeStepNavAriaLabel: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkflowStrings, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WorkflowStrings>;
}

export { WorkflowStrings };
