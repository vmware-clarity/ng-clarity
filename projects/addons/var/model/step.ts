/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';
import { PropertyViewModel, PropertyViewSectionBuilder, PropertyViewSectionModel } from '@clr/addons/property-view';

import { ModelChanges } from './step-interfaces';
import { StepModel } from './step.model';
import { Var } from './var';
import { Mappings } from '../mappings/mappings';

/**
 * Describe a wizard step.
 */
export interface Step {
  /**
   * Step title
   */
  title: string;

  /**
   * Step description.
   * In case of Wizard - the description is rendered as subtitle (below the step title)
   * In case of Stepper - the description is rendered on the right of the step title.
   */
  description?: string;

  /**
   * In case of Wizard - title of the Navigation link displayed on the left. If not provided, {@link title} is used.
   * In case of Stepper - this field is not used.
   */
  navTitle?: string;

  /**
   * Step component class to render.
   */
  componentClass: Type<any>;

  /**
   * StepModel is the data model of the step injected to {@link componentClass.model}. It contains step input and output properties.
   * Needed properties from wizard model can be injected or ejected by decorating the properties with @In or @Out respectively.
   * If property names doesn't match with Wizard Model, define the external property name mappings using {@link mappings}
   *
   * If {@link recreateOnModelChange} is defined, model should be factory method which return {@link StepModel} instance
   */
  model?: StepModel | StepModelFactory;

  /**
   * If set to true, the {@link componentClass} will be instantiated when the step gets
   * activated for the very first time.
   * If set to false, the {@link componentClass} will be instantiated immediately when
   * the wizard is opened.
   */
  instantiateLazy?: boolean;

  /**
   * Use this property to conditionally include a step in the workflow.
   * Use Var.of() API to define a boolean relevance property.
   * Use Var.from() API to define a relevance check function.
   *
   * @example set isRelevant for step1 using Var.from() which depends on wizard model var connectionType
   * const step1.isRelevant = Var.from(this.model.connectionType).by((connectionType) => of(connectionType === ConnectionType.VMKERNEL))
   * step1 will be visible only if connectionType === ConnectionType.VMKERNEL
   *
   */
  isRelevant?: Var<boolean>;

  /**
   * Property name mappings from step model to wizard model if property names are different.
   * use {@link Mappings}
   * @example new Mappings<StepModel, WizardModel>()
   *             .mapStepProp("stepProp1").to("wizardProp1")
   *             .mapStepProp("stepProp2").to("wizardProp2")
   *             ...
   *             ...
   */
  mappings?: Mappings<any, any>;

  /**
   * Function that is invoked after the step is successfully validated.
   * In case of Wizard - the result will be displayed in "Ready to Complete" page.
   * In case of Stepper - this result will be displayed on the right of the step
   * title (after the user navigates to the next step).
   * @returns {PropertyViewSectionModel}
   */
  summary?: (builder: PropertyViewSectionBuilder, stepModel?: StepModel) => PropertyViewSectionModel;

  /**
   * Recreates the step component if the function returns true
   * If defined, {@link model} should be factory function.
   */
  recreateComponent?: (stepModelChanges?: ModelChanges) => boolean;
}

/**
 * Wizard Step description used internally
 */
export interface StepInternal extends Step {
  /**
   * Indicates whether the step is hidden in the wizard
   */
  isSkipped?: boolean;

  /**
   * StepModel instance which will be created from {@link StepModelFactory} or equal to {@link model}.
   */
  modelInstance?: StepModel;

  /**
   * Internal description field that will be used to display the actual description.
   * This field will be set with the appropriate value that needs to be displayed in
   * the wizard component depending on the current state of the step.
   * This field will be set with a simple text when step is incomplete or,
   * a formatted summary value when complete.
   * Note: This is currenlty used only in Stepper.
   */
  initialDescription?: PropertyViewModel;
}

/**
 * Step model factory method which returns new StepModel object.
 */
export type StepModelFactory = () => StepModel;
