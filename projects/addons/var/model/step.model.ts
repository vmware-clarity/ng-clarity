/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StepValidationState } from './step-validation-state';

/**
 *  A basic wizard page model. Every page is expected to have a model derived
 *  from this one and expose it.
 */
export interface StepModel {
  /**
   *  Indicating when the page is loading its data and when not. Set it to
   * 'true' when the page is in the process of loading its data and 'false'
   * when done with it.
   *
   * Used by the wizard framework to know when to show the loading indicator
   * and when not.
   *
   * If not provided - you won't be able to get loading indicator during your
   * data retrieval.
   */
  loading?: boolean;

  /**
   * Optional progress status text to be displayed below the loading spinner during
   * the data retrieval or the page validation.
   */
  progressStatus?: string;

  /**
   * Indicating whether the page validation can be canceled by the user.
   * If provided, the wizard framework will render a 'cancel' button below
   * the loading spinner
   */
  cancelableValidation?: CancelableStepValidation;

  /**
   * Used by the wizard framework to display errors/warnings/infos.
   */
  validationState?: StepValidationState;

  /**
   * Used by the wizard framework to disable the 'Next' button.
   * By default the 'Next' button is always enabled.
   * If this property is set to false, disable the Next button.
   */
  readyToComplete?: boolean;
}

/**
 * Interface representing cancelable step validation.
 */
export interface CancelableStepValidation {
  /**
   * Label to be used for the cancel validation button.
   */
  cancelButtonLabel: string;

  /**
   * Handler function that will be invoked by the wizard framework
   * when the cancel validation button is clicked. The page component
   * should take care to cancel any ongoing validate API calls and
   * to emit false value by the current OnStepValidate.validate() observable.
   */
  cancelValidation: () => void;
}
