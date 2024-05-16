/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatepickerModule, ClrDateRangeEndInput, ClrDateRangeStartInput } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Datepicker/DateRangepicker',
  component: ClrDateRangeStartInput,
  subcomponents: { ClrDateRangeEndInput },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // inputs
    clrRangeStartDate: { control: { type: 'date' } },
    clrRangeEndDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    disabled: { control: { type: 'boolean' } },
    // outputs
    clrRangeStartDateChange: { control: { disable: true } },
    clrRangeEndDateChange: { control: { disable: true } },
    // methods
    onValueChange: { control: { disable: true }, table: { disable: true } },
    setFocusStates: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    // story helpers
    getDateObject: { control: { disable: true }, table: { disable: true } },
    getDateString: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    disabled: false,
    dateFormat: 'MM-dd-yyyy',
    placeholder: '',
    id: '',
    // outputs
    clrRangeStartDateChange: action('clrRangeStartDateChange'),
    clrRangeEndDateChange: action('clrRangeEndDateChange'),
    // story helpers
    getDateObject: (date, dateFormat) => {
      if (date && dateFormat) {
        const DELIMITERS_REGEX = /[-\\/.\s]/;
        const dateArr = date.split(DELIMITERS_REGEX);
        const formatArr = dateFormat.split(DELIMITERS_REGEX);
        if (dateArr?.length && dateArr?.length < 3) {
          const monthIdx = formatArr.findIndex(a => /m+/i.test(a)),
            yearIdx = formatArr.findIndex(a => /y+/i.test(a)),
            dateIdx = formatArr.findIndex(a => /d+/i.test(a));
          const day = dateIdx > -1 ? dateArr[dateIdx] : 1,
            year = yearIdx > -1 ? dateArr[yearIdx] : 2024;
          let month = monthIdx > -1 ? dateArr[monthIdx] : 1;

          if (monthIdx > -1 && isNaN(dateArr[monthIdx])) {
            month = new Date(`${dateArr[monthIdx]} 01 2024`).toLocaleDateString(`en`, { month: `2-digit` });
          }

          return new Date(year, month - 1, day);
        }
      }
      return date && new Date(date).toISOString();
    },
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
};

const DateRangePickerTemplate: StoryFn = args => ({
  template: `
    <clr-date-range-container [min]="getDateString(min)" [max]="getDateString(max)" [dateFormat]="dateFormat">
      <label for="dateRangeCtrl">Date Range</label>
      <input
        #startDate
        id="startDate"
        aria-labelledby="dateRangeCtrl"
        name="startDate"
        type="date"
        [disabled]="disabled"
        [clrRangeStartDate]="getDateObject(clrRangeStartDate || startDate.value, dateFormat)"
        (clrRangeStartDateChange)="clrRangeStartDateChange($event)"
      />
      <input
        #endDate
        id="endDate"
        aria-labelledby="dateRangeCtrl"
        name="endDate"
        type="date"
        [disabled]="disabled"
        [clrRangeEndDate]="getDateObject(clrRangeEndDate || endDate.value, dateFormat)"
        (clrRangeEndDateChange)="clrRangeEndDateChange($event)"
      />
    </clr-date-range-container>
  `,
  props: { ...args },
});

export const DateRangePicker: StoryObj = {
  render: DateRangePickerTemplate,
};

export const DefaultDate: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    clrRangeStartDate: Date.now() - 2592000000,
    clrRangeEndDate: Date.now() + 2592000000,
  },
};

export const Disabled: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    disabled: true,
  },
};

export const MinDate: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    min: Date.now() - 2592000000,
  },
};

export const MaxDate: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    max: Date.now() + 2592000000,
  },
};

export const MonthPicker: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    dateFormat: 'yyyy/MM',
  },
};
