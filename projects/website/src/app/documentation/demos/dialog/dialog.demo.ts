/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { Step, TabLayout } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';
import { DIALOG_EXAMPLES } from '@clr/examples/dialog';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { SampleWorkflowService } from '../_utils/sample-workflow/sample-workflow.service';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'app-dialog-demo',
  templateUrl: './dialog.demo.html',
  styleUrls: ['./dialog.demo.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    RouterModule,
    AppfxMultiPageDialogModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    DocExampleComponent,
    AiSkillComponent,
  ],
  providers: [SampleWorkflowService],
})
export class DialogDemoComponent extends ClarityDocComponent implements OnInit {
  TabLayout = TabLayout;
  readonly examples = DIALOG_EXAMPLES;

  dialogOpened = false;
  steps: Step[] = [];

  dialogModel: any;

  selectedLayout: TabLayout = TabLayout.horizontal;
  selectedSize: 'full-screen' | 'xl' | 'lg' | 'md' | 'sm' = 'xl';
  selectedDefaultButton: 'submit' | 'close' = 'close';
  showTabLinks = true;

  readonly sizes = ['sm', 'md', 'lg', 'xl', 'full-screen'];

  constructor(private workflowService: SampleWorkflowService) {
    super('dialog');
  }

  ngOnInit() {
    this.dialogModel = this.workflowService.initModel('demo-datacenter-ref');
    this.steps = this.workflowService.buildStepperSteps(this.dialogModel);
  }

  openDialog() {
    this.dialogOpened = true;
  }
}
