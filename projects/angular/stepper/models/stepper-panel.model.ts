/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CollapsiblePanelModel } from '@clr/angular/collapsible-panel';

import { StepperPanelStatus } from '../enums/stepper-panel-status.enum';

export class StepperPanelModel extends CollapsiblePanelModel {
  status = StepperPanelStatus.Inactive;
}
