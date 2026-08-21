/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { StepModelHolder } from '@clr/addons/var';

import { SummaryModel } from './summary.model';

/**
 * This is re-usable summary component that can be used as last step of the Wizard.
 * The data required by this component comes from the PropertyViewSectionModel returned by Step#summary
 */
@Component({
  selector: 'appfx-summary',
  standalone: false,
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.scss'],
})
export class SummaryComponent implements StepModelHolder {
  model: SummaryModel;
}
