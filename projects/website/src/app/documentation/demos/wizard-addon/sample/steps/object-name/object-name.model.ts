/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CancelableStepValidation, In, Out, StepModel, StepValidationState, Var } from '@clr/addons/var';

export class ObjectNameModel implements StepModel {
  loading = false;
  validationState = new StepValidationState();
  progressStatus = '';
  cancelableValidation: CancelableStepValidation = undefined;

  @In({ optional: true }) defaultName: string;

  @In({ optional: true })
  @Out()
  readonly name: Var<string> = Var.of();
}
