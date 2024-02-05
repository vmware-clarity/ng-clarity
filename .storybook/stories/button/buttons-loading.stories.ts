/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrLoading, ClrLoadingButtonModule, ClrLoadingState } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

export default {
  title: 'Button/Button Loading States',
  component: ClrLoading,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLoadingButtonModule],
    }),
  ],
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

const ButtonLoadingStatesTemplate: StoryFn = args => ({
  template: `
      <h6>{{stateName}}</h6>
        <button [clrLoading]="validateState" class="btn btn-sm btn-primary">Validate</button>
        <button [clrLoading]="validateState" class="btn btn-primary">Validate</button>
        <button [clrLoading]="submitState" type="submit" class="btn btn-success-outline">Submit</button>
    `,
  props: args,
});

export const ButtonLoadingStates: StoryObj = {
  render: ButtonLoadingStatesTemplate,
};

export const Loading: StoryObj = {
  render: ButtonLoadingStatesTemplate,

  args: {
    ...ButtonLoadingStatesTemplate.args,
    stateName: 'Loading buttons',
    validateState: ClrLoadingState.LOADING,
    submitState: ClrLoadingState.LOADING,
  },
};
