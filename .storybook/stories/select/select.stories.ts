/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelect, ClrSelectModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: ` 
    <clr-select-container>
      <label>Options</label>
      <select clrSelect>
        <option
          *ngFor="let _ of createArray(optionCount); let i = index"
          [value]="i + 1"
        >
          Option {{i + 1}}
        </option>
      </select>
    </clr-select-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Select/Select',
  component: ClrSelect,
  argTypes: {
    // inputs
    id: { defaultValue: '' },
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    optionCount: 3,
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrSelectModule, defaultStory, defaultParameters, variants);
