/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxTabsModule, TabsComponent } from '@clr/addons/tabs';
import { AppfxWorkflowCoreModule, TabLayout } from '@clr/addons/var';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { TabsStoryWrapperComponent } from './tabs.storybook.component';

/** The render targets `<clr-tabs-story-wrapper>`, so the wrapper's inputs are the args. */
type TabsArgs = TabsStoryWrapperComponent;

const meta: Meta<TabsArgs> = {
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
  render: args => ({
    props: args,
    template: `
      <clr-tabs-story-wrapper
        [tabLayout]="tabLayout"
        [disableTabsContent]="disableTabsContent"
        [showTabLinks]="showTabLinks"
      ></clr-tabs-story-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<TabsArgs>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { tabLayout: TabLayout.vertical },
};

export const Secondary: Story = {
  args: { tabLayout: TabLayout.secondary },
};

export const ContentDisabled: Story = {
  args: { disableTabsContent: true },
};
