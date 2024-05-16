/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Datepicker/Datepicker',
  component: ClrDateInput,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    disabled: { control: { type: 'boolean' } },
    // outputs
    clrDateChange: { control: { disable: true } },
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
    clrDateChange: action('clrDateChange'),
    // story helpers
    getDateObject: (date, dateFormat) => {
      if (Object.prototype.toString.call(date) === '[object String]' && date && dateFormat) {
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
    getDateString: date => {
      return date && new Date(date).toISOString().split('T')[0];
    },
  },
};

const DatePickerTemplate: StoryFn = args => ({
  template: `
    <clr-date-container [dateFormat]="dateFormat">
      <label>Date</label>
      <input
        #date
        type="date"
        [id]="id"
        [clrDate]="getDateObject(clrDate || date.value, dateFormat)"
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
});

export const Datepicker: StoryObj = {
  render: DatePickerTemplate,
};

export const DefaultDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    clrDate: 1641038400000,
  },
};

export const Disabled: StoryObj = {
  render: DatePickerTemplate,
  args: {
    disabled: true,
  },
};

export const MinDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    min: Date.now() - 2592000000,
  },
};

export const MaxDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    max: Date.now() + 2592000000,
  },
};

export const DateFormat: StoryObj = {
  render: DatePickerTemplate,
  args: {
    dateFormat: 'yyyy-MM-dd',
  },
};

export const MonthPicker: StoryObj = {
  render: DatePickerTemplate,
  args: {
    dateFormat: 'MM/yyyy',
  },
};

export const YearPicker: StoryObj = {
  render: DatePickerTemplate,
  args: {
    dateFormat: 'yyyy',
  },
};
