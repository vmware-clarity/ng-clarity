/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModel } from '@clr/addons/property-view';
import { StepModel } from '@clr/addons/var';

export class SummaryModel implements StepModel {
  loading = false;
  data: PropertyViewModel;
}
