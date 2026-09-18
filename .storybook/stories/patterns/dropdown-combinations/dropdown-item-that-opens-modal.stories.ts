/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule, ClrModalModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrDropdown` declares its input as `@Input('clrCloseMenuOnItemClick') isMenuClosable`, so
 * `clrCloseMenuOnItemClick` is not a property of the class and the single arg is declared here.
 */
type DropdownWithModalArgs = {
  clrCloseMenuOnItemClick: boolean;
};

const meta: Meta<DropdownWithModalArgs> = {
  title: 'Patterns/Dropdown Combinations/Dropdown Item That Opens Modal',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule, ClrModalModule],
    }),
  ],
  component: ClrDropdown,
  args: {
    clrCloseMenuOnItemClick: true,
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
  render: args => ({
    template: `
      <div style="margin-bottom: 100px">
        <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu>
            <div clrDropdownItem (click)="modalOpen = true">Open Modal</div>
            <div clrDropdownItem>Do Nothing</div>
            <clr-dropdown>
              <button clrDropdownTrigger>Nested Trigger</button>
              <clr-dropdown-menu>
                <div clrDropdownItem (click)="modalOpen = true">Open Modal</div>
                <div clrDropdownItem>Do Nothing</div>
              </clr-dropdown-menu>
            </clr-dropdown>
          </clr-dropdown-menu>
        </clr-dropdown>

        <clr-modal [(clrModalOpen)]="modalOpen">
          <h3 class="modal-title">Modal</h3>
          <div class="modal-body">This is a modal.</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
          </div>
        </clr-modal>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<DropdownWithModalArgs>;

export const DropdownWithModal: Story = {
  args: {
    clrCloseMenuOnItemClick: true,
  },
};
