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
import { ButtonStorybookComponent } from './button.storybook.component';

const LABEL_TYPES = ['label-info', 'label-success', 'label-warning', 'label-danger'];
const BADGE_TYPES = ['badge-info', 'badge-success', 'badge-warning', 'badge-danger'];
const innerComponents = [
  { type: BadgeStoryBookComponent, options: { badgeTypes: [BADGE_TYPES[2]], context: '5+', showLinkBadge: false } },
  { type: LabelStoryBookComponent, options: { labelTypes: [LABEL_TYPES[0]], content: '2+' } },
];
const nestedComponents = [
  {
    type: ButtonStorybookComponent,
    options: {
      components: [innerComponents[0]],
    },
  },
  {
    type: ButtonStorybookComponent,
    options: {
      iconShape: 'home',
      buttonType: 'primary',
      buttonStyle: 'solid',
      components: [innerComponents[1]],
    },
  },
  {
    type: ButtonStorybookComponent,
    options: {
      iconShape: 'home',
      buttonType: 'primary',
      buttonStyle: 'flat',
      components: [innerComponents[0]],
    },
  },
  {
    type: ButtonStorybookComponent,
    options: {
      iconShape: 'home',
      buttonType: 'primary',
      buttonStyle: 'outline',
      components: [innerComponents[0]],
    },
  },
];

export default {
  title: 'Button/Nesting Components',
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
