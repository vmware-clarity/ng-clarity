/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { Step, TabLayout } from '@clr/addons/var';

import { createSteps, TabsWorkflowModel } from './steps/steps';

@Component({
  selector: 'clr-tabs-addon-vertical-example',
  templateUrl: './vertical.example.html',
  styleUrl: './vertical.example.scss',
  imports: [AppfxTabsModule],
})
export class TabsAddonVerticalExample {
  readonly TabLayout = TabLayout;
  workflowModel = new TabsWorkflowModel();
  steps: Step[] = createSteps();
}
