/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
    buttonType: { control: { type: 'radio' }, options: DROPDOWN_BUTTON_TYPE },
    DROPDOWN_BUTTON_TYPE: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    open: false,
    clrCloseMenuOnItemClick: true,
    iconButton: false,
    buttonType: 'btn-primary',
    DROPDOWN_BUTTON_TYPE,
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
