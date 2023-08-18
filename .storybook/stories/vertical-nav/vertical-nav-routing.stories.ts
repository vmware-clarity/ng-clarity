/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bellIcon, calendarIcon, folderIcon, homeIcon, searchIcon, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { ClrVerticalNav, ClrVerticalNavModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const childLinks: { text: string }[] = [{ text: 'Route 1' }, { text: 'Route 1' }, { text: 'Route 1' }];

const navLinks: { iconShapeTuple: IconShapeTuple; text: string; children }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications', children: childLinks },
  { iconShapeTuple: homeIcon, text: 'Dashboard', children: childLinks },
  { iconShapeTuple: searchIcon, text: 'Search', children: childLinks },
  { iconShapeTuple: calendarIcon, text: 'Calendar', children: childLinks },
  { iconShapeTuple: folderIcon, text: 'Files', children: childLinks },
  { iconShapeTuple: userIcon, text: 'Profile', children: childLinks },
];

const defaultStory: Story = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <clr-vertical-nav
          [clrVerticalNavCollapsible]="clrVerticalNavCollapsible"
          [clrVerticalNavCollapsed]="clrVerticalNavCollapsed"
          (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
        >
          <clr-vertical-nav-group 
            *ngFor="let navLink of navLinks" 
            [ngClass]="{ 'active': navLink.text.toLowerCase() == activeRoute }"
            [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
            (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
          >
            <a
                (click)="handleClick($event, navLink.text.toLowerCase())"
              [ngClass]="{ 'active': navLink.text.toLowerCase() == activeRoute }"
              clrVerticalNavLink
              href="javascript:void(0)"
            >
              <cds-icon *ngIf="includeIcons" [attr.shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
              {{navLink.text}}
            </a>
            <clr-vertical-nav-group-children>
              <a clrVerticalNavLink
                *ngFor="let childNavLink of navLink.children; let index = index"
                [ngClass]="{ 'active': createId(navLink.text, index) == activeRoute }"
                (click)="handleClick($event, createId(navLink.text, index))"
              >
                {{createId(navLink.text, index)}}
              </a>
            </clr-vertical-nav-group-children>
          </clr-vertical-nav-group>
        </clr-vertical-nav>
      </div>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Vertical Nav/Vertical Nav Routing',
  component: ClrVerticalNav,
  argTypes: {
    // inputs
    clrVerticalNavGroupExpanded: { defaultValue: false, control: { type: 'boolean' } },
    clrVerticalNavCollapsible: { defaultValue: true, control: { type: 'boolean' } },
    clrVerticalNavCollapsed: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrVerticalNavGroupExpandedChange: { control: { disable: true } },
    clrVerticalNavCollapsedChange: { control: { disable: true } },
    // methods
    toggleByButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
    createId: { control: { disable: true }, table: { disable: true } },
    handleClick: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrVerticalNavCollapsedChange: action('clrVerticalNavCollapsedChange'),
    // story helpers
    navLinks,
    activeRoute: 'notifications',
    includeIcons: true,
    createId: function (text, i) {
      return `${text.toLowerCase()}/${i}`;
    },
    handleClick: function (event, route) {
      event.stopPropagation();
      this.activeRoute = route;
    },
  },
};

const variants: Parameters[] = [
  {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
  {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
];

setupStorybook(ClrVerticalNavModule, defaultStory, defaultParameters, variants);
