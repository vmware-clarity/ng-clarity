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

/**
 * `navLinks` is the only real arg; the `clr*` names exist so the hidden `argTypes` entries stay
 * type-checked. They cannot come from `ClrVerticalNav` itself, which aliases every input
 * (`@Input('clrVerticalNavCollapsed') get collapsed()`), so only the `toggleByButton` method is picked
 * off the component.
 */
type VerticalNavHeaderAndDividerArgs = Pick<ClrVerticalNav, 'toggleByButton'> & {
  clrVerticalNavCollapsible: boolean;
  clrVerticalNavCollapsed: boolean;
  clrVerticalNavCollapsedChange: (collapsed: boolean) => void;
  navLinks: { iconShapeTuple: IconShapeTuple; text: string }[];
};

const navLinks: { iconShapeTuple: IconShapeTuple; text: string }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications' },
  { iconShapeTuple: homeIcon, text: 'Dashboard' },
  { iconShapeTuple: searchIcon, text: 'Search' },
  { iconShapeTuple: calendarIcon, text: 'Calendar' },
  { iconShapeTuple: folderIcon, text: 'Files' },
  { iconShapeTuple: userIcon, text: 'Profile' },
];

const meta: Meta<VerticalNavHeaderAndDividerArgs> = {
  title: 'Components/Navigation/Vertical Nav/Header and Divider',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrVerticalNavModule],
    }),
  ],
  component: ClrVerticalNav,
  argTypes: {
    ...hideControls('clrVerticalNavCollapsible', 'clrVerticalNavCollapsed'),
    // outputs
    ...hideControls('clrVerticalNavCollapsedChange'),
    // methods
    ...hideControls('toggleByButton'),
    // story helpers
    ...hideControls('navLinks'),
  },
  args: {
    // story helpers
    navLinks,
  },
  render: args => ({
    template: `
      <div class="content-container">
        <clr-vertical-nav>
          <label class="nav-header">First</label>
          @for (navLink of navLinks; track navLink) {
            <a clrVerticalNavLink href="javascript:void(0)">
              {{ navLink.text }}
            </a>
          }

          <div class="nav-divider"></div>

          <label class="nav-header">Second</label>
          @for (navLink of navLinks; track navLink) {
            <a clrVerticalNavLink href="javascript:void(0)">
              {{ navLink.text }}
            </a>
          }
        </clr-vertical-nav>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<VerticalNavHeaderAndDividerArgs>;

export const NavHeaderAndDivider: Story = {};
