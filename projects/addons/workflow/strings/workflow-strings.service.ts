/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

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
@Injectable()
export class WorkflowStrings {
  /**
   * Cancel button label.
   */
  readonly cancel: string = 'Cancel';

  /**
   * 'Back' wizard button label.
   */
  readonly back: string = 'Back';

  /**
   * 'Next' wizard button label.
   */
  readonly next: string = 'Next';

  /**
   * 'Finish' wizard button label.
   */
  readonly finish: string = 'Finish';

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
  } = {
    title: 'Error Loading Data',
    description:
      'An error occurred while trying to load data. This could be due to temporary outage. ' +
      'You can retry the operation by clicking retry button.',
    details: 'Error Details',
    retry: 'Retry',
  };

  /**
   * Loading indicator label.
   */
  readonly loading: string = 'Loading...';

  /**
   * Label for Ok button in Multi page Dialog.
   */
  readonly defaultOkButtonLabel: string = 'OK';

  /**
   * Label for Cancel button in Multi page Dialog.
   */
  readonly defaultCancelButtonLabel: string = 'Cancel';

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
  } = {
    completed: 'Completed',
    inProgress: 'In Progress',
    error: 'Error',
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
  } = {
    title: 'Ready To Complete',
    description: 'Review your selections before finishing the wizard',
  };

  /**
   * Default error message that will be displayed if an error occurs when the dialog is submitted.
   */
  readonly defaultDialogSubmitError: string = 'Dialog contains invalid data.';

  /**
   * Default error message that will be displayed if an error occurs when the wizard is submitted.
   */
  readonly defaultWizardSubmitError: string = 'Wizard contains invalid data.';

  /**
   * Open step nav panel aria label.
   */
  readonly openStepNavAriaLabel: string = 'Show wizard steps';

  /**
   * Close step nav panel aria label.
   */
  readonly closeStepNavAriaLabel: string = 'Close wizard steps';
}
