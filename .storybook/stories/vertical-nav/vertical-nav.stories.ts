/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bellIcon, calendarIcon, folderIcon, homeIcon, searchIcon, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { ClrVerticalNav, ClrVerticalNavModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
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
  title: 'Vertical Nav/Vertical Nav',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNav,
  argTypes: {
    // inputs
    clrVerticalNavCollapsible: { defaultValue: false, control: { type: 'boolean' } },
    clrVerticalNavCollapsed: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrVerticalNavCollapsedChange: { control: { disable: true } },
    // methods
    toggleByButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrVerticalNavCollapsedChange: action('clrVerticalNavCollapsedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
};

const VerticalNavTemplate: Story = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <clr-vertical-nav
          [clrVerticalNavCollapsible]="clrVerticalNavCollapsible"
          [clrVerticalNavCollapsed]="clrVerticalNavCollapsed"
          (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
        >
          <a
            *ngFor="let navLink of navLinks; let index = index"
            clrVerticalNavLink
            [ngClass]="{ 'active': index == activeIndex }"
            href="javascript:void(0)"
            (click)="activeIndex = index"
          >
            <cds-icon *ngIf="includeIcons" [attr.shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
            {{navLink.text}}
          </a>
        </clr-vertical-nav>
      </div>
    </div>
  `,
  props: args,
});

export const BasicNav: StoryObj = {
  render: VerticalNavTemplate,
  args: {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
};

export const NonCollapsibleWithIcons: StoryObj = {
  render: VerticalNavTemplate,
  args: {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
};

export const CollapsibleWithIcons: StoryObj = {
  render: VerticalNavTemplate,
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
};

export const Expanded: StoryObj = {
  render: VerticalNavTemplate,
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
};

export const Collapsed: StoryObj = {
  render: VerticalNavTemplate,
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
};
