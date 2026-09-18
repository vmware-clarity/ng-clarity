/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrDropdown` declares its input as `@Input('clrCloseMenuOnItemClick') isMenuClosable`, so
 * `clrCloseMenuOnItemClick` is not a property of the class and the args are declared here.
 */
type DropdownArgs = {
  open: boolean;
  clrCloseMenuOnItemClick: boolean;
  iconButton: boolean;
  buttonType: string;
  DROPDOWN_BUTTON_TYPE: string[];
};

const DROPDOWN_BUTTON_TYPE: string[] = ['btn-primary', 'btn-outline-primary', 'btn-link'];

const meta: Meta<DropdownArgs> = {
  title: 'Dropdown/Dropdown',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdown,
  argTypes: {
    buttonType: { control: { type: 'radio' }, options: DROPDOWN_BUTTON_TYPE },
    ...hideControls('DROPDOWN_BUTTON_TYPE'),
  },
  args: {
    open: false,
    clrCloseMenuOnItemClick: true,
    iconButton: false,
    buttonType: 'btn-primary',
    DROPDOWN_BUTTON_TYPE,
  },
  render: args => ({
    template: `
      <div style="margin-bottom: 200px">
        <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
          <button [ngClass]="iconButton ? '' : 'btn ' + buttonType" clrDropdownTrigger>
            @if (!iconButton) {
              <span>Dropdown</span>
            }
            @if (iconButton) {
              <cds-icon shape="exclamation-circle" class="is-error" size="24"></cds-icon>
            }
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
  }),
};

export default meta;

type Story = StoryObj<DropdownArgs>;

export const Dropdown: Story = {};

export const OutlineButton: Story = {
  args: { buttonType: 'btn-outline-primary' },
};

export const LinkButton: Story = {
  args: { buttonType: 'btn-link' },
};

export const IconButton: Story = {
  args: { iconButton: true },
};
