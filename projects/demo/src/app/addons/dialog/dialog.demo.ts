/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { Step, TabLayout } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';

import type { SampleWorkflowModel } from '../wizard-addon/sample/sample-workflow.model';
import { SampleWorkflowService } from '../wizard-addon/sample/sample-workflow.service';

@Component({
  selector: 'clr-dialog-demo',
  templateUrl: './dialog.demo.html',
  styleUrls: ['./dialog.demo.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule, AppfxMultiPageDialogModule],
  providers: [SampleWorkflowService],
})
export class DialogDemoComponent implements OnInit {
  TabLayout = TabLayout;

  dialogOpened = false;
  steps: Step[] = [];
  dialogModel: SampleWorkflowModel;

  selectedLayout: TabLayout = TabLayout.horizontal;
  selectedSize: 'full-screen' | 'xl' | 'lg' | 'md' | 'sm' = 'xl';
  selectedDefaultButton: 'submit' | 'close' = 'close';
  showTabLinks = true;

  readonly sizes = ['sm', 'md', 'lg', 'xl', 'full-screen'];

  constructor(private workflowService: SampleWorkflowService) {}

  ngOnInit() {
    this.dialogModel = this.workflowService.initModel('demo-datacenter-ref');
    this.steps = this.workflowService.buildStepperSteps(this.dialogModel);
  }

  openDialog() {
    this.dialogOpened = true;
  }
}
