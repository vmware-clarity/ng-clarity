/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-main-container>
      <clr-header>
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Project Clarity</span>
          </a>
        </div>
        <div class="header-nav" [clr-nav-level]="1">
          <a href="javascript://" class="nav-link nav-text">Home</a>
          <a href="javascript://" class="nav-link nav-text">About</a>
          <a href="javascript://" class="nav-link nav-text">Services</a>
        </div>
        <div class="header-actions">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="cog"></cds-icon>
          </a>
        </div>
      </clr-header>
      <nav class="subnav" [clr-nav-level]="2">
        <ul class="nav">
          <li class="nav-item">
              <a class="nav-link active" href="javascript://" aria-current="page">Dashboard</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="javascript://">Management</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="javascript://">Cloud</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="javascript://">Tenants</a>
          </li>
        </ul>
      </nav>
    </clr-main-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Header/Header',
  component: ClrHeader,
  argTypes: {
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
    // story helpers
  },
  args: {},
};

const variants: Parameters[] = [];

setupStorybook([ClrMainContainerModule, ClrNavigationModule], defaultStory, defaultParameters, variants);
