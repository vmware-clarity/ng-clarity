/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { StepModel } from './step.model';
import { ModelChange } from './workflow-model-manager.service';

/**
 * Interface which has to be implemented by each component (controller) which will
 * serve as a page in the wizard
 *
 * @deprecated Use finer-grained interfaces like {@link StepModelHolder},
 *    {@link OnStepActivate}, {@link OnStepValidate}
 */
export interface StepComponent extends StepModelHolder, OnStepActivate, OnStepValidate {}

/**
 * Interface that should be implemented by step component that has a model.
 */
export interface StepModelHolder {
  model: StepModel;
}

/**
 * Step life cycle hook invoked every time a page is activated.
 */
export interface OnStepActivate {
  /**
   * Called every time when a page is visited by the user.
   * Use this to check whether the input parameters of the page
   * have changed and if so - you may need to re-initialize page with
   * new data matching the input parameters.
   *
   * @param {ModelChanges} stepModelChanges A hashtable of changes:
   * - key - the name of StepModel property, decorated with @In()
   * - value - {@link ModelChange} object that contains previous and current property values
   * When a step component is activated for the very first time, all properties decorated with @In will be present in the object.
   * In other cases e.g. when the user navigates back and forth through the steps,
   * only properties that have changed after previous activation, will be present.
   * If there are no changes, it will be empty object.
   */
  activate(stepModelChanges: ModelChanges): void;
}

/**
 * Step life cycle hook invoked every time is about to be deactivated (on Next or Finish).
 */
export interface OnStepValidate {
  /**
   * Called when a Next(or Finish if the last page) button is clicked. Use this to
   * validate page data.
   */
  validate(): Observable<boolean>;
}

/**
 * A hashtable of changes:
 * - key - the name of StepModel property, decorated with @In()
 * - value - {@link ModelChange} object that contains previous and current property values
 */
export interface ModelChanges {
  [propName: string]: ModelChange;
}
