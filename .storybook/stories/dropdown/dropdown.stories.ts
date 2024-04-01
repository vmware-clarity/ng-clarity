/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const DROPDOWN_BUTTON_TYPE: string[] = ['btn-primary', 'btn-outline-primary', 'btn-link'];

export default {
  title: 'Dropdown/Dropdown',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdown,
  argTypes: {
    open: { control: { type: 'boolean' } },
    clrCloseMenuOnItemClick: { control: { type: 'boolean' } },
    iconButton: { control: { type: 'boolean' } },
    buttonType: { control: 'radio', options: DROPDOWN_BUTTON_TYPE },
    DROPDOWN_BUTTON_TYPE: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    clrCloseMenuOnItemClick: true,
    iconButton: false,
    buttonType: 'btn-primary',
    DROPDOWN_BUTTON_TYPE,
    open: false,
  },
};

const DropdownTemplate: StoryFn = args => ({
  template: `
    <div style="margin-bottom: 200px">
      <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
        <button [ngClass]="iconButton ? '' : 'btn ' + buttonType" clrDropdownTrigger>
          <span *ngIf="!iconButton">Dropdown</span>
          <cds-icon *ngIf="iconButton" shape="exclamation-circle" class="is-error" size="24"></cds-icon>
          <cds-icon shape="angle" direction="down"></cds-icon>
        </button>
        <clr-dropdown-menu *clrIfOpen="open">
          <div aria-label="Action 1" clrDropdownItem>Action 1</div>
          <div aria-label="Action 2" clrDropdownItem>Action 2</div>
          <div aria-label="Action 3" clrDropdownItem>Action 3</div>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  `,
  props: args,
});

export const Dropdown: StoryObj = {
  render: DropdownTemplate,
};

export const OutlineButton: StoryObj = {
  render: DropdownTemplate,
  args: { buttonType: 'btn-outline-primary' },
};

export const LinkButton: StoryObj = {
  render: DropdownTemplate,
  args: { buttonType: 'btn-link' },
};

export const IconButton: StoryObj = {
  render: DropdownTemplate,
  args: { iconButton: true },
};
