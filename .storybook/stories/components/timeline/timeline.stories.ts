/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStepState } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrTimeline` aliases its input (`@Input('clrLayout') layout`), so the component class cannot be the args
 * type; the args are the names the template binds, including the step-state enum the template reads.
 */
type TimelineArgs = {
  clrLayout: ClrTimelineLayout;
  showBodyIcons: boolean;
  longText: boolean;
  ClrTimelineStepState: typeof ClrTimelineStepState;
};

const longText =
  'This step has a long description that wraps onto several lines, so the spacing between neighbouring steps is visible.';

const meta: Meta<TimelineArgs> = {
  title: 'Timeline/Timeline',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrTimelineModule],
    }),
  ],
  component: ClrTimeline,
  argTypes: {
    // inputs
    clrLayout: { control: { type: 'inline-radio' }, options: Object.values(ClrTimelineLayout) },
    // story helpers
    ...hideControls('ClrTimelineStepState'),
  },
  args: {
    // inputs
    clrLayout: ClrTimelineLayout.HORIZONTAL,
    showBodyIcons: false,
    longText: false,
    // story helpers
    ClrTimelineStepState,
  },
  render: args => ({
    template: `
      <clr-timeline [clrLayout]="clrLayout">
        <clr-timeline-step [clrState]="ClrTimelineStepState.SUCCESS">
          <clr-timeline-step-header>1:00 pm</clr-timeline-step-header>
          <clr-timeline-step-title>Success</clr-timeline-step-title>
          <clr-timeline-step-description>
            This is step was successful.
            @if (longText) {
              {{ longText }}
            }
            @if (showBodyIcons) {
              <div>
                Color 'danger' and size 'lg' of icon should not change:
                <cds-icon status="danger" size="lg" shape="dot-circle"></cds-icon>
              </div>
            }
            <button class="btn btn-sm">Action</button>
          </clr-timeline-step-description>
        </clr-timeline-step>
        <clr-timeline-step [clrState]="ClrTimelineStepState.ERROR">
          <clr-timeline-step-header>2:00 pm</clr-timeline-step-header>
          <clr-timeline-step-title>Error</clr-timeline-step-title>
          <clr-timeline-step-description>
            There was an error on this step.
            @if (longText) {
              {{ longText }}
            }
            @if (showBodyIcons) {
              <div>
                Color 'warning' and size 'md' of icon should not change:
                <cds-icon status="warning" size="md" shape="success-standard"></cds-icon>
              </div>
            }
            <button class="btn btn-sm">Action</button>
          </clr-timeline-step-description>
        </clr-timeline-step>
        <clr-timeline-step [clrState]="ClrTimelineStepState.PROCESSING">
          <clr-timeline-step-header>3:00 pm</clr-timeline-step-header>
          <clr-timeline-step-title>Processing</clr-timeline-step-title>
          <clr-timeline-step-description>
            This step is being processed.
            @if (longText) {
              {{ longText }}
            }
            @if (showBodyIcons) {
              <div>
                Color 'info' and size 'xxl' of icon should not change:
                <cds-icon status="info" size="xxl" shape="error-standard"></cds-icon>
              </div>
            }
            <button class="btn btn-sm">Action</button>
          </clr-timeline-step-description>
        </clr-timeline-step>
        <clr-timeline-step [clrState]="ClrTimelineStepState.CURRENT">
          <clr-timeline-step-header>4:00 pm</clr-timeline-step-header>
          <clr-timeline-step-title>Current</clr-timeline-step-title>
          <clr-timeline-step-description>
            @if (showBodyIcons) {
              <div>
                Color 'success' and size 'sm' of icon should not change:
                <cds-icon status="success" size="sm" shape="circle"></cds-icon>
              </div>
            }
            This is the current step.
            @if (longText) {
              {{ longText }}
            }
            <button class="btn btn-sm">Action</button>
          </clr-timeline-step-description>
        </clr-timeline-step>
        <clr-timeline-step [clrState]="ClrTimelineStepState.NOT_STARTED">
          <clr-timeline-step-header>5:00 pm</clr-timeline-step-header>
          <clr-timeline-step-title>Not Started</clr-timeline-step-title>
          <clr-timeline-step-description>
            This step has not been started.
            @if (longText) {
              {{ longText }}
            }
            @if (showBodyIcons) {
              <div>
                Color 'neutral' and size of icon should not change:
                <cds-icon status="neutral" shape="times"></cds-icon>
              </div>
            }
            <button class="btn btn-sm">Action</button>
          </clr-timeline-step-description>
        </clr-timeline-step>
      </clr-timeline>
    `,
    props: { ...args, longText: args['longText'] ? longText : '' },
  }),
};

export default meta;

type Story = StoryObj<TimelineArgs>;

export const HorizontalLayout: Story = {
  args: {
    clrLayout: ClrTimelineLayout.HORIZONTAL,
  },
};

export const VerticalLayout: Story = {
  args: {
    clrLayout: ClrTimelineLayout.VERTICAL,
  },
};

export const HorizontalLayoutWithIconsInBody: Story = {
  args: {
    clrLayout: ClrTimelineLayout.HORIZONTAL,
    showBodyIcons: true,
  },
};

export const HorizontalLayoutWithLongText: Story = {
  args: {
    clrLayout: ClrTimelineLayout.HORIZONTAL,
    longText: true,
  },
};
