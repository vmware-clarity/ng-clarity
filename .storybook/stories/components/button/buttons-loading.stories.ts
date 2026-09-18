/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrButton, ClrLoading, ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { ButtonStorybookComponent } from './button.storybook.component';

/**
 * The args drive `<storybook-button templateMode="loading">`, so the args type is that component. The
 * two `ClrButton` methods are picked from the class, and `class` and `clrInMenu` are declared here
 * (`ClrButton` aliases both, as `@Input('class') get classNames` and `@Input('clrInMenu') get inMenu`):
 * all four appear in `argTypes` only to quieten the controls table.
 */
type ButtonLoadingArgs = ButtonStorybookComponent &
  Pick<ClrButton, 'emitClick' | 'loadingStateChange'> & {
    class: string;
    clrInMenu: boolean;
  };

const meta: Meta<ButtonLoadingArgs> = {
  title: 'Components/Button/Buttons Loading',
  component: ClrLoading,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLoadingModule, ClrLoadingButtonModule, ButtonStorybookComponent],
    }),
  ],
  argTypes: {
    // inputs
    class: { control: { disable: true } },
    ...hideControls('clrInMenu'),
    // outputs
    click: { control: { disable: true } },
    // methods
    ...hideControls('emitClick', 'loadingStateChange'),
  },
  args: {
    stateName: 'Default Buttons',
    validateState: ClrLoadingState.DEFAULT,
    submitState: ClrLoadingState.DEFAULT,
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button templateMode="loading" ${argsToTemplate(args)}></storybook-button>
    `,
  }),
};

export default meta;

type Story = StoryObj<ButtonLoadingArgs>;

export const ButtonLoadingStates: Story = {};

export const Loading: Story = {
  args: {
    stateName: 'Loading buttons',
    validateState: ClrLoadingState.LOADING,
    submitState: ClrLoadingState.LOADING,
  },
};
