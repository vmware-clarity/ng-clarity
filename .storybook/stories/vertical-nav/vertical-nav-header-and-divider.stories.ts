/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bellIcon, calendarIcon, folderIcon, homeIcon, searchIcon, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { ClrVerticalNav, ClrVerticalNavModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const navLinks: { iconShapeTuple: IconShapeTuple; text: string }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications' },
  { iconShapeTuple: homeIcon, text: 'Dashboard' },
  { iconShapeTuple: searchIcon, text: 'Search' },
  { iconShapeTuple: calendarIcon, text: 'Calendar' },
  { iconShapeTuple: folderIcon, text: 'Files' },
  { iconShapeTuple: userIcon, text: 'Profile' },
];

export default {
  title: 'Vertical Nav/Vertical Header and Divider',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNav,
  argTypes: {
    clrVerticalNavCollapsible: { control: { disable: true }, table: { disable: true } },
    clrVerticalNavCollapsed: { control: { disable: true }, table: { disable: true } },
    // outputs
    clrVerticalNavCollapsedChange: { control: { disable: true }, table: { disable: true } },
    // methods
    toggleByButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    navLinks,
  },
};

const NavHeaderDividerTemplate: Story = args => ({
  template: `
    <div class="content-container">
      <clr-vertical-nav>
        <label class="nav-header">First</label>
        <a *ngFor="let navLink of navLinks; let index = index" clrVerticalNavLink href="javascript:void(0)">
          {{ navLink.text }}
        </a>

        <div class="nav-divider"></div>

        <label class="nav-header">Second</label>
        <a *ngFor="let navLink of navLinks; let index = index" clrVerticalNavLink href="javascript:void(0)">
          {{ navLink.text }}
        </a>
      </clr-vertical-nav>
    </div>
  `,
  props: args,
});

export const NavHeaderAndDivider: StoryObj = {
  render: NavHeaderDividerTemplate,
};
