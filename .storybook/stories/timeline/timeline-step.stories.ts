/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimelineModule, ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrTimelineStep` aliases its input (`@Input('clrState') state`), so the component class cannot be the
 * args type; the args are the names the templates bind, including the two data lists they read.
 */
type TimelineStepArgs = {
  clrState: ClrTimelineStepState;
  ClrTimelineStepState: typeof ClrTimelineStepState;
  header: string;
  title: string;
  description: string;
  TIMELINE_STEP_STATE: Array<{ clrState: ClrTimelineStepState }>;
};

const TIMELINE_STEP_STATE = [
  { clrState: ClrTimelineStepState.NOT_STARTED },
  { clrState: ClrTimelineStepState.CURRENT },
  { clrState: ClrTimelineStepState.PROCESSING },
  { clrState: ClrTimelineStepState.SUCCESS },
  { clrState: ClrTimelineStepState.ERROR },
];

const meta: Meta<TimelineStepArgs> = {
  title: 'Timeline/Timeline Step',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTimelineModule],
    }),
  ],
  component: ClrTimelineStep,
  argTypes: {
    // inputs
    clrState: { control: { type: 'inline-radio' }, options: Object.values(ClrTimelineStepState) },
    // story helpers
    ...hideControls('ClrTimelineStepState', 'TIMELINE_STEP_STATE'),
  },
  args: {
    // inputs
    clrState: ClrTimelineStepState.NOT_STARTED,
    // story helpers
    ClrTimelineStepState,
    header: 'header',
    title: 'title',
    description: 'description',
    TIMELINE_STEP_STATE,
  },
  render: args => ({
    template: `
      <clr-timeline>
        <clr-timeline-step [clrState]="clrState">
          @if (header) {
            <clr-timeline-step-header>{{ header }}</clr-timeline-step-header>
          }
          @if (title) {
            <clr-timeline-step-title>{{ title }}</clr-timeline-step-title>
          }
          @if (description) {
            <clr-timeline-step-description>{{ description }}</clr-timeline-step-description>
          }
        </clr-timeline-step>
      </clr-timeline>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<TimelineStepArgs>;

export const TimelineStep: Story = {};

export const TimelineStepStates: Story = {
  // render-override: this story repeats the step for every state in one canvas, which the single-step meta template cannot express
  render: args => ({
    template: `
      @for (state of TIMELINE_STEP_STATE; track state) {
        <div style="margin-top: 20px">
          <clr-timeline>
            <clr-timeline-step [clrState]="state.clrState">
              @if (header) {
                <clr-timeline-step-header>{{ header }}</clr-timeline-step-header>
              }
              @if (title) {
                <clr-timeline-step-title>{{ title }}</clr-timeline-step-title>
              }
              @if (description) {
                <clr-timeline-step-description>{{ description }}</clr-timeline-step-description>
              }
            </clr-timeline-step>
          </clr-timeline>
        </div>
      }
    `,
    props: args,
  }),
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
