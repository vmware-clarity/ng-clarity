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
import { ClarityModule } from '@clr/angular';

// ─── Step 1 model ─────────────────────────────────────────────────────────────
export class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

// ─── Step 1 component ─────────────────────────────────────────────────────────
@Component({
  selector: 'clr-full-tabs-name-step',
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
export class FullTabsNameStepComponent implements StepModelHolder {
  model: NameModel;
}

// ─── Step 2 model ─────────────────────────────────────────────────────────────
export class RegionModel implements StepModel {
  region = Var.of<string>('us-east-1');
  readyToComplete = true;
}

// ─── Step 2 component ─────────────────────────────────────────────────────────
@Component({
  selector: 'clr-full-tabs-region-step',
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
export class FullTabsRegionStepComponent implements StepModelHolder {
  model: RegionModel;
}

// ─── Step 3 model ─────────────────────────────────────────────────────────────
export class ReviewModel implements StepModel {
  readyToComplete = true;
}

// ─── Step 3 component ─────────────────────────────────────────────────────────
@Component({
  selector: 'clr-full-tabs-review-step',
  standalone: true,
  template: `
    <div style="padding: 1rem">
      <h4>Review</h4>
      <p>Review your configuration before proceeding.</p>
    </div>
  `,
})
export class FullTabsReviewStepComponent implements StepModelHolder {
  model: ReviewModel;
}

// ─── Workflow model ────────────────────────────────────────────────────────────
export class TabsWorkflowModel {
  name = Var.of<string>('');
  region = Var.of<string>('us-east-1');
}

// ─── Root component ───────────────────────────────────────────────────────────
@Component({
  selector: 'clr-full-tabs-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    AppfxTabsModule,
    FullTabsNameStepComponent,
    FullTabsRegionStepComponent,
    FullTabsReviewStepComponent,
  ],
  template: `
    <div class="tabs-playground-controls">
      <clr-radio-container clrInline>
        <label>Layout</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="layout" [value]="TabLayout.horizontal" [(ngModel)]="selectedLayout" />
          <label>Horizontal</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="layout" [value]="TabLayout.vertical" [(ngModel)]="selectedLayout" />
          <label>Vertical</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio name="layout" [value]="TabLayout.secondary" [(ngModel)]="selectedLayout" />
          <label>Secondary</label>
        </clr-radio-wrapper>
      </clr-radio-container>

      <clr-toggle-wrapper>
        <input type="checkbox" clrToggle [(ngModel)]="disableContent" />
        <label>Disable tab content</label>
      </clr-toggle-wrapper>

      <clr-toggle-wrapper>
        <input type="checkbox" clrToggle [(ngModel)]="showTabLinks" />
        <label>Show tab links</label>
      </clr-toggle-wrapper>
    </div>

    <appfx-tabs
      [tabs]="steps"
      [model]="workflowModel"
      [tabLayout]="selectedLayout"
      [disableTabsContent]="disableContent"
      [showTabLinks]="showTabLinks"
    >
    </appfx-tabs>
  `,
})
export class FullTabsDemoComponent implements OnInit {
  TabLayout = TabLayout;
  workflowModel = new TabsWorkflowModel();
  steps: Step[] = [];

  selectedLayout: TabLayout = TabLayout.horizontal;
  disableContent = false;
  showTabLinks = true;

  ngOnInit() {
    this.steps = [
      { title: 'Name', componentClass: FullTabsNameStepComponent, model: new NameModel() } as Step,
      { title: 'Region', componentClass: FullTabsRegionStepComponent, model: new RegionModel() } as Step,
      { title: 'Review', componentClass: FullTabsReviewStepComponent, model: new ReviewModel() } as Step,
    ];
  }
}
