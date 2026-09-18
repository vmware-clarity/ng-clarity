/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxStepperModule, StepperComponent } from '@clr/addons/stepper';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { StepperStoryWrapperComponent } from './stepper.storybook.component';

/** The render targets `<clr-stepper-story-wrapper>`, so the wrapper's members are the args. */
type StepperArgs = StepperStoryWrapperComponent;

const meta: Meta<StepperArgs> = {
  title: 'Addons/Stepper',
  component: StepperComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxStepperModule, AppfxWorkflowCoreModule, CommonModule, StepperStoryWrapperComponent],
    }),
  ],
  argTypes: {
    usePrimaryNextButton: { control: { type: 'boolean' } },
  },
  args: {
    usePrimaryNextButton: false,
  },
  render: args => ({
    props: args,
    template: `
      <clr-stepper-story-wrapper [usePrimaryNextButton]="usePrimaryNextButton"></clr-stepper-story-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<StepperArgs>;

export const Default: Story = {};

export const PrimaryButton: Story = {
  args: { usePrimaryNextButton: true },
};
