/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStepState } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Timeline/Timeline',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTimelineModule],
    }),
  ],
  component: ClrTimeline,
  argTypes: {
    // inputs
    clrLayout: { control: 'inline-radio', options: ClrTimelineLayout },
    // story helpers
    ClrTimelineStepState: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrLayout: ClrTimelineLayout.HORIZONTAL,
    // story helpers
    ClrTimelineStepState,
  },
};

const TimelineTempate: StoryFn = args => ({
  template: `
    <clr-timeline [clrLayout]="clrLayout">
      <clr-timeline-step [clrState]="ClrTimelineStepState.SUCCESS">
        <clr-timeline-step-header>1:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Success</clr-timeline-step-title>
        <clr-timeline-step-description>
          This is step was successful.
          <button class="btn btn-sm">Action</button>
        </clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.ERROR">
        <clr-timeline-step-header>2:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Error</clr-timeline-step-title>
        <clr-timeline-step-description>
          There was an error on this step.
          <button class="btn btn-sm">Action</button>
        </clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.PROCESSING">
        <clr-timeline-step-header>3:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Processing</clr-timeline-step-title>
        <clr-timeline-step-description>
          This step is being processed.
          <button class="btn btn-sm">Action</button>
        </clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.CURRENT">
        <clr-timeline-step-header>4:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Current</clr-timeline-step-title>
        <clr-timeline-step-description>
          This is the current step.
          <button class="btn btn-sm">Action</button>
        </clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.NOT_STARTED">
        <clr-timeline-step-header>5:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Not Started</clr-timeline-step-title>
        <clr-timeline-step-description>
          This step has not been started.
          <button class="btn btn-sm">Action</button>
        </clr-timeline-step-description>
      </clr-timeline-step>
    </clr-timeline>
  `,
  props: args,
});

export const HorizontalLayout: StoryObj = {
  render: TimelineTempate,
  args: {
    clrLayout: ClrTimelineLayout.HORIZONTAL,
  },
};

export const VerticalLayout: StoryObj = {
  render: TimelineTempate,
  args: {
    clrLayout: ClrTimelineLayout.VERTICAL,
  },
};
