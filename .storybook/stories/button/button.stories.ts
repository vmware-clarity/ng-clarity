/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// button.stories.ts
import { ClrButton } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { BUTTON_STYLES, BUTTON_TYPES } from '../../helpers/button-class.helper';
import { ButtonStorybookComponent } from './button.storybook.component';

export default {
  title: 'Button/Button',
  component: ClrButton,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ButtonStorybookComponent],
    }),
  ],
  argTypes: {
    class: { control: { disable: true } },
    click: { control: { disable: true } },
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
    buttonStyle: { control: 'radio', options: BUTTON_STYLES },
    buttonType: { control: 'radio', options: BUTTON_TYPES },
    templateMode: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    disabled: false,
    content: 'Hello World!',
    iconShape: '',
    buttonType: 'primary',
    buttonStyle: 'outline',
    templateMode: 'default', // default template
  },
  render: (args: ButtonStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button ${argsToTemplate(args)}></storybook-button>
    `,
  }),
};

export const Button: StoryObj = {};

export const Solid: StoryObj = {
  args: { buttonStyle: 'solid' },
};

export const Outline: StoryObj = {
  args: { buttonStyle: 'outline' },
};

export const Flat: StoryObj = {
  args: { buttonStyle: 'flat' },
};

export const Link: StoryObj = {
  args: { templateMode: 'link', buttonStyle: 'flat' },
};

export const Showcase: StoryObj = {
  args: { templateMode: 'showcase' },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
