/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTimelineModule, ClrTimelineStep, ClrTimelineStepState } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-timeline>
      <clr-timeline-step [clrState]="clrState">
        <clr-timeline-step-header *ngIf="header">{{header}}</clr-timeline-step-header>
        <clr-timeline-step-title *ngIf="title">{{title}}</clr-timeline-step-title>
        <clr-timeline-step-description *ngIf="description">{{description}}</clr-timeline-step-description>
      </clr-timeline-step>
    </clr-timeline>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Timeline/Timeline Step',
  component: ClrTimelineStep,
  argTypes: {
    // inputs
    clrState: {
      defaultValue: ClrTimelineStepState.NOT_STARTED,
      control: { type: 'inline-radio', options: ClrTimelineStepState },
    },
    // story helpers
    ClrTimelineStepState: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    ClrTimelineStepState,
    header: 'header',
    title: 'title',
    description: 'description',
  },
};

const variants: Parameters[] = [
  {
    clrState: ClrTimelineStepState.NOT_STARTED,
  },
  {
    clrState: ClrTimelineStepState.CURRENT,
  },
  {
    clrState: ClrTimelineStepState.PROCESSING,
  },
  {
    clrState: ClrTimelineStepState.SUCCESS,
  },
  {
    clrState: ClrTimelineStepState.ERROR,
  },
];

setupStorybook(ClrTimelineModule, defaultStory, defaultParameters, variants);
