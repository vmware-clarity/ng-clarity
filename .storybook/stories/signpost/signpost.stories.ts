/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSignpostContent, ClrSignpostModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const positions: string[] = [
  'top-left',
  'top-middle',
  'top-right',
  'right-top',
  'right-middle',
  'right-bottom',
  'bottom-right',
  'bottom-middle',
  'bottom-left',
  'left-bottom',
  'left-middle',
  'left-top',
];

export default {
  title: 'Signpost/Signpost',
  component: ClrSignpostContent,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSignpostModule],
    }),
  ],
  argTypes: {
    // inputs
    clrPosition: { control: 'radio', options: positions },
    // methods
    close: { control: { disable: true }, table: { disable: true } },
    anchor: { control: { disable: true }, table: { disable: true } },
    release: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrPosition: 'right-middle',
    // story helpers
    content: 'Hello World!',
  },
};

const template = `
  <div style="padding: 250px; text-align: center">
    <clr-signpost>
      <clr-signpost-content [clrPosition]="clrPosition">
        {{ content }}
      </clr-signpost-content>
    </clr-signpost>
  </div>
`;

const SignpostTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const Initial: StoryObj = {
  render: SignpostTemplate,
};

export const Opened = {
  render: SignpostTemplate,
  async play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
};

// visual regression test for CDE-2226
export const OpenedLongContent = {
  render: SignpostTemplate,
  async play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
  args: {
    content: 'Hello World! '.repeat(100),
  },
};
