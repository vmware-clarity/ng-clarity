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

const innerComponents = [
  { type: BadgeStoryBookComponent, options: { badgeTypes: [''] } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: ['badge-info'] } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: ['badge-success'], showLinkBadge: false } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: ['badge-danger'], showLinkBadge: false } },
  { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-danger'], clickable: true } },
  { type: LabelStoryBookComponent, options: { labelColorTypes: ['label-success'], closeIcon: true } },
];
const nestedComponents = [
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 2,
      alertTypes: ['success'],
      showActions: true,
      components: [innerComponents[0]],
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 1,
      alertTypes: ['info'],
      showAction: true,
      components: [innerComponents[0]],
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      alertCount: 1,
      alertTypes: ['warning'],
      clrAlertClosable: true,
      components: innerComponents,
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      content:
        'Standard alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text ' +
        'Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, ' +
        'Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text',
      alertCount: 1,
      alertTypes: ['danger'],
      clrAlertClosable: true,
      components: innerComponents,
    },
  },
  {
    type: StandardAlertStorybookComponent,
    options: {
      content:
        'Standard alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text ' +
        'Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text, ' +
        'Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text',
      alertCount: 1,
      showActions: true,
      alertTypes: ['info'],
      clrAlertClosable: true,
      components: innerComponents,
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
