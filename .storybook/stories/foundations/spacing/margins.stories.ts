/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

import { LayoutTestComponent } from './margins.storybook.component';

/**
 * The story renders `<layout-test-component>` through `component:`. The component takes no
 * `@Input()`s -- the margin scale is spelled out in its template -- so the args are empty.
 */
type MarginsArgs = LayoutTestComponent;

const meta: Meta<MarginsArgs> = {
  title: 'Foundations/Spacing/Margins',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  component: LayoutTestComponent,
  argTypes: {},
  args: {},
};

export default meta;

type Story = StoryObj<MarginsArgs>;

export const Margins: Story = {};
