/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Out, StepModel, Var } from '@clr/addons/var';

export enum CreationType {
  newVM = 'newVM',
  cloneExistingVM = 'cloneVM',
}

export class CreationTypeModel implements StepModel {
  loading = false;

  @Out() readonly creationType: Var<CreationType> = Var.of(CreationType.newVM);
}
