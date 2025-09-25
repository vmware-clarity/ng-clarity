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
import { BadgeStoryBookComponent } from '../badge/badge.storybook.component';

const nestedComponents = [
  {
    type: LabelStoryBookComponent,
    options: {
      clickable: false,
      labelColorTypes: ['label-info'],
      closeIcon: true,
      components: [
        { type: BadgeStoryBookComponent, options: { context: '1', badgeTypes: [''], showLinkBadge: false } },
      ],
    },
  },
  {
    type: LabelStoryBookComponent,
    options: {
      clickable: true,
      labelColorTypes: ['label-success'],
      components: [
        { type: BadgeStoryBookComponent, options: { context: '2', badgeTypes: ['info'], showLinkBadge: false } },
      ],
    },
  },
  {
    type: LabelStoryBookComponent,
    options: {
      labelColorTypes: ['label-warning'],
      components: [
        {
          type: BadgeStoryBookComponent,
          options: { context: '3', badgeTypes: ['danger'], showLinkBadge: false },
        },
      ],
    },
  },
  {
    type: LabelStoryBookComponent,
    options: {
      components: [{ type: BadgeStoryBookComponent, options: { badgeTypes: ['warning'], showLinkBadge: false } }],
    },
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
