/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDateContainer, ClrDatepickerModule, ClrFormsModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * The exception to Clarity's aliasing: `ClrDateContainer` declares both of these inputs under their own
 * names (`@Input('clrPosition') set clrPosition`, `@Input('showActionButtons') set showActionButtons`), so
 * the component class is the args type, and the two `argTypes`-only method names come with it.
 */
type DateContainerArgs = ClrDateContainer;

const meta: Meta<DateContainerArgs> = {
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
    ...hideControls('addGrid', 'controlClass'),
  },
  args: {
    // inputs
    clrPosition: 'bottom-left',
    showActionButtons: false,
  },
  render: args => ({
    template: `
      <div style="margin-top: 300px; display: flex; justify-content: center">
        <clr-date-container [showActionButtons]="showActionButtons" [clrPosition]="clrPosition">
          <label>Date</label>
          <input type="date" autocomplete="off" clrDate />
        </clr-date-container>
      </div>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<DateContainerArgs>;

export const DateContainer: Story = {};
