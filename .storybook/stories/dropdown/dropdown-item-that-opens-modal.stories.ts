/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdownModule, ClrModalModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
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
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Dropdown/Dropdown Item That Opens Modal',
  args: {
    clrCloseMenuOnItemClick: true,
  },
};

setupStorybook([ClrModalModule, ClrDropdownModule], defaultStory, defaultParameters);
