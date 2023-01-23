/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComboboxModule, ClrDropdownModule, ClrModalModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { elements } from 'helpers/elements.data';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const story: Story = args => ({
  template: `
    <div><strong>This story is NOT an endorsement of this UX pattern.</strong></div>

    <button type="button" class="btn btn-primary" (click)="modal1Open = true">Open Modal 1</button>

    <clr-modal [(clrModalOpen)]="modal1Open">
      <h3 class="modal-title">Modal 1</h3>
      <div class="modal-body">
        This is modal 1.

        <button type="button" class="btn btn-primary" (click)="modal2Open = true">Open Modal 2</button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="modal1Open = false">Close</button>
      </div>
    </clr-modal>

    <clr-modal [(clrModalOpen)]="modal2Open">
      <h3 class="modal-title">Modal 2</h3>
      <div class="modal-body">
        This is modal 2. Pressing escape should only close this modal, not both.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="modal2Open = false">Close</button>
      </div>
    </clr-modal>
  `,
  props: { ...args },
});

const parameters: Parameters = {
  title: 'Modal/Stacked Modal',
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
  },
};

setupStorybook([ClrModalModule, ClrComboboxModule, ClrDropdownModule], story, parameters);
