/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';

import { Step } from './step';
import { WorkflowModel } from './workflow.model';

/**
 * Interface that must be implemented by components passed via {@link WizardFooterConfig.componentClass}.
 * The wizard injects the current step, all steps, and the workflow model whenever the active step changes.
 */
export interface WizardFooter {
  currentStep: Step;
  steps: Step[];
  workflowModel: WorkflowModel;
}

/**
 * Configuration for the optional wizard footer component.
 */
export interface WizardFooterConfig {
  componentClass: Type<WizardFooter>;
}
