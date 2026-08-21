/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { In, Out, StepModel, StepValidationState, Var } from '@clr/addons/var';

export class SelectHostModel implements StepModel {
  loading = false;
  validationState = new StepValidationState();

  @In({ optional: true })
  @Out()
  readonly computeResourceId: Var<string> = Var.of();

  @In({ optional: true })
  @Out()
  readonly computeResourceName: Var<string> = Var.of();
}
