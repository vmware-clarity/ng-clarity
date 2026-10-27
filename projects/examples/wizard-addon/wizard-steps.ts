/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StepModel, StepModelHolder, Var } from '@clr/addons/var';

/* ---- Step 1 model ---- */
export class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

/* ---- Step 1 component ---- */
@Component({
  selector: 'clr-demo-wizard-step1',
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
