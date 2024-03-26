/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule, ClrModalModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Dropdown/Dropdown With Modal',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule, ClrModalModule],
    }),
  ],
  component: ClrDropdown,
  argTypes: {
    clrCloseMenuOnItemClick: { defaultValue: true, control: { type: 'boolean' } },
  },
  args: {
    clrCloseMenuOnItemClick: true,
  },
};

const DropdownModalTemplate: Story = args => ({
  template: `
    <div style="margin-bottom:100px;">
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
        <div class="modal-body">
          This is a modal.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
        </div>
      </clr-modal>
    </div>  
  `,
  props: args,
});

export const DropdownWithModal: StoryObj = {
  render: DropdownModalTemplate,
  args: {
    clrCloseMenuOnItemClick: true,
  },
};
