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
 * `ClrVerticalNav` cannot be the args base: it declares every input under a different property name
 * (`@Input('clrVerticalNavCollapsed') get collapsed()`), so the `clr*` names the template binds are not
 * properties of the class. `toggleByButton` is picked off the component only so the `argTypes` entry that
 * hides its docgen row stays type-checked.
 */
type VerticalNavArgs = Pick<ClrVerticalNav, 'toggleByButton'> & {
  clrVerticalNavCollapsible: boolean;
  clrVerticalNavCollapsed: boolean;
  clrVerticalNavToggleLabel: string;
  clrVerticalNavCollapsedChange: (collapsed: boolean) => void;
  navLinks: { iconShapeTuple: IconShapeTuple; text: string }[];
  activeIndex: number;
  includeIcons: boolean;
};

const navLinks: { iconShapeTuple: IconShapeTuple; text: string }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications' },
  { iconShapeTuple: homeIcon, text: 'Dashboard' },
  { iconShapeTuple: searchIcon, text: 'Search' },
  { iconShapeTuple: calendarIcon, text: 'Calendar' },
  { iconShapeTuple: folderIcon, text: 'Files' },
  { iconShapeTuple: userIcon, text: 'Profile' },
];

const meta: Meta<VerticalNavArgs> = {
  title: 'Vertical Nav/Vertical Nav',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNav,
  argTypes: {
    // outputs
    clrVerticalNavCollapsedChange: { control: { disable: true } },
    // methods
    ...hideControls('toggleByButton'),
    // story helpers
    ...hideControls('navLinks'),
  },
  args: {
    // inputs
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    clrVerticalNavToggleLabel: '',
    // outputs
    clrVerticalNavCollapsedChange: action('clrVerticalNavCollapsedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
  render: args => ({
    template: `
      <div class="main-container">
        <div class="content-container">
          <clr-vertical-nav
            [clrVerticalNavCollapsible]="clrVerticalNavCollapsible"
            [clrVerticalNavToggleLabel]="clrVerticalNavToggleLabel"
            [clrVerticalNavCollapsed]="clrVerticalNavCollapsed"
            (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
          >
            @for (navLink of navLinks; track navLink; let index = $index) {
              <a
                clrVerticalNavLink
                [ngClass]="{ active: index == activeIndex }"
                href="javascript:void(0)"
                (click)="activeIndex = index"
              >
                @if (includeIcons) {
                  <cds-icon [shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
                }
                {{ navLink.text }}
              </a>
            }
          </clr-vertical-nav>
        </div>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<VerticalNavArgs>;

export const BasicNav: Story = {
  args: {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
};

export const NonCollapsibleWithIcons: Story = {
  args: {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
};

export const CollapsibleWithIcons: Story = {
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
};

export const Expanded: Story = {
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
};

export const Collapsed: Story = {
  args: {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
};
