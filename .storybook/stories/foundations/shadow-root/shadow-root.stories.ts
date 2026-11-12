/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

import {
  ShadowRootContainerQueriesComponent,
  ShadowRootContainerQueriesModalComponent,
  ShadowRootTypographyComponent,
} from './shadow-root.storybook.component';

/** The stories are fixed markup inside a shadow root; none of them takes an arg. */
type ShadowRootArgs = Record<never, never>;

const meta = {
  title: 'Foundations/Shadow Root',
  decorators: [
    moduleMetadata({
      imports: [
        ...CommonModules,
        ShadowRootTypographyComponent,
        ShadowRootContainerQueriesComponent,
        ShadowRootContainerQueriesModalComponent,
      ],
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

/** One slot inside each grid breakpoint range. The widest still fits the 1280px snapshot viewport. */
const SLOTS = [
  { width: 400, label: 'xs: below 576px' },
  { width: 650, label: 'sm: 576px to 767px' },
  { width: 850, label: 'md: 768px to 991px' },
  { width: 1100, label: 'lg: 992px to 1199px' },
  { width: 1220, label: 'xl: 1200px and up' },
];

export const ContainerQueries: Story = {
  // eslint-disable-next-line no-restricted-syntax -- renders the container-query component in one slot per breakpoint instead of the typography component of the meta template
  render: () => ({
    props: { slots: SLOTS },
    template: `
      @for (slot of slots; track slot.width; let first = $first) {
        @if (!first) {
          <hr style="margin: var(--cds-global-space-9) 0" />
        }
        <h4 style="margin: 0 0 var(--cds-global-space-5)">{{ slot.width }}px slot ({{ slot.label }})</h4>
        <div [style.width.px]="slot.width"><shadow-root-container-queries></shadow-root-container-queries></div>
      }
    `,
  }),
};

export const ContainerQueriesModal: Story = {
  // eslint-disable-next-line no-restricted-syntax -- renders the modal component in a 400px slot instead of the typography component of the meta template
  render: () => ({
    template: `
      <div style="width: 400px"><shadow-root-container-queries-modal></shadow-root-container-queries-modal></div>
    `,
  }),
};
