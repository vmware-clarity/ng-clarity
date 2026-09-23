/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  bellIcon,
  calendarIcon,
  ClrVerticalNavGroup,
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
 * `ClrVerticalNavGroup` cannot be the args base: it declares its input as
 * `@Input('clrVerticalNavGroupExpanded') set userExpandedInput`, so `clrVerticalNavGroupExpanded` is not a
 * property of the class. The four methods are picked off the component only so the `argTypes` entries that
 * hide their docgen rows stay type-checked.
 */
type VerticalNavGroupArgs = Pick<
  ClrVerticalNavGroup,
  'collapseGroup' | 'expandAnimationDone' | 'expandGroup' | 'toggleExpand'
> & {
  clrVerticalNavGroupExpanded: boolean;
  clrVerticalNavGroupExpandedChange: (expanded: boolean) => void;
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

const meta: Meta<VerticalNavGroupArgs> = {
  title: 'Components/Navigation/Vertical Nav/Group',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNavGroup,
  argTypes: {
    // outputs
    clrVerticalNavGroupExpandedChange: { control: { disable: true } },
    // methods
    ...hideControls('collapseGroup', 'expandAnimationDone', 'expandGroup', 'toggleExpand'),
    // story helpers
    ...hideControls('navLinks'),
  },
  args: {
    // inputs
    clrVerticalNavGroupExpanded: false,
    // outputs
    clrVerticalNavGroupExpandedChange: action('clrVerticalNavGroupExpandedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
  render: args => ({
    template: `
      <div class="main-container">
        <div class="content-container">
          <clr-vertical-nav [clrVerticalNavCollapsible]="true">
            <clr-vertical-nav-group
              [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
              (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
            >
              @if (includeIcons) {
                <cds-icon shape="bars" clrVerticalNavIcon></cds-icon>
              }
              Menu
              <clr-vertical-nav-group-children>
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
              </clr-vertical-nav-group-children>
            </clr-vertical-nav-group>
          </clr-vertical-nav>
        </div>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<VerticalNavGroupArgs>;

export const NavGroupCollapsedWithIcons: Story = {
  args: {
    clrVerticalNavGroupExpanded: false,
    includeIcons: true,
  },
};

export const NavGroupExpandedWithIcons: Story = {
  args: {
    clrVerticalNavGroupExpanded: true,
    includeIcons: true,
  },
};

export const BasicNavGroupCollapsed: Story = {
  args: {
    clrVerticalNavGroupExpanded: false,
    includeIcons: false,
  },
};

export const BasicNavGroupExpanded: Story = {
  args: {
    clrVerticalNavGroupExpanded: true,
    includeIcons: false,
  },
};
