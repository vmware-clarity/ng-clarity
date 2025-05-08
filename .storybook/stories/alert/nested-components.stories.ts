/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { RenderComponentStorybook } from 'helpers/render-component';

import { CommonModules } from '../../helpers/common';
import { BadgeStoryBookComponent } from '../badge/badge.storybook.component';
import { LabelStoryBookComponent } from '../label/label.storybook.component';
import { StandardAlertStorybookComponent } from './standard-alert.storybook.component';

const nestedComponents = [
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 1,
      alertTypes: ['info'],
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 1,
      alertTypes: ['info'],
      components: [{ type: BadgeStoryBookComponent, options: { badgeTypes: [''] } }],
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 1,
      alertTypes: ['warning'],
      clrAlertClosable: true,
      components: [
        { type: BadgeStoryBookComponent, options: { badgeTypes: ['badge-info'], showLinkBadge: false } },
        { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-danger'], clickable: true } },
        { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-success'], closeIcon: true } },
      ],
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      content:
        'Standard alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text',
      alertCount: 1,
      alertTypes: ['danger'],
      clrAlertClosable: true,
      components: [
        { type: BadgeStoryBookComponent, options: { badgeTypes: [''] } },
        { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-danger'], clickable: true } },
        { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-success'], closeIcon: true } },
      ],
    },
  },
];

export default {
  title: 'Alert/Nesting Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule, RenderComponentStorybook],
    }),
  ],
  argTypes: {
    // story helpers
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
