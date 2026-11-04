/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

import { ShadowRootContainerQueriesComponent, ShadowRootTypographyComponent } from './shadow-root.storybook.component';

/** The stories are fixed markup inside a shadow root; none of them takes an arg. */
type ShadowRootArgs = Record<never, never>;

const meta = {
  title: 'Foundations/Shadow Root',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ShadowRootTypographyComponent, ShadowRootContainerQueriesComponent],
    }),
  ],
  render: () => ({
    template: `
      <shadow-root-typography></shadow-root-typography>
    `,
  }),
} satisfies Meta<ShadowRootArgs>;

export default meta;

type Story = StoryObj<ShadowRootArgs>;

export const Typography: Story = {};

export const ContainerQueries: Story = {
  // eslint-disable-next-line no-restricted-syntax -- this story renders the container-query component at two container widths instead of the typography component of the meta template
  render: () => ({
    template: `
      <div style="width: 400px">
        <shadow-root-container-queries></shadow-root-container-queries>
      </div>
      <div style="width: 900px">
        <shadow-root-container-queries></shadow-root-container-queries>
      </div>
    `,
  }),
};
