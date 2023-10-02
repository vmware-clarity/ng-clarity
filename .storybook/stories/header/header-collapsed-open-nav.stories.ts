/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { moduleMetadata, Story } from '@storybook/angular';

export default {
  title: 'Header/Header-Smaller-screen',
  component: ClrHeader,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ClrMainContainerModule, ClrNavigationModule],
    }),
  ],
  args: {},
};

const Template = `
    <clr-main-container>
      <clr-header [role]="role">
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
  `;

export const Initial: Story = args => ({
  template: Template,
  props: args,
});
Initial.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
};

export const OpenedHeaderNav: Story = Initial.bind({});
OpenedHeaderNav.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
};
OpenedHeaderNav.play = async ({ canvasElement }) => {
  (canvasElement.querySelector('button.header-hamburger-trigger') as HTMLElement).click();
};

export const OpenedSubnav: Story = Initial.bind({});
OpenedSubnav.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
};
OpenedSubnav.play = async ({ canvasElement }) => {
  (canvasElement.querySelector('button.header-overflow-trigger') as HTMLElement).click();
};
