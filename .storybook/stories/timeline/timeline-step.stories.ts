/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimelineModule, ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const TIMELINE_STEP_STATE = [
  { clrState: ClrTimelineStepState.NOT_STARTED },
  { clrState: ClrTimelineStepState.CURRENT },
  { clrState: ClrTimelineStepState.PROCESSING },
  { clrState: ClrTimelineStepState.SUCCESS },
  { clrState: ClrTimelineStepState.ERROR },
];

export default {
  title: 'Timeline/Timeline Step',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTimelineModule],
    }),
  ],
  component: ClrTimelineStep,
  argTypes: {
    // inputs
    clrState: {
      defaultValue: ClrTimelineStepState.NOT_STARTED,
      control: { type: 'inline-radio', options: ClrTimelineStepState },
    },
    // story helpers
    ClrTimelineStepState: { control: { disable: true }, table: { disable: true } },
    TIMELINE_STEP_STATE: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    ClrTimelineStepState,
    header: 'header',
    title: 'title',
    description: 'description',
    TIMELINE_STEP_STATE,
  },
};

const TimelineStepTemplate: Story = args => ({
  template: `
    <clr-timeline>
      <clr-timeline-step [clrState]="clrState">
        <clr-timeline-step-header *ngIf="header">{{header}}</clr-timeline-step-header>
        <clr-timeline-step-title *ngIf="title">{{title}}</clr-timeline-step-title>
        <clr-timeline-step-description *ngIf="description">{{description}}</clr-timeline-step-description>
      </clr-timeline-step>
    </clr-timeline>
  `,
  props: args,
});

const TimelineStepAllTemplate: Story = args => ({
  template: `
    <div *ngFor="let state of TIMELINE_STEP_STATE" style="margin-top:20px">
      <clr-timeline>
        <clr-timeline-step [clrState]="state.clrState">
          <clr-timeline-step-header *ngIf="header">{{header}}</clr-timeline-step-header>
          <clr-timeline-step-title *ngIf="title">{{title}}</clr-timeline-step-title>
          <clr-timeline-step-description *ngIf="description">{{description}}</clr-timeline-step-description>
        </clr-timeline-step>
      </clr-timeline>
    </div>
  `,
  props: args,
});

export const TimelineStep: StoryObj = {
  render: TimelineStepTemplate,
};

export const TimelineStepStates: StoryObj = {
  render: TimelineStepAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
