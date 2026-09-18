/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { Step, StepModel, StepModelHolder, TabLayout, Var } from '@clr/addons/var';

class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

class RegionModel implements StepModel {
  region = Var.of<string>('us-east-1');
  readyToComplete = true;
}

class ReviewModel implements StepModel {
  readyToComplete = true;
}

@Component({
  selector: 'clr-tabs-story-name-step',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding: 1rem">
      <div class="clr-form-group">
        <label class="clr-control-label" for="res-name">Resource name</label>
        <input id="res-name" type="text" class="clr-input" [(ngModel)]="model.name.value" placeholder="my-resource" />
      </div>
    </div>
  `,
})
export class TabsNameStepComponent implements StepModelHolder {
  model: NameModel;
}

@Component({
  selector: 'clr-tabs-story-region-step',
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
export class TabsRegionStepComponent implements StepModelHolder {
  model: RegionModel;
}

@Component({
  selector: 'clr-tabs-story-review-step',
  standalone: true,
  template: `
    <div style="padding: 1rem">
      <h4>Review</h4>
      <p>Review your configuration before proceeding.</p>
    </div>
  `,
})
export class TabsReviewStepComponent implements StepModelHolder {
  model: ReviewModel;
}

class TabsWorkflowModel {
  name = Var.of<string>('');
  region = Var.of<string>('us-east-1');
}

@Component({
  selector: 'clr-tabs-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxTabsModule, TabsNameStepComponent, TabsRegionStepComponent, TabsReviewStepComponent],
  template: `
    <appfx-tabs
      [tabs]="steps"
      [model]="workflowModel"
      [tabLayout]="tabLayout"
      [disableTabsContent]="disableTabsContent"
      [showTabLinks]="showTabLinks"
    ></appfx-tabs>
  `,
})
export class TabsStoryWrapperComponent implements OnInit {
  @Input() tabLayout: TabLayout = TabLayout.horizontal;
  @Input() disableTabsContent = false;
  @Input() showTabLinks = true;

  workflowModel = new TabsWorkflowModel();
  steps: Step[] = [];

  ngOnInit() {
    this.steps = [
      { title: 'Name', componentClass: TabsNameStepComponent, model: new NameModel() } as Step,
      { title: 'Region', componentClass: TabsRegionStepComponent, model: new RegionModel() } as Step,
      { title: 'Review', componentClass: TabsReviewStepComponent, model: new ReviewModel() } as Step,
    ];
  }
}
