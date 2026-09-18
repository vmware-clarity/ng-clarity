/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// button.stories.ts
import { ClrButton } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { BUTTON_STYLES, BUTTON_TYPES } from '@storybook-helpers/button-class.helper';
import { CommonModules } from '@storybook-helpers/common';

import { ButtonStorybookComponent } from './button.storybook.component';

/**
 * The args drive `<storybook-button>`, so the args type is that component. The two `ClrButton` methods
 * are picked from the class and `class` is declared here (`ClrButton` aliases it as
 * `@Input('class') get classNames`): they appear in `argTypes` only to quieten the controls table
 * generated from `component: ClrButton`.
 */
type ButtonArgs = ButtonStorybookComponent &
  Pick<ClrButton, 'emitClick' | 'loadingStateChange'> & {
    class: string;
  };

const meta: Meta<ButtonArgs> = {
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
    ...hideControls('emitClick', 'loadingStateChange'),
    buttonStyle: { control: { type: 'radio' }, options: BUTTON_STYLES },
    buttonType: { control: { type: 'radio' }, options: BUTTON_TYPES },
    ...hideControls('templateMode'),
  },
  args: {
    disabled: false,
    content: 'Hello World!',
    iconShape: '',
    buttonType: 'primary',
    buttonStyle: 'outline',
    templateMode: 'default', // default template
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-button ${argsToTemplate(args)}></storybook-button>
    `,
  }),
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Button: Story = {};

export const Solid: Story = {
  args: { buttonStyle: 'solid' },
};

export const Outline: Story = {
  args: { buttonStyle: 'outline' },
};

export const Flat: Story = {
  args: { buttonStyle: 'flat' },
};

export const Link: Story = {
  args: { templateMode: 'link', buttonStyle: 'flat' },
};

export const Showcase: Story = {
  args: { templateMode: 'showcase' },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};

export const ShowcaseHover: Story = {
  args: { templateMode: 'showcase' },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    pseudo: { hover: true },
  },
};

export const ShowcaseActive: Story = {
  args: { templateMode: 'showcase' },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    pseudo: { active: true },
  },
};
