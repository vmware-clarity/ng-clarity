/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatepickerModule, ClrEndDateInput, ClrStartDateInput } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

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
  },
};

const DateRangePickerTemplate: StoryFn = args => ({
  template: `
    <clr-date-range-container [min]="getDateString(min)" [max]="getDateString(max)">
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

export const DateRangePicker: StoryObj = {
  render: DateRangePickerTemplate,
};

export const Disabled: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    disabled: true,
  },
};
