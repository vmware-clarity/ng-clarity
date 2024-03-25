/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bellIcon, calendarIcon, folderIcon, homeIcon, searchIcon, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { ClrVerticalNavGroup, ClrVerticalNavModule } from '@clr/angular';
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
  title: 'Vertical Nav/Vertical Nav Group',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNavGroup,
  argTypes: {
    // inputs
    clrVerticalNavGroupExpanded: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrVerticalNavGroupExpandedChange: { control: { disable: true } },
    // methods
    collapseGroup: { control: { disable: true }, table: { disable: true } },
    expandAnimationDone: { control: { disable: true }, table: { disable: true } },
    expandGroup: { control: { disable: true }, table: { disable: true } },
    toggleExpand: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrVerticalNavGroupExpandedChange: action('clrVerticalNavGroupExpandedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
};

const NavGroupTemplate: Story = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <clr-vertical-nav [clrVerticalNavCollapsible]="true">
          <clr-vertical-nav-group
            [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
            (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
          >
            <cds-icon *ngIf="includeIcons" shape="bars" clrVerticalNavIcon></cds-icon>
            Menu
            <clr-vertical-nav-group-children>
              <a *ngFor="let navLink of navLinks; let index = index"
                clrVerticalNavLink
                [ngClass]="{ 'active': index == activeIndex }"
                href="javascript:void(0)"
                (click)="activeIndex = index"
              >
                <cds-icon *ngIf="includeIcons" [attr.shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
                {{navLink.text}}
              </a>
            </clr-vertical-nav-group-children>
          </clr-vertical-nav-group>
        </clr-vertical-nav>
      </div>
    </div>
  `,
  props: args,
});

export const NavGroupCollapsedWithIcons: StoryObj = {
  render: NavGroupTemplate,
  args: {
    clrVerticalNavGroupExpanded: false,
    includeIcons: true,
  },
};

export const NavGroupExpandedWithIcons: StoryObj = {
  render: NavGroupTemplate,
  args: {
    clrVerticalNavGroupExpanded: true,
    includeIcons: true,
  },
};

export const BasicNavGroupCollapsed: StoryObj = {
  render: NavGroupTemplate,
  args: {
    clrVerticalNavGroupExpanded: false,
    includeIcons: false,
  },
};

export const BasicNavGroupExpanded: StoryObj = {
  render: NavGroupTemplate,
  args: {
    clrVerticalNavGroupExpanded: true,
    includeIcons: false,
  },
};
