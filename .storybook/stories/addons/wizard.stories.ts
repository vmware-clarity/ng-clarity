/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { AppfxWizardModule, WizardComponent } from '@clr/addons/wizard';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { WizardStoryWrapperComponent } from './wizard.storybook.component';

/** The render targets `<clr-wizard-story-wrapper>`, so the wrapper's members are the args. */
type WizardArgs = WizardStoryWrapperComponent;

const meta: Meta<WizardArgs> = {
  title: 'Addons/Wizard',
  component: WizardComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxWizardModule, AppfxWorkflowCoreModule, CommonModule, WizardStoryWrapperComponent],
    }),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['md', 'lg', 'xl', 'full-screen'],
    },
  },
  args: {
    label: 'Open Wizard',
    title: 'Create Workload',
    size: 'lg',
  },
  render: args => ({
    props: args,
    template: `
      <clr-wizard-story-wrapper [label]="label" [title]="title" [size]="size"></clr-wizard-story-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<WizardArgs>;

export const Default: Story = {};

export const FullScreen: Story = {
  args: { size: 'full-screen', label: 'Open Full-Screen Wizard' },
};
