/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { RenderComponentStorybook } from '@storybook-helpers/render-component';

import { ButtonStorybookComponent } from './button.storybook.component';
import { BadgeStoryBookComponent } from '../badge/badge.storybook.component';
import { LabelStoryBookComponent } from '../label/label.storybook.component';

/** The story renders `<storybook-render-component>`, so its one input is the only arg. */
type NestedComponentsArgs = RenderComponentStorybook;

const LABEL_TYPES = ['info', 'success', 'warning', 'danger'];
const BADGE_TYPES = ['info', 'success', 'warning', 'danger'];
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

const meta: Meta<NestedComponentsArgs> = {
  title: 'Button/Nesting Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule, RenderComponentStorybook],
    }),
  ],
  argTypes: {
    ...hideControls('components'),
  },
  args: {
    // story helpers
    components: nestedComponents,
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
    `,
  }),
};

export default meta;

type Story = StoryObj<NestedComponentsArgs>;

export const Default: Story = {};
