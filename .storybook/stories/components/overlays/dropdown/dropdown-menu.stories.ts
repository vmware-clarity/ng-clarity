/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDropdownMenu, ClrDropdownModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrDropdownMenu` declares its input as `@Input('clrPosition') set position`, so `clrPosition` is not
 * a property of the class and the args are declared here. Everything below `clrPosition` is a
 * story-only prop the template reads through `props`.
 */
type DropdownMenuArgs = {
  clrPosition: string;
  truncateMenuItemText: boolean;
  menuHeader: string;
  menuItemText: string;
  showIcon: boolean;
  createArray: (n: number) => unknown[];
  menuCount: number;
  actionCount: number;
  CLR_MENU_POSITIONS: string[];
};

const meta: Meta<DropdownMenuArgs> = {
  title: 'Dropdown/Dropdown Menu',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdownMenu,
  argTypes: {
    // inputs
    clrPosition: { control: { type: 'radio' }, options: CLR_MENU_POSITIONS },
    // methods
    ...hideControls('anchor', 'release'),
    // story helpers
    ...hideControls('createArray'),
    truncateMenuItemText: { control: { type: 'boolean' } },
    menuHeader: { control: { type: 'text' } },
    menuItemText: { control: { type: 'text' } },
    menuCount: { control: { type: 'number', min: 1, max: 100 } },
    actionCount: { control: { type: 'number', min: 1, max: 100 } },
    ...hideControls('CLR_MENU_POSITIONS'),
  },
  args: {
    // inputs
    truncateMenuItemText: false,
    menuHeader: 'Menus',
    menuItemText: 'Menu',
    clrPosition: 'top-left',
    showIcon: false,
    // story helpers
    createArray: n => new Array(n),
    menuCount: 3,
    actionCount: 3,
    CLR_MENU_POSITIONS,
  },
  render: args => ({
    template: `
      <div style="margin: 200px; text-align: center">
        <clr-dropdown>
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu [clrPosition]="clrPosition" *clrIfOpen="true">
            <label class="dropdown-header" aria-hidden="true">{{ menuHeader }}</label>
            @for (_ of createArray(menuCount); track $index; let menuIndex = $index) {
              <clr-dropdown>
                <button clrDropdownTrigger>
                  @if (showIcon) {
                    <cds-icon shape="user"></cds-icon>
                  }
                  <div [attr.cds-text]="truncateMenuItemText ? 'truncate' : undefined">
                    {{ menuItemText }} {{ menuIndex + 1 }}
                  </div>
                </button>
                <clr-dropdown-menu>
                  <label class="dropdown-header" aria-hidden="true">
                    <div [attr.cds-text]="truncateMenuItemText ? 'truncate' : undefined">
                      {{ menuItemText }} {{ menuIndex + 1 }}
                    </div>
                    Actions
                  </label>
                  @for (_ of createArray(actionCount); track $index; let actionIndex = $index) {
                    <div [attr.aria-label]="'Action' + (actionIndex + 1)" clrDropdownItem>
                      @if (showIcon) {
                        <cds-icon shape="user"></cds-icon>
                      }
                      Action {{ menuIndex * actionCount + actionIndex + 1 }}
                    </div>
                  }
                </clr-dropdown-menu>
              </clr-dropdown>
            }
          </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<DropdownMenuArgs>;

export const DropdownMenu: Story = {};
export const DropdownMenuWithIcon: Story = {
  args: {
    showIcon: true,
  },
};
export const LongItemText: Story = {
  args: {
    menuItemText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  },
};
export const LongItemTextTruncated: Story = {
  args: {
    truncateMenuItemText: true,
    menuItemText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
  },
};

export const Showcase: Story = {
  // render-override: this story lays out one dropdown per menu position, which the meta template cannot express
  render: args => ({
    template: `
      @for (position of CLR_MENU_POSITIONS; track position) {
        <div style="display: inline-block">
          <div style="margin: 100px 65px">
            <clr-dropdown [clrCloseMenuOnItemClick]="false">
              <button class="btn btn-outline-primary" clrDropdownTrigger>
                {{ position }}
                <cds-icon shape="angle" direction="down"></cds-icon>
              </button>
              <clr-dropdown-menu [clrPosition]="position" *clrIfOpen="true">
                <label class="dropdown-header" aria-hidden="true">{{ menuHeader }}</label>
                @for (_ of createArray(menuCount); track $index; let menuIndex = $index) {
                  <clr-dropdown>
                    <button clrDropdownTrigger>{{ menuItemText }} {{ menuIndex + 1 }}</button>
                    <clr-dropdown-menu>
                      <label class="dropdown-header" aria-hidden="true">
                        {{ menuItemText }} {{ menuIndex + 1 }} Actions
                      </label>
                      @for (_ of createArray(actionCount); track $index; let actionIndex = $index) {
                        <div [attr.aria-label]="'Action' + (actionIndex + 1)" clrDropdownItem>
                          Action {{ menuIndex * actionCount + actionIndex + 1 }}
                        </div>
                      }
                    </clr-dropdown-menu>
                  </clr-dropdown>
                }
              </clr-dropdown-menu>
            </clr-dropdown>
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
  args: {
    menuCount: 2,
    actionCount: 2,
  },
};
