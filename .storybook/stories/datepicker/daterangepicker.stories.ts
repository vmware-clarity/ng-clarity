/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatepickerModule, ClrEndDateInput, ClrStartDateInput } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CommonModules } from '../../../.storybook/helpers/common';

export default {
  title: 'Datepicker/DateRangepicker',
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
    onValueChange: { control: { disable: true }, table: { disable: true } },
    setFocusStates: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    // story helpers
    getDateObject: { control: { disable: true }, table: { disable: true } },
    getDateString: { control: { disable: true }, table: { disable: true } },
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
};

const DateRangePickerTemplate: StoryFn = args => ({
  template: `
    <clr-date-range-container [min]="getDateString(min)" [max]="getDateString(max)" [rangeOptions]="predefinedDateRanges">
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
});

const predefinedDateRanges = [
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'Last 7 Days', value: [addDays(new Date(), -7), addDays(new Date(), -1)] },
  { label: 'Last 14 Days', value: [addDays(new Date(), -14), addDays(new Date(), -1)] },
  { label: 'Last 30 Days', value: [addDays(new Date(), -30), addDays(new Date(), -1)] },
  { label: 'Last 90 Days', value: [addDays(new Date(), -90), addDays(new Date(), -1)] },
];

export const DateRangePicker: StoryObj = {
  render: DateRangePickerTemplate,
};

export const Disabled: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    disabled: true,
  },
};

export const PredefinedDateRanges: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    predefinedDateRanges,
  },
};

function addDays(date = new Date(), days: number) {
  return new Date(date.getTime() + 86400000 * days);
}
