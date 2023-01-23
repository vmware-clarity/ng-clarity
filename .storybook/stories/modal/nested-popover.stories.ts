/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComboboxModule, ClrDropdownModule, ClrModalModule, ClrSignpostModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { elements } from 'helpers/elements.data';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const story: Story = args => ({
  template: `
    <button type="button" class="btn btn-primary" (click)="modalOpen = true">Open Modal</button>

    <clr-modal [(clrModalOpen)]="modalOpen">
      <h3 class="modal-title">Modal Title</h3>
      <div class="modal-body">
        Pressing escape on a nested popover should not close the modal.
        <br />

        <clr-dropdown>
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu>
            <div aria-label="Action 1" clrDropdownItem>Action 1</div>
            <div aria-label="Action 2" clrDropdownItem>Action 2</div>
            <div aria-label="Action 3" clrDropdownItem>Action 3</div>
          </clr-dropdown-menu>
        </clr-dropdown>
        <br />

        <clr-combobox>
          <ng-container *clrOptionSelected="let selected">
            {{selected}}
          </ng-container>
          <clr-options>
            <clr-option *ngFor="let element of elements" [clrValue]="element.symbol">{{element.name}}</clr-option>
          </clr-options>
        </clr-combobox>
        <br />

        <clr-signpost>
          <clr-signpost-content>
            This is a signpost.
          </clr-signpost-content>
        </clr-signpost>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
      </div>
    </clr-modal>
  `,
  props: { ...args },
});

const parameters: Parameters = {
  title: 'Modal/Nested Popover',
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
  },
};

setupStorybook([ClrModalModule, ClrComboboxModule, ClrDropdownModule, ClrSignpostModule], story, parameters);
