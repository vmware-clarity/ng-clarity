/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdownModule, ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `

  <iframe width="500" src="/iframe.html?args=&id=header-header--default&viewMode=story" style="border: none;"></iframe>
    
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Header/Headers Collapsed',
  component: ClrHeader,
  argTypes: {
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const variants: Parameters[] = [];

setupStorybook(
  [ClrMainContainerModule, ClrNavigationModule, ClrDropdownModule],
  defaultStory,
  defaultParameters,
  variants
);
