/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxMultiPageDialogModule, DialogComponent } from '@clr/addons/dialog';
import { AppfxWorkflowCoreModule, TabLayout } from '@clr/addons/var';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { DialogStoryWrapperComponent } from './dialog.storybook.component';

/**
 * The render targets `<clr-dialog-story-wrapper>`, so the wrapper — not the aliased `DialogComponent` —
 * owns the names the args bind to.
 */
type DialogArgs = DialogStoryWrapperComponent;

const meta: Meta<DialogArgs> = {
  title: 'Addons/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxMultiPageDialogModule, AppfxWorkflowCoreModule, CommonModule, DialogStoryWrapperComponent],
    }),
  ],
  argTypes: {
    tabLayout: {
      control: { type: 'select' },
      options: Object.values(TabLayout),
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full-screen'],
    },
    defaultButton: {
      control: { type: 'select' },
      options: ['submit', 'close'],
    },
    showTabLinks: { control: 'boolean' },
  },
  args: {
    tabLayout: TabLayout.horizontal,
    size: 'xl',
    defaultButton: 'close',
    showTabLinks: true,
  },
  render: args => ({
    props: args,
    component: DialogStoryWrapperComponent,
    template: `
      <clr-dialog-story-wrapper
        [title]="title"
        [tabLayout]="tabLayout"
        [size]="size"
        [defaultButton]="defaultButton"
        [showTabLinks]="showTabLinks"
      ></clr-dialog-story-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<DialogArgs>;

export const Default: Story = {};

export const VerticalTabs: Story = {
  args: {
    tabLayout: TabLayout.vertical,
  },
};

export const SubmitDefault: Story = {
  args: {
    defaultButton: 'submit',
  },
};
