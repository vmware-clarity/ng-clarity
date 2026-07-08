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

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';
import { SampleWorkflowModel } from '../wizard-addon/sample/sample-workflow.model';
import { SampleWorkflowService } from '../wizard-addon/sample/sample-workflow.service';

const BasicTabsHtml = require('!raw-loader!./ng/basic-tabs.html').default;
const BasicTabsTs = require('!raw-loader!./ng/basic-tabs.ts').default;

@Component({
  selector: 'app-tabs-addon-demo',
  templateUrl: './tabs-addon.demo.html',
  styleUrls: ['./tabs-addon.demo.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    AppfxTabsModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
  ],
  providers: [SampleWorkflowService],
})
export class TabsAddonDemoComponent extends ClarityDocComponent implements OnInit {
  TabLayout = TabLayout;
  readonly basicTabsHtml = BasicTabsHtml;
  readonly basicTabsTs = BasicTabsTs;

  steps: Step[] = [];
  tabsModel: SampleWorkflowModel;

  selectedLayout: TabLayout = TabLayout.horizontal;
  disableContent = false;
  showTabLinks = true;

  constructor(private workflowService: SampleWorkflowService) {
    super('tabs-addon');
  }

  ngOnInit() {
    this.tabsModel = this.workflowService.initModel('demo-datacenter-ref');
    this.steps = this.workflowService.buildStepperSteps(this.tabsModel);
  }
}
