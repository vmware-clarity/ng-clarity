/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Out, StepModel, StepValidationState, Var } from '@clr/addons/var';

export class SelectVmModel implements StepModel {
  loading = false;
  validationState = new StepValidationState();

  @Out() vmId: Var<string> = Var.of();

  @Out() vmName: Var<string> = Var.of();
}
