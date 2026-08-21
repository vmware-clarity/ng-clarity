/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CloseHandler, ModelChange, Step, WizardFooterConfig } from '@clr/addons/var';
import { AppfxWizardModule, WizardComponent } from '@clr/addons/wizard';
import { Observable, of, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CustomFooterComponent } from './custom-footer/custom-footer.component';
import { SampleWorkflowModel } from './sample-workflow.model';
import { SampleWorkflowService } from './sample-workflow.service';

@Component({
  selector: 'clr-demo-sample-wizard',
  standalone: true,
  imports: [AppfxWizardModule],
  templateUrl: 'sample-wizard.component.html',
})
export class SampleWizardComponent implements OnInit {
  @ViewChild(WizardComponent, { static: true }) wizard: WizardComponent;

  @Output() onClose = new EventEmitter<void>();

  @Input() vcMoRef: string;
  @Input() useDescriptionForNavTitle = false;
  @Input() showSummaryPage = true;
  @Input() wizardSize: string;
  @Input() asyncErrorOnSubmit = false;
  @Input() useCustomFooter = false;

  closeHandler: CloseHandler = {
    onSubmit: () => this.onWizardFinish(),
    onCancel: () => this.onWizardCancel(),
  };

  pages: Step[];
  wizardModel: SampleWorkflowModel;

  private readonly workflowService = inject(SampleWorkflowService);

  get footer(): WizardFooterConfig | undefined {
    return this.useCustomFooter ? { componentClass: CustomFooterComponent } : undefined;
  }

  ngOnInit(): void {
    this.wizardModel = this.workflowService.initModel(this.vcMoRef);
    this.pages = this.workflowService.buildWizardSteps(this.wizardModel, this.showSummaryPage);
    if (this.useDescriptionForNavTitle) {
      this.pages.forEach(step => {
        step.navTitle = step.description;
      });
    }
  }

  onModelChange(changes: ModelChange[]): void {
    console.debug('Wizard model changed', changes);
  }

  private onWizardFinish(): Observable<unknown> {
    return timer(1000).pipe(
      tap(() => {
        if (this.asyncErrorOnSubmit) {
          throw new Error('Simulated error in onSubmit handler.');
        }
        this.onClose.emit();
        this.workflowService.apply();
      })
    );
  }

  private onWizardCancel(): Observable<unknown> {
    this.onClose.emit();
    return of(true);
  }
}
