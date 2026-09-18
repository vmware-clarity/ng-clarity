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

import { LabelStoryBookComponent } from './label.storybook.component';

/** The only arg is the list `<storybook-render-component>` instantiates, so its `@Input()` is the args type. */
type NestedComponentsArgs = RenderComponentStorybook;

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

const meta: Meta<NestedComponentsArgs> = {
  title: 'Components/Label/Nested Components',
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
