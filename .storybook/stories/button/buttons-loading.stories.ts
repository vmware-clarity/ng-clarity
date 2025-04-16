/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrLoading, ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { ButtonStorybookComponent } from './button.storybook.component';

export default {
  title: 'Button/Button Loading States',
  component: ClrLoading,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLoadingModule, ClrLoadingButtonModule, ButtonStorybookComponent],
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
  render: (args: ButtonStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button templateMode="loading" ${argsToTemplate(args)}></storybook-button>
    `,
  }),
};

export const ButtonLoadingStates: StoryObj = {};

export const Loading: StoryObj = {
  args: {
    stateName: 'Loading buttons',
    validateState: ClrLoadingState.LOADING,
    submitState: ClrLoadingState.LOADING,
  },
};
