/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDropdownMenu, ClrDropdownModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div style="margin-top: 200px; text-align: center">
      <clr-dropdown>
        <button class="btn btn-outline-primary" clrDropdownTrigger>
          Dropdown
          <cds-icon shape="angle" direction="down"></cds-icon>
        </button>
        <clr-dropdown-menu [clrPosition]="clrPosition">
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
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Dropdown/Dropdown Menu',
  component: ClrDropdownMenu,
  argTypes: {
    // inputs
    clrPosition: { defaultValue: 'bottom-left', control: { type: 'radio', options: CLR_MENU_POSITIONS } },
    // methods
    anchor: { control: { disable: true }, table: { disable: true } },
    release: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    menuCount: { control: { type: 'number', min: 1, max: 100 } },
    actionCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    menuCount: 3,
    actionCount: 3,
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrDropdownModule, defaultStory, defaultParameters, variants);
