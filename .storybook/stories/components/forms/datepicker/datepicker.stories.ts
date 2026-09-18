/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule, ClrFormsModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * `ClrDateInput` cannot be the args base: it aliases its input and output (`@Input('clrDate') set date`,
 * `@Output('clrDateChange') dateChange`), and `showActionButtons` belongs to the container rather than the
 * input. The method names below are not args either -- they exist so the `argTypes` entries that hide
 * their generated docs rows stay type-checked -- and `getProviderFromContainer` is `protected`, so they
 * cannot be picked off the class.
 */
type DatepickerArgs = {
  clrDate: Date | number | string;
  min: Date | number | string;
  max: Date | number | string;
  disabled: boolean;
  placeholder: string;
  id: string;
  showActionButtons: boolean;
  clrDateChange: (date: Date) => void;
  getDateObject: (date: Date | number | string) => Date;
  getDateString: (date: Date | number | string) => string;
  // `argTypes`-only: `ClrDateInput` methods whose generated docs rows are hidden
  onValueChange: never;
  setFocusStates: never;
  triggerValidation: never;
  getProviderFromContainer: never;
};

const meta: Meta<DatepickerArgs> = {
  title: 'Datepicker/Datepicker',
  component: ClrDateInput,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrFormsModule, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    // outputs
    clrDateChange: { control: { disable: true } },
    // methods
    ...hideControls('onValueChange', 'setFocusStates', 'triggerValidation', 'getProviderFromContainer'),
    // story helpers
    ...hideControls('getDateObject', 'getDateString'),
  },
  args: {
    // inputs
    disabled: false,
    placeholder: '',
    id: '',
    showActionButtons: false,
    // outputs
    clrDateChange: action('clrDateChange'),
    // story helpers
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
  render: args => ({
    template: `
      <clr-date-container [showActionButtons]="showActionButtons">
        <label>Date</label>
        <input
          #date
          type="date"
          [id]="id"
          [(clrDate)]="clrDate"
          [min]="getDateString(min)"
          [max]="getDateString(max)"
          [disabled]="disabled"
          [placeholder]="placeholder"
          (clrDateChange)="clrDateChange($event)"
          autocomplete="off"
        />
      </clr-date-container>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<DatepickerArgs>;

export const Datepicker: Story = {};

export const DefaultDate: Story = {
  args: {
    clrDate: '2025-01-01 00:00:00.000',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const MinDate: Story = {
  args: {
    min: Date.now() - 2592000000,
  },
};

export const MaxDate: Story = {
  args: {
    max: Date.now() + 2592000000,
  },
};

export const ActionButtons: Story = {
  args: {
    showActionButtons: true,
  },
};
