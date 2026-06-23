/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { Step, TabLayout } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';

import { SampleWorkflowModel } from '../wizard-addon/sample/sample-workflow.model';
import { SampleWorkflowService } from '../wizard-addon/sample/sample-workflow.service';

@Component({
  selector: 'clr-tabs-addon-demo',
  templateUrl: './tabs-addon.demo.html',
  styleUrls: ['./tabs-addon.demo.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule, AppfxTabsModule],
  providers: [SampleWorkflowService],
})
export class TabsAddonDemoComponent implements OnInit {
  TabLayout = TabLayout;

  steps: Step[] = [];
  tabsModel: SampleWorkflowModel;

  selectedLayout: TabLayout = TabLayout.horizontal;
  disableContent = false;
  showTabLinks = true;

  constructor(private workflowService: SampleWorkflowService) {}

  ngOnInit() {
    this.tabsModel = this.workflowService.initModel('demo-datacenter-ref');
    this.steps = this.workflowService.buildStepperSteps(this.tabsModel);
  }
}
