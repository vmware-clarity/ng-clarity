/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * `ClrVerticalNav` aliases every input (`@Input('clrVerticalNavCollapsed') get collapsed()`), so the `clr*`
 * names the template binds are declared here rather than taken from the class; only `toggleByButton` is
 * picked off the component, so the `argTypes` entry that hides its docgen row stays type-checked. The
 * templates read `createRoute` and `handleClick` off `props`, so both stay args rather than moving to a
 * story component.
 */
type VerticalNavRoutingArgs = Pick<ClrVerticalNav, 'toggleByButton'> & {
  clrVerticalNavGroupExpanded: boolean;
  clrVerticalNavCollapsible: boolean;
  clrVerticalNavCollapsed: boolean;
  clrVerticalNavCollapsedChange: (collapsed: boolean) => void;
  clrVerticalNavGroupExpandedChange: (expanded: boolean) => void;
  navLinks: { iconShapeTuple: IconShapeTuple; text: string; children: { text: string }[] }[];
  activeRoute: string;
  includeIcons: boolean;
  createRoute: (text: string, i: number) => string;
  handleClick: (event: Event, route: string) => void;
  VERTICAL_NAV_STATES: {
    clrVerticalNavGroupExpanded: boolean;
    clrVerticalNavCollapsible: boolean;
    clrVerticalNavCollapsed: boolean;
    includeIcons: boolean;
  }[];
};

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

const meta: Meta<VerticalNavRoutingArgs> = {
  title: 'Components/Navigation/Vertical Nav/Routing',
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
    ...hideControls('toggleByButton'),
    // story helpers
    ...hideControls('navLinks', 'createRoute', 'handleClick', 'VERTICAL_NAV_STATES'),
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
  render: args => ({
    template: `
      <div class="main-container">
        <div class="content-container">
          <clr-vertical-nav
            [clrVerticalNavCollapsible]="clrVerticalNavCollapsible"
            [clrVerticalNavCollapsed]="clrVerticalNavCollapsed"
            (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
          >
            @for (navLink of navLinks; track navLink) {
              <clr-vertical-nav-group
                [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
                (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
              >
                @if (includeIcons) {
                  <cds-icon [shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
                }
                {{ navLink.text }}
                <clr-vertical-nav-group-children>
                  @for (childNavLink of navLink.children; track childNavLink; let index = $index) {
                    <a
                      clrVerticalNavLink
                      [ngClass]="{ active: createRoute(navLink.text, index) == activeRoute }"
                      (click)="handleClick($event, createRoute(navLink.text, index))"
                    >
                      {{ createRoute(navLink.text, index) }}
                    </a>
                  }
                </clr-vertical-nav-group-children>
              </clr-vertical-nav-group>
            }
          </clr-vertical-nav>
        </div>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<VerticalNavRoutingArgs>;

export const NavWithRouting: Story = {};

export const Showcase: Story = {
  // render-override: this story renders one nav per VERTICAL_NAV_STATES entry, which the meta template cannot express
  render: args => ({
    template: `
      @for (state of VERTICAL_NAV_STATES; track state) {
        <div style="margin-bottom: 30px">
          <div class="main-container">
            <div class="content-container">
              <clr-vertical-nav
                [clrVerticalNavCollapsible]="state?.clrVerticalNavCollapsible"
                [clrVerticalNavCollapsed]="state?.clrVerticalNavCollapsed"
                (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
              >
                @for (navLink of navLinks; track navLink) {
                  <clr-vertical-nav-group
                    [clrVerticalNavGroupExpanded]="state?.clrVerticalNavGroupExpanded"
                    (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
                  >
                    @if (state?.includeIcons) {
                      <cds-icon [shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
                    }
                    {{ navLink.text }}
                    <clr-vertical-nav-group-children>
                      @for (childNavLink of navLink.children; track childNavLink; let index = $index) {
                        <a
                          clrVerticalNavLink
                          [ngClass]="{ active: createRoute(navLink.text, index) == activeRoute }"
                          (click)="handleClick($event, createRoute(navLink.text, index))"
                        >
                          {{ createRoute(navLink.text, index) }}
                        </a>
                      }
                    </clr-vertical-nav-group-children>
                  </clr-vertical-nav-group>
                }
              </clr-vertical-nav>
            </div>
          </div>
        </div>
      }
    `,
    props: args,
  }),
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
