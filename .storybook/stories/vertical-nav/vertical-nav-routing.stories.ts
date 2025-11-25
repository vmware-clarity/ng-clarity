/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  bellIcon,
  calendarIcon,
  ClrVerticalNav,
  ClrVerticalNavModule,
  folderIcon,
  homeIcon,
  IconShapeTuple,
  searchIcon,
  userIcon,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CommonModules } from '../../helpers/common';

const childLinks: { text: string }[] = [{ text: 'Route 1' }, { text: 'Route 1' }, { text: 'Route 1' }];

const navLinks: { iconShapeTuple: IconShapeTuple; text: string; children }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications', children: childLinks },
  { iconShapeTuple: homeIcon, text: 'Dashboard', children: childLinks },
  { iconShapeTuple: searchIcon, text: 'Search', children: childLinks },
  { iconShapeTuple: calendarIcon, text: 'Calendar', children: childLinks },
  { iconShapeTuple: folderIcon, text: 'Files', children: childLinks },
  { iconShapeTuple: userIcon, text: 'Profile', children: childLinks },
];

const VERTICAL_NAV_STATES = [
  {
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: true,
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: true,
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
];

export default {
  title: 'Vertical Nav/Vertical Nav Routing',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNav,
  argTypes: {
    // outputs
    clrVerticalNavGroupExpandedChange: { control: { disable: true } },
    clrVerticalNavCollapsedChange: { control: { disable: true } },
    // methods
    toggleByButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
    createRoute: { control: { disable: true }, table: { disable: true } },
    handleClick: { control: { disable: true }, table: { disable: true } },
    VERTICAL_NAV_STATES: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrVerticalNavGroupExpanded: false,
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    // outputs
    clrVerticalNavCollapsedChange: action('clrVerticalNavCollapsedChange'),
    // story helpers
    navLinks,
    activeRoute: 'notifications',
    includeIcons: true,
    createRoute: function (text, i) {
      return `${text.toLowerCase()}/${i}`;
    },
    handleClick: function (event, route) {
      event.stopPropagation();
      this.activeRoute = route;
    },
    VERTICAL_NAV_STATES,
  },
};

const NavRoutingTemplate: StoryFn = args => ({
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
            [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
            (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
          >
            <cds-icon *ngIf="includeIcons" [shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
            {{ navLink.text }}
            <clr-vertical-nav-group-children>
              <a
                clrVerticalNavLink
                *ngFor="let childNavLink of navLink.children; let index = index"
                [ngClass]="{ active: createRoute(navLink.text, index) == activeRoute }"
                (click)="handleClick($event, createRoute(navLink.text, index))"
              >
                {{ createRoute(navLink.text, index) }}
              </a>
            </clr-vertical-nav-group-children>
          </clr-vertical-nav-group>
        </clr-vertical-nav>
      </div>
    </div>
  `,
  props: args,
});

const NavRoutingAllTemplate: StoryFn = args => ({
  template: `
    <div *ngFor="let state of VERTICAL_NAV_STATES" style="margin-bottom: 30px">
      <div class="main-container">
        <div class="content-container">
          <clr-vertical-nav
            [clrVerticalNavCollapsible]="state?.clrVerticalNavCollapsible"
            [clrVerticalNavCollapsed]="state?.clrVerticalNavCollapsed"
            (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
          >
            <clr-vertical-nav-group
              *ngFor="let navLink of navLinks"
              [clrVerticalNavGroupExpanded]="state?.clrVerticalNavGroupExpanded"
              (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
            >
              <cds-icon *ngIf="state?.includeIcons" [shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
              {{ navLink.text }}
              <clr-vertical-nav-group-children>
                <a
                  clrVerticalNavLink
                  *ngFor="let childNavLink of navLink.children; let index = index"
                  [ngClass]="{ active: createRoute(navLink.text, index) == activeRoute }"
                  (click)="handleClick($event, createRoute(navLink.text, index))"
                >
                  {{ createRoute(navLink.text, index) }}
                </a>
              </clr-vertical-nav-group-children>
            </clr-vertical-nav-group>
          </clr-vertical-nav>
        </div>
      </div>
    </div>
  `,
  props: args,
});

export const NavWithRouting: StoryObj = {
  render: NavRoutingTemplate,
};

export const Showcase: StoryObj = {
  render: NavRoutingAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
