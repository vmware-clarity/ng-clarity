/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatepickerModule, ClrEndDateInput, ClrStartDateInput } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * Neither `ClrStartDateInput` nor `ClrEndDateInput` can be the args base: each aliases its input and output
 * (`@Input('clrStartDate')`, `@Output('clrStartDateChange') dateChange`). The method names below are not
 * args either -- they exist so the `argTypes` entries that hide their generated docs rows stay
 * type-checked -- and `getProviderFromContainer` is `protected`, so they cannot be picked off a class.
 */
type DateRangePickerArgs = {
  clrStartDate: Date | number | string;
  clrEndDate: Date | number | string;
  min: Date | number | string;
  max: Date | number | string;
  disabled: boolean;
  placeholder: string;
  id: string;
  clrStartDateChange: (date: Date) => void;
  clrEndDateChange: (date: Date) => void;
  getDateObject: (date: Date | number | string) => Date;
  getDateString: (date: Date | number | string) => string;
  predefinedDateRanges: { label: string; value: Date[] }[];
  // `argTypes`-only: date-input methods whose generated docs rows are hidden
  onValueChange: never;
  setFocusStates: never;
  triggerValidation: never;
  getProviderFromContainer: never;
};

const predefinedDateRanges = [
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'Last 7 Days', value: [addDays(new Date(), -7), addDays(new Date(), -1)] },
  { label: 'Last 14 Days', value: [addDays(new Date(), -14), addDays(new Date(), -1)] },
  { label: 'Last 30 Days', value: [addDays(new Date(), -30), addDays(new Date(), -1)] },
  { label: 'Last 90 Days', value: [addDays(new Date(), -90), addDays(new Date(), -1)] },
];

const meta: Meta<DateRangePickerArgs> = {
  title: 'Components/Forms/Datepicker/Daterangepicker',
  component: ClrStartDateInput,
  subcomponents: { ClrEndDateInput },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // inputs
    clrStartDate: { control: { type: 'date' } },
    clrEndDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    disabled: { control: { type: 'boolean' } },
    // outputs
    clrStartDateChange: { control: { disable: true } },
    clrEndDateChange: { control: { disable: true } },
    // methods
    ...hideControls('onValueChange', 'setFocusStates', 'triggerValidation', 'getProviderFromContainer'),
    // story helpers
    ...hideControls('getDateObject', 'getDateString'),
    predefinedDateRanges: { control: { type: 'object' } },
  },
  args: {
    disabled: false,
    placeholder: '',
    id: '',
    // outputs
    clrStartDateChange: action('clrStartDateChange'),
    clrEndDateChange: action('clrEndDateChange'),
    // story helpers
    getDateObject: date => date && new Date(date),
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
    predefinedDateRanges: [],
  },
  render: args => ({
    template: `
      <clr-date-range-container
        [min]="getDateString(min)"
        [max]="getDateString(max)"
        [rangeOptions]="predefinedDateRanges"
      >
        <label for="dateRangeCtrl">Date Range</label>
        <input
          id="startDate"
          aria-labelledby="dateRangeCtrl"
          name="startDate"
          type="date"
          [disabled]="disabled"
          [clrStartDate]="getDateObject(clrStartDate)"
          (clrStartDateChange)="clrStartDateChange($event)"
        />
        <input
          id="endDate"
          aria-labelledby="dateRangeCtrl"
          name="endDate"
          type="date"
          [disabled]="disabled"
          [clrEndDate]="getDateObject(clrEndDate)"
          (clrEndDateChange)="clrEndDateChange($event)"
        />
      </clr-date-range-container>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<DateRangePickerArgs>;

export const DateRangePicker: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const PredefinedDateRanges: Story = {
  args: {
    predefinedDateRanges,
  },
};

function addDays(date = new Date(), days: number) {
  return new Date(date.getTime() + 86400000 * days);
}
