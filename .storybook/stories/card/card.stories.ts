/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryObj } from '@storybook/angular';
import { BUTTON_STYLES } from 'helpers/button-class.helper';

import { CardStorybookComponent } from './card.storybook.component';

export default {
  title: 'Card/Card',
  component: CardStorybookComponent,
  argTypes: {
    createArray: { control: { disable: true }, table: { disable: true } },
    buttonStyle: { control: 'radio', options: BUTTON_STYLES },
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
  },
};

export const Card: StoryObj = {};
