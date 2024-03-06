/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDropdownMenu, ClrDropdownModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Dropdown/Dropdown Menu',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdownMenu,
  argTypes: {
    // inputs
    clrPosition: { defaultValue: 'top-left', control: { type: 'radio', options: CLR_MENU_POSITIONS } },
    // methods
    anchor: { control: { disable: true }, table: { disable: true } },
    release: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    menuCount: { control: { type: 'number', min: 1, max: 100 } },
    actionCount: { control: { type: 'number', min: 1, max: 100 } },
    CLR_MENU_POSITIONS: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    menuCount: 3,
    actionCount: 3,
    CLR_MENU_POSITIONS,
  },
};

const DropdownMenuTemplate: Story = args => ({
  template: `
    <div style="margin:200px; text-align: center">
      <clr-dropdown>
        <button class="btn btn-outline-primary" clrDropdownTrigger>
          Dropdown
          <cds-icon shape="angle" direction="down"></cds-icon>
        </button>
        <clr-dropdown-menu [clrPosition]="clrPosition" *clrIfOpen="true">
          <label class="dropdown-header" aria-hidden="true">Menus</label>
          <clr-dropdown
            *ngFor="let _ of createArray(menuCount); let menuIndex = index"
          >
            <button clrDropdownTrigger>Menu {{ menuIndex + 1 }}</button>
            <clr-dropdown-menu>
              <label class="dropdown-header" aria-hidden="true">
                Menu {{ menuIndex + 1 }} Actions
              </label>
              <div
                *ngFor="let _ of createArray(actionCount); let actionIndex = index"
                [attr.aria-label]="'Action' + (actionIndex + 1)"
                clrDropdownItem
              >
                Action {{ menuIndex * actionCount + actionIndex + 1 }}
              </div>
            </clr-dropdown-menu>
          </clr-dropdown>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  `,
  props: args,
});

const DropdownMenuAllTemplate: Story = args => ({
  template: `
    <div *ngFor="let position of CLR_MENU_POSITIONS" >
      <div style="margin:5px;">
        <h5>Position : {{position}}</h5>
      </div>
      <div style="margin:150px; text-align: center">
        <clr-dropdown [clrCloseMenuOnItemClick]="false">
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu [clrPosition]="position" *clrIfOpen="true">
          <label class="dropdown-header" aria-hidden="true">Menus</label>
          <clr-dropdown
            *ngFor="let _ of createArray(menuCount); let menuIndex = index"
          >
            <button clrDropdownTrigger>Menu {{ menuIndex + 1 }}</button>
            <clr-dropdown-menu>
              <label class="dropdown-header" aria-hidden="true">
                Menu {{ menuIndex + 1 }} Actions
              </label>
              <div
                *ngFor="let _ of createArray(actionCount); let actionIndex = index"
                [attr.aria-label]="'Action' + (actionIndex + 1)"
                clrDropdownItem
              >
                Action {{ menuIndex * actionCount + actionIndex + 1 }}
              </div>
            </clr-dropdown-menu>
          </clr-dropdown>
        </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    </div>
  `,
  props: args,
});

export const DropdownMenu: StoryObj = {
  render: DropdownMenuTemplate,
};

export const Showcase: StoryObj = {
  render: DropdownMenuAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
