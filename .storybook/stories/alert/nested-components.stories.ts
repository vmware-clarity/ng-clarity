/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { RenderComponentStorybook } from 'helpers/render-component';

import { AppLevelAlertStorybookComponent } from './app-level-alert.storybook.component';
import { StandardAlertStorybookComponent } from './standard-alert.storybook.component';
import { CommonModules } from '../../helpers/common';
import { BadgeStoryBookComponent } from '../badge/badge.storybook.component';
import { LabelStoryBookComponent } from '../label/label.storybook.component';

const LABEL_TYPES = ['info', 'success', 'warning', 'danger'];
const BADGE_TYPES = ['info', 'success', 'warning', 'danger'];
const innerComponents = [
  { type: BadgeStoryBookComponent, options: { badgeTypes: [BADGE_TYPES[0]] } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: [BADGE_TYPES[1]] } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: [BADGE_TYPES[2]], showLinkBadge: false } },
  { type: BadgeStoryBookComponent, options: { badgeTypes: [BADGE_TYPES[3]], showLinkBadge: false } },
  { type: LabelStoryBookComponent, options: { labelTypes: LABEL_TYPES, clickable: true } },
  { type: LabelStoryBookComponent, options: { labelTypes: [LABEL_TYPES[0]] } },
];
const nestedComponents = [
  {
    type: AppLevelAlertStorybookComponent,
    options: {
      alertTypes: ['danger'],
      alertCount: 1,
      components: innerComponents,
    },
  },
  {
    type: AppLevelAlertStorybookComponent,
    options: {
      alertTypes: ['success'],
      alertCount: 1,
      showActions: true,
      clrAlertClosable: true,
      components: innerComponents,
    },
  },
  {
    type: AppLevelAlertStorybookComponent,
    options: {
      alertTypes: ['info'],
      alertCount: 1,
      showAction: true,
      clrAlertClosable: true,
      components: innerComponents,
    },
  },
  {
    type: AppLevelAlertStorybookComponent,
    options: {
      alertTypes: ['warning'],
      alertCount: 1,
      showAction: true,
      clrAlertClosable: true,
      components: innerComponents,
    },
  },
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
