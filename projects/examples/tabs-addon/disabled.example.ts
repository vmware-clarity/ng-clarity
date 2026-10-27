/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { Step } from '@clr/addons/var';
import { ClrCheckboxModule } from '@clr/angular';

import { createSteps, TabsWorkflowModel } from './steps/steps';

@Component({
  selector: 'clr-tabs-addon-disabled-example',
  templateUrl: './disabled.example.html',
  styleUrl: './disabled.example.scss',
  imports: [AppfxTabsModule, ClrCheckboxModule, FormsModule],
})
export class TabsAddonDisabledExample {
  disableTabsContent = true;
  workflowModel = new TabsWorkflowModel();
  steps: Step[] = createSteps();
}
