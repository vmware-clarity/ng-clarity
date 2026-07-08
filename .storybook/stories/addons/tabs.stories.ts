/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxTabsModule, TabsComponent } from '@clr/addons/tabs';
import { AppfxWorkflowCoreModule, Step, StepModel, StepModelHolder, TabLayout, Var } from '@clr/addons/var';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

// ─── Step models ─────────────────────────────────────────────────────────────

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

// ─── Step components ─────────────────────────────────────────────────────────

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
class TabsNameStepComponent implements StepModelHolder {
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
class TabsRegionStepComponent implements StepModelHolder {
  model: RegionModel;
}

@Component({
  selector: 'clr-tabs-story-review-step',
  standalone: true,
  template: ` <div style="padding: 1rem"><p>Review your configuration before proceeding.</p></div> `,
})
class TabsReviewStepComponent implements StepModelHolder {
  model: ReviewModel;
}

// ─── Workflow model ───────────────────────────────────────────────────────────

class TabsWorkflowModel {
  name = Var.of<string>('');
  region = Var.of<string>('us-east-1');
}

// ─── Wrapper component ────────────────────────────────────────────────────────

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
class TabsStoryWrapperComponent implements OnInit {
  tabLayout: TabLayout = TabLayout.horizontal;
  disableTabsContent = false;
  showTabLinks = true;

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

// ─── Story exports ────────────────────────────────────────────────────────────

export default {
  title: 'Addons/Tabs',
  component: TabsComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxTabsModule, AppfxWorkflowCoreModule, CommonModule, TabsStoryWrapperComponent],
    }),
  ],
  argTypes: {
    tabLayout: {
      control: { type: 'select' },
      options: [TabLayout.horizontal, TabLayout.vertical, TabLayout.secondary],
    },
    disableTabsContent: { control: { type: 'boolean' } },
    showTabLinks: { control: { type: 'boolean' } },
  },
  args: {
    tabLayout: TabLayout.horizontal,
    disableTabsContent: false,
    showTabLinks: true,
  },
};

const TabsTemplate: StoryFn = args => ({
  props: args,
  template: `
    <clr-tabs-story-wrapper
      [tabLayout]="tabLayout"
      [disableTabsContent]="disableTabsContent"
      [showTabLinks]="showTabLinks"
    ></clr-tabs-story-wrapper>
  `,
});

export const Default: StoryObj = {
  render: TabsTemplate,
};

export const Vertical: StoryObj = {
  render: TabsTemplate,
  args: { tabLayout: TabLayout.vertical },
};

export const Secondary: StoryObj = {
  render: TabsTemplate,
  args: { tabLayout: TabLayout.secondary },
};

export const ContentDisabled: StoryObj = {
  render: TabsTemplate,
  args: { disableTabsContent: true },
};
