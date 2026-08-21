/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Step, WizardFooter, WorkflowModel } from '@clr/addons/var';

@Component({
  selector: 'clr-demo-custom-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'custom-footer.component.html',
  styleUrl: 'custom-footer.component.scss',
})
export class CustomFooterComponent implements WizardFooter {
  @Input() currentStep: Step;
  @Input() steps: Step[];
  @Input() workflowModel: WorkflowModel;

  get isFirstStep(): boolean {
    return this.steps?.length > 0 && this.currentStep === this.steps[0];
  }

  onExport(): void {
    // TODO: implement export
  }
}
