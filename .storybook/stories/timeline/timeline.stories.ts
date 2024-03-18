/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStepState } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

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
    clrLayout: {
      defaultValue: ClrTimelineLayout.HORIZONTAL,
      control: { type: 'inline-radio', options: ClrTimelineLayout },
    },
    // story helpers
    ClrTimelineStepState: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    ClrTimelineStepState,
  },
};

const TimelineTempate: Story = args => ({
  template: `
    <clr-timeline [clrLayout]="clrLayout">
      <clr-timeline-step [clrState]="ClrTimelineStepState.SUCCESS">
        <clr-timeline-step-header>1:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Success</clr-timeline-step-title>
        <clr-timeline-step-description>This is step was successful.</clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.ERROR">
        <clr-timeline-step-header>2:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Error</clr-timeline-step-title>
        <clr-timeline-step-description>There was an error on this step.</clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.PROCESSING">
        <clr-timeline-step-header>3:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Processing</clr-timeline-step-title>
        <clr-timeline-step-description>This step is being processed.</clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.CURRENT">
        <clr-timeline-step-header>4:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Current</clr-timeline-step-title>
        <clr-timeline-step-description>This is the current step.</clr-timeline-step-description>
      </clr-timeline-step>
      <clr-timeline-step [clrState]="ClrTimelineStepState.NOT_STARTED">
        <clr-timeline-step-header>5:00 pm</clr-timeline-step-header>
        <clr-timeline-step-title>Not Started</clr-timeline-step-title>
        <clr-timeline-step-description>This step has not been started.</clr-timeline-step-description>
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
