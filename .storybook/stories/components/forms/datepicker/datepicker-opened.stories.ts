/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule, ClrEndDateInput, ClrFormsModule, ClrStartDateInput } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * None of `ClrDateInput`, `ClrStartDateInput` or `ClrEndDateInput` can be the args base: each aliases its
 * input and output (`@Input('clrStartDate')`, `@Output('clrStartDateChange') dateChange`). The method names
 * below are not args either -- they exist so the `argTypes` entries that hide their generated docs rows
 * stay type-checked -- and `getProviderFromContainer` is `protected`, so they cannot be picked off a class.
 */
type DatepickerOpenedArgs = {
  clrDate: Date | number | string;
  min: Date | number | string;
  max: Date | number | string;
  disabled: boolean;
  placeholder: string;
  id: string;
  showActionButtons: boolean;
  clrStartDate: Date | number | string;
  clrEndDate: Date | number | string;
  predefinedDateRanges: { label: string; value: Date[] }[];
  clrDateChange: (date: Date) => void;
  clrStartDateChange: (date: Date) => void;
  clrEndDateChange: (date: Date) => void;
  getDateString: (date: Date | number | string) => string;
  // `argTypes`-only: `ClrDateInput` methods whose generated docs rows are hidden
  onValueChange: never;
  setFocusStates: never;
  triggerValidation: never;
  getProviderFromContainer: never;
};

// To keep visual tests stable we need to set static date that is not changing each day because
// that will create visual difference in PRs.
const staticDate = '03/22/2025';
const staticStartDate = '03/15/2025';
const staticEndDate = '03/23/2025';

const predefinedDateRanges = [
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'Last 7 Days', value: [addDays(new Date(), -7), addDays(new Date(), -1)] },
  { label: 'Last 14 Days', value: [addDays(new Date(), -14), addDays(new Date(), -1)] },
  { label: 'Last 30 Days', value: [addDays(new Date(), -30), addDays(new Date(), -1)] },
  { label: 'Last 90 Days', value: [addDays(new Date(), -90), addDays(new Date(), -1)] },
];

const meta: Meta<DatepickerOpenedArgs> = {
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
    ...hideControls('onValueChange', 'setFocusStates', 'triggerValidation', 'getProviderFromContainer'),
    // story helpers
    ...hideControls('getDateString'),
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
  play: async ({ canvasElement, userEvent }) => {
    const smartOpenCloseButton = await canvasElement.querySelector('button.clr-smart-open-close');
    await userEvent.click(smartOpenCloseButton);
    (canvasElement.parentElement.querySelector('button.day-btn.is-today') as HTMLElement)?.classList.remove('is-today');
    (canvasElement.parentElement.querySelector('button:not(.is-excluded).day-btn') as HTMLElement)?.classList.add(
      'is-today'
    );
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

type Story = StoryObj<DatepickerOpenedArgs>;

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
    min: new Date(staticStartDate),
  },
};

export const MaxDate: Story = {
  args: {
    max: new Date(staticEndDate),
  },
};

export const ActionButtons: Story = {
  args: {
    showActionButtons: true,
  },
};

export const MonthView: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const smartOpenCloseButton = await canvasElement.querySelector('button.clr-smart-open-close');
    await userEvent.click(smartOpenCloseButton);
    const monthpickerTriggerButton = await canvasElement.parentElement.querySelector('button.monthpicker-trigger');
    await userEvent.click(monthpickerTriggerButton);
    (canvasElement.parentElement.querySelector('button.calendar-btn.month.is-today') as HTMLElement)?.classList.remove(
      'is-today'
    );
    (canvasElement.parentElement.querySelector('button.calendar-btn.month') as HTMLElement)?.classList.add('is-today');
  },
};

export const YearView: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const smartOpenCloseButton = await canvasElement.querySelector('button.clr-smart-open-close');
    await userEvent.click(smartOpenCloseButton);
    const yearpickerTriggerButton = await canvasElement.parentElement.querySelector('button.yearpicker-trigger');
    await userEvent.click(yearpickerTriggerButton);
    (canvasElement.parentElement.querySelector('button.calendar-btn.year.is-today') as HTMLElement)?.classList.remove(
      'is-today'
    );
    (canvasElement.parentElement.querySelector('button.calendar-btn.year') as HTMLElement)?.classList.add('is-today');
  },
};

export const PredefinedDateRangesOpen: Story = {
  // render-override: this story drives the two-input date *range* container, not the single date input
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
  }),
  args: {
    predefinedDateRanges,
    clrStartDate: staticStartDate,
    clrEndDate: staticEndDate,
  },
  play: async ({ canvasElement, userEvent }) => {
    const smartOpenCloseButton = await canvasElement.querySelector('button.clr-smart-open-close');
    await userEvent.click(smartOpenCloseButton);
    (canvasElement.parentElement.querySelector('button.day-btn.is-today') as HTMLElement)?.classList.remove('is-today');
    (canvasElement.parentElement.querySelector('button:not(.is-excluded).day-btn') as HTMLElement)?.classList.add(
      'is-today'
    );
  },
};

function addDays(date = new Date(), days: number) {
  return new Date(date.getTime() + 86400000 * days);
}
