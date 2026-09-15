/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloseHandler, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/* ---- Step 1 model ---- */
export class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

/* ---- Step 1 component ---- */
@Component({
  selector: 'clr-demo-wizard-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="vm-name">Virtual Machine Name</label>
      <div class="clr-control-container">
        <input id="vm-name" type="text" class="clr-input" [(ngModel)]="model.name.value" />
      </div>
    </div>
  `,
})
export class WizardStep1Component implements StepModelHolder {
  model: NameModel;
}

/* ---- Step 2 model ---- */
export class StorageModel implements StepModel {
  datastore = Var.of<string>('datastore-1');
  readyToComplete = true;
}

/* ---- Step 2 component ---- */
@Component({
  selector: 'clr-demo-wizard-step2',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="ds-select">Datastore</label>
      <div class="clr-control-container">
        <div class="clr-select-wrapper">
          <select id="ds-select" class="clr-select" [(ngModel)]="model.datastore.value">
            <option value="datastore-1">NFS Datastore 1 — 9.5 TB free</option>
            <option value="datastore-2">NFS Datastore 2 — 6.2 TB free</option>
          </select>
        </div>
      </div>
    </div>
  `,
})
export class WizardStep2Component implements StepModelHolder {
  model: StorageModel;
}

/* ---- Workflow model ---- */
export class DemoWorkflowModel {
  name = Var.of<string>('');
  datastore = Var.of<string>('datastore-1');
}

/* ---- Wrapper demo component ---- */
@Component({
  selector: 'clr-basic-wizard-demo',
  standalone: true,
  imports: [CommonModule, AppfxWizardModule, WizardStep1Component, WizardStep2Component],
  template: `
    <button class="btn btn-primary" (click)="open()">Open Wizard</button>

    <appfx-wizard
      title="Create Virtual Machine"
      [pages]="steps"
      [wizardModel]="model"
      [opened]="isOpen"
      (openedChange)="isOpen = $event"
      [closeHandler]="closeHandler"
    ></appfx-wizard>
  `,
})
export class BasicWizardDemoComponent implements OnInit {
  isOpen = false;
  model = new DemoWorkflowModel();
  steps: Step[];

  closeHandler: CloseHandler = {
    onSubmit: (): Observable<void> => of(undefined).pipe(delay(500)),
  };

  ngOnInit() {
    this.steps = [
      {
        title: 'Virtual Machine Name',
        description: 'Specify a unique name for your virtual machine',
        componentClass: WizardStep1Component,
        model: new NameModel(),
        summary: (builder, m: NameModel) => {
          builder.property('VM Name', m.name.value);
          return builder.build();
        },
      },
      {
        title: 'Select Storage',
        description: 'Choose where to store the virtual machine files',
        componentClass: WizardStep2Component,
        model: new StorageModel(),
      },
    ];
  }

  open() {
    this.model = new DemoWorkflowModel();
    this.isOpen = true;
  }
}
