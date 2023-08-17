/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
  <header class="{{color}}">
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Header/Header Colors',
  component: ClrHeader,
  argTypes: {
    color: {
      defaultValue: 'header-1',
      control: {
        type: 'select',
        options: ['header-1', 'header-2', 'header-3', 'header-4', 'header-5', 'header-6', 'header-7', 'header-8'],
      },
    },
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const variants: Parameters[] = [
  { color: 'header-1' },
  { color: 'header-2' },
  { color: 'header-3' },
  { color: 'header-4' },
  { color: 'header-5' },
  { color: 'header-6' },
  { color: 'header-7' },
  { color: 'header-8' },
];

setupStorybook([ClrMainContainerModule, ClrNavigationModule], defaultStory, defaultParameters, variants);
