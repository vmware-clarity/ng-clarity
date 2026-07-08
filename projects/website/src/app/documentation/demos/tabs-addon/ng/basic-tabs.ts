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
import { Step, StepModel, StepModelHolder, TabLayout, Var } from '@clr/addons/var';

// ─── Step 1 model ─────────────────────────────────────────────────────────────
export class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

// ─── Step 1 component ─────────────────────────────────────────────────────────
@Component({
  selector: 'clr-basic-tabs-name-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding: 1rem">
      <div class="clr-form-group">
        <label class="clr-control-label" for="res-name">Resource name</label>
        <div class="clr-control-container">
          <input id="res-name" type="text" class="clr-input" [(ngModel)]="model.name.value" placeholder="my-resource" />
        </div>
      </div>
    </div>
  `,
})
export class BasicTabsNameStepComponent implements StepModelHolder {
  model: NameModel;
}

// ─── Step 2 model ─────────────────────────────────────────────────────────────
export class RegionModel implements StepModel {
  region = Var.of<string>('us-east-1');
  readyToComplete = true;
}

// ─── Step 2 component ─────────────────────────────────────────────────────────
@Component({
  selector: 'clr-basic-tabs-region-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding: 1rem">
      <div class="clr-select-wrapper">
        <select class="clr-select" [(ngModel)]="model.region.value">
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="us-west-2">US West (Oregon)</option>
          <option value="eu-west-1">Europe (Ireland)</option>
        </select>
      </div>
    </div>
  `,
})
export class BasicTabsRegionStepComponent implements StepModelHolder {
  model: RegionModel;
}

// ─── Workflow model ────────────────────────────────────────────────────────────
export class TabsWorkflowModel {
  name = Var.of<string>('');
  region = Var.of<string>('us-east-1');
}

// ─── Root component ───────────────────────────────────────────────────────────
@Component({
  selector: 'clr-basic-tabs-demo',
  standalone: true,
  imports: [CommonModule, AppfxTabsModule, BasicTabsNameStepComponent, BasicTabsRegionStepComponent],
  template: ` <appfx-tabs [tabs]="steps" [model]="workflowModel" [tabLayout]="TabLayout.horizontal"> </appfx-tabs> `,
})
export class BasicTabsDemoComponent implements OnInit {
  TabLayout = TabLayout;
  workflowModel = new TabsWorkflowModel();
  steps: Step[] = [];

  ngOnInit() {
    this.steps = [
      { title: 'Name', componentClass: BasicTabsNameStepComponent, model: new NameModel() } as Step,
      { title: 'Region', componentClass: BasicTabsRegionStepComponent, model: new RegionModel() } as Step,
    ];
  }
}
