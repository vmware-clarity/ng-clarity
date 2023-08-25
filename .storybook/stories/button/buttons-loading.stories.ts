/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrButtonModule, ClrLoading, ClrLoadingModule, ClrLoadingState } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <h6>{{stateName}}</h6>
      <button [clrLoading]="validateState" class="btn btn-primary">Validate</button>
      <button [clrLoading]="submitState" type="submit" class="btn btn-success-outline">Submit</button>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Button/Buttons Loading States',
  component: ClrLoading,
  argTypes: {
    // inputs
    class: { control: { disable: true } },
    clrInMenu: { control: { disable: true }, table: { disable: true } },
    // outputs
    click: { control: { disable: true } },
    // methods
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    stateName: 'Default Buttons',
    validateState: ClrLoadingState.DEFAULT,
    submitState: ClrLoadingState.DEFAULT,
  },
};

const variants: Parameters[] = [
  {
    stateName: 'Default Buttons',
    validateState: ClrLoadingState.DEFAULT,
    submitState: ClrLoadingState.DEFAULT,
  },
  {
    stateName: 'Loading Buttons',
    validateState: ClrLoadingState.LOADING,
    submitState: ClrLoadingState.LOADING,
  },
  {
    stateName: 'Success Buttons',
    validateState: ClrLoadingState.SUCCESS,
    submitState: ClrLoadingState.SUCCESS,
  },
  {
    stateName: 'Error Buttons',
    validateState: ClrLoadingState.ERROR,
    submitState: ClrLoadingState.ERROR,
  },
];

setupStorybook([ClrLoadingModule, ClrButtonModule], defaultStory, defaultParameters, variants);
