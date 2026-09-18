/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { BUTTON_STYLES } from '@storybook-helpers/button-class.helper';

import { CardStorybookComponent } from './card.storybook.component';

/**
 * The stories render `<storybook-card>` through `component:`, and every arg is one of its `@Input()`s or
 * the `createArray` helper it exposes as a field, so the wrapper is the args type.
 */
type CardArgs = CardStorybookComponent;

const meta: Meta<CardArgs> = {
  title: 'Card/Card',
  component: CardStorybookComponent,
  argTypes: {
    ...hideControls('createArray'),
    buttonStyle: { control: { type: 'radio' }, options: BUTTON_STYLES },
  },
  args: {
    createArray: (n: number) => new Array(n),
    maxWidth: 400,
    itemCount: 4,
    actionCount: 4,
    header: 'Header',
    title: 'Title',
    content: 'Hello World!',
    buttonStyle: 'btn-outline',
    clickable: true,
    hasImage: true,
    showAlerts: false,
    alertCount: 2,
  },
};

export default meta;

type Story = StoryObj<CardArgs>;

export const Card: Story = {};

export const CardWithAlerts: Story = {
  args: {
    showAlerts: true,
  },
};
