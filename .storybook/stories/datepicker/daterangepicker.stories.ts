/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrAlertModule,
  ClrDatepickerModule,
  ClrDateRangeEndInput,
  ClrDateRangeStartInput,
  ClrFormsModule,
} from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Datepicker/DateRangepicker (do not use)',
  component: ClrDateRangeStartInput,
  subcomponents: { ClrDateRangeEndInput },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAlertModule, ClrFormsModule, ClrDatepickerModule],
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
    placeholder: '',
    id: '',
    // outputs
    clrRangeStartDateChange: action('clrRangeStartDateChange'),
    clrRangeEndDateChange: action('clrRangeEndDateChange'),
    // story helpers
    getDateObject: date => {
      try {
        return date && new Date(date).toISOString();
      } catch {
        return undefined;
      }
    },
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
};

const DateRangePickerTemplate: StoryFn = args => ({
  template: `
    <clr-alert [clrAlertType]="'danger'" [clrAlertClosable]="false">
      <clr-alert-item>
        <span class="alert-text">
          This is component is not ready for external use! It may change in breaking ways in future releases. Do not use!
        </span>
      </clr-alert-item>
    </clr-alert>

    <clr-date-range-container [min]="getDateString(min)" [max]="getDateString(max)">
      <label for="dateRangeCtrl">Date Range</label>
      <input
        #startDate
        id="startDate"
        aria-labelledby="dateRangeCtrl"
        name="startDate"
        type="date"
        [disabled]="disabled"
        [clrRangeStartDate]="getDateObject(clrRangeStartDate || startDate.value)"
        (clrRangeStartDateChange)="clrRangeStartDateChange($event)"
      />
      <input
        #endDate
        id="endDate"
        aria-labelledby="dateRangeCtrl"
        name="endDate"
        type="date"
        [disabled]="disabled"
        [clrRangeEndDate]="getDateObject(clrRangeEndDate || endDate.value)"
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
    clrRangeStartDate: '2024-06-22 00:00:00.000',
    clrRangeEndDate: '2024-08-21 00:00:00.000',
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
