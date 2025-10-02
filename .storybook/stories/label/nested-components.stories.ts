/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { RenderComponentStorybook } from 'helpers/render-component';

import { LabelStoryBookComponent } from './label.storybook.component';
import { CommonModules } from '../../helpers/common';

const nestedComponents = [
  {
    type: LabelStoryBookComponent,
    options: {
      clickable: false,
      labelTypes: ['info'],
      closeIcon: true,
      cssLabel: false,
      badgeText: '1',
    },
  },
  {
    type: LabelStoryBookComponent,
    options: {
      clickable: true,
      labelTypes: ['success'],
      cssLabel: false,
      badgeText: '2',
    },
  },
  {
    type: LabelStoryBookComponent,
    options: {
      labelTypes: ['warning'],
      cssLabel: false,
      badgeText: '3',
    },
  },
  {
    type: LabelStoryBookComponent,
  },
];

export default {
  title: 'Label/Nesting Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule, RenderComponentStorybook],
    }),
  ],
  argTypes: {
    components: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    components: nestedComponents,
  },
  render: (args: RenderComponentStorybook) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
    `,
  }),
};

export const Default: StoryObj = {};
