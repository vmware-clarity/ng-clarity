/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const HEADER_VARIANTS = [
  'header-1',
  'header-2',
  'header-3',
  'header-4',
  'header-5',
  'header-6',
  'header-7',
  'header-8',
];

export default {
  title: 'Header/Header Colors',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    color: { control: { type: 'select' }, options: HEADER_VARIANTS },
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
    HEADER_VARIANTS: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    color: 'header-1',
    HEADER_VARIANTS,
  },
};

const HeaderColorTemplate: StoryFn = args => ({
  template: `
    <header [class]="color">
      <div class="branding">
        <a href="javascript://" class="nav-link">
          <cds-icon shape="vm-bug"></cds-icon>
          <span class="title">Clarity Design</span>
        </a>
      </div>
    </header>
  `,
  props: args,
});

const HeaderColorAllTemplate: StoryFn = args => ({
  template: `
    <div style="margin-top: 10px" *ngFor="let color of HEADER_VARIANTS">
      <header [class]="color">
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
      </header>
    </div>
  `,
  props: args,
});

export const HeaderColors: StoryObj = {
  render: HeaderColorTemplate,
};

export const Showcase: StoryObj = {
  render: HeaderColorAllTemplate,
};
