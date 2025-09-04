/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDateContainer, ClrDatepickerModule, ClrFormsModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Datepicker/DateContainer',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrFormsModule, ClrDatepickerModule],
    }),
  ],
  component: ClrDateContainer,
  argTypes: {
    // inputs
    clrPosition: { control: { type: 'radio' }, options: CLR_MENU_POSITIONS },
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrPosition: 'bottom-left',
    showActionButtons: false,
  },
};

const DatePickerTemplate: StoryFn = args => ({
  template: `
    <div style="margin-top: 300px; display: flex; justify-content: center">
      <clr-date-container [showActionButtons]="showActionButtons" [clrPosition]="clrPosition">
        <label>Date</label>
        <input type="date" autocomplete="off" clrDate />
      </clr-date-container>
    </div>
  `,
  props: { ...args },
});

export const DateContainer: StoryObj = {
  render: DatePickerTemplate,
};
