/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule, ClrEndDateInput, ClrFormsModule, ClrStartDateInput } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

// To keep visual tests stable we need to set static date that is not changing each day because
// that will create visual difference in PRs.
const staticDate = '03/22/2025';
const staticStartDate = '03/15/2025';
const staticEndDate = '03/23/2025';

export default {
  title: 'Datepicker/Opened',
  component: ClrDateInput,
  subcomponents: { ClrStartDateInput, ClrEndDateInput },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrFormsModule, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // Datepicker inputs
    clrDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    disabled: { control: { type: 'boolean' } },
    // DateRangePicker inputs
    clrStartDate: { control: { type: 'date' } },
    clrEndDate: { control: { type: 'date' } },
    predefinedDateRanges: { control: { type: 'object' } },
    // outputs
    clrDateChange: { control: { disable: true } },
    clrStartDateChange: { control: { disable: true } },
    clrEndDateChange: { control: { disable: true } },
    // methods
    onValueChange: { control: { disable: true }, table: { disable: true } },
    setFocusStates: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    // story helpers
    getDateString: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // Datepicker args
    disabled: false,
    placeholder: '',
    clrDate: staticDate,
    id: '',
    showActionButtons: false,
    // DateRangePicker args
    clrStartDate: '',
    clrEndDate: '',
    predefinedDateRanges: [],
    // outputs
    clrDateChange: action('clrDateChange'),
    clrStartDateChange: action('clrStartDateChange'),
    clrEndDateChange: action('clrEndDateChange'),
    // story helpers
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('button.clr-smart-open-close') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.day-btn.is-today') as HTMLElement)?.classList.remove('is-today');
    (canvasElement.parentElement.querySelector('button:not(.is-excluded).day-btn') as HTMLElement)?.classList.add(
      'is-today'
    );
  },
};

const DatePickerTemplate: StoryFn = args => ({
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
});

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
        [(clrStartDate)]="clrStartDate"
        (clrStartDateChange)="clrStartDateChange($event)"
      />
      <input
        id="endDate"
        aria-labelledby="dateRangeCtrl"
        name="endDate"
        type="date"
        [disabled]="disabled"
        [(clrEndDate)]="clrEndDate"
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

export const Datepicker: StoryObj = {
  render: DatePickerTemplate,
};

export const DefaultDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    clrDate: '2025-01-01 00:00:00.000',
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
    min: new Date(staticStartDate),
  },
};

export const MaxDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    max: new Date(staticEndDate),
  },
};

export const ActionButtons: StoryObj = {
  render: DatePickerTemplate,
  args: {
    showActionButtons: true,
  },
};

export const MonthView: StoryObj = {
  render: DatePickerTemplate,
  play({ canvasElement }) {
    (canvasElement.querySelector('button.clr-smart-open-close') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.monthpicker-trigger') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.calendar-btn.month.is-today') as HTMLElement)?.classList.remove(
      'is-today'
    );
    (canvasElement.parentElement.querySelector('button.calendar-btn.month') as HTMLElement)?.classList.add('is-today');
  },
};

export const YearView: StoryObj = {
  render: DatePickerTemplate,
  play({ canvasElement }) {
    (canvasElement.querySelector('button.clr-smart-open-close') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.yearpicker-trigger') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.calendar-btn.year.is-today') as HTMLElement)?.classList.remove(
      'is-today'
    );
    (canvasElement.parentElement.querySelector('button.calendar-btn.year') as HTMLElement)?.classList.add('is-today');
  },
};

export const PredefinedDateRangesOpen: StoryObj = {
  render: DateRangePickerTemplate,
  args: {
    predefinedDateRanges,
    clrStartDate: staticStartDate,
    clrEndDate: staticEndDate,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('button.clr-smart-open-close') as HTMLElement)?.click();
    (canvasElement.parentElement.querySelector('button.day-btn.is-today') as HTMLElement)?.classList.remove('is-today');
    (canvasElement.parentElement.querySelector('button:not(.is-excluded).day-btn') as HTMLElement)?.classList.add(
      'is-today'
    );
  },
};

function addDays(date = new Date(), days: number) {
  return new Date(date.getTime() + 86400000 * days);
}
