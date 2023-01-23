/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-date-container>
      <label>Date</label>
      <input #date
        type="date"
        [id]="id"
        [clrDate]="getDateObject(clrDate || date.value)"
        [min]="getDateString(min)"
        [max]="getDateString(max)"
        [disabled]="disabled"
        [placeholder]="placeholder"
        (clrDateChange)="clrDateChange($event)"
      />
    </clr-date-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Datepicker/Datepicker',
  component: ClrDateInput,
  argTypes: {
    // inputs
    clrDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    disabled: { defaultValue: false, control: { type: 'boolean' } },
    placeholder: { defaultValue: '' },
    id: { defaultValue: '' },
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
    // outputs
    clrDateChange: action('clrDateChange'),
    // story helpers
    getDateObject: date => new Date(date),
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
};

const variants: Parameters[] = [
  {
    disabled: false,
  },
  {
    disabled: true,
  },
  {
    disabled: false,
    clrDate: 1641038400000,
  },
  {
    disabled: true,
    clrDate: 1641038400000,
  },
];

setupStorybook(ClrDatepickerModule, defaultStory, defaultParameters, variants);
