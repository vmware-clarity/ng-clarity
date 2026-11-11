/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

import { GridContainerQueriesAddOnComponent } from './grid-add-on.storybook.component';

/** The story is fixed markup; it takes no args. */
type ContainerQueriesArgs = Record<never, never>;

/** Columns that split at `sm` and `md`, and visibility classes on both sides of `md`. */
const LAYOUT = `
  <div class="clr-row">
    <div class="clr-col-12 clr-col-md-6"><span class="cell">clr-col-12 clr-col-md-6</span></div>
    <div class="clr-col-12 clr-col-md-6"><span class="cell">clr-col-12 clr-col-md-6</span></div>
  </div>
  <div class="clr-row">
    <div class="clr-col-sm-4"><span class="cell">clr-col-sm-4</span></div>
    <div class="clr-col-sm-4"><span class="cell">clr-col-sm-4</span></div>
    <div class="clr-col-sm-4"><span class="cell">clr-col-sm-4</span></div>
  </div>
  <div class="clr-row">
    <div class="clr-col-sm-6 clr-col-md-3"><span class="cell">sm-6 md-3</span></div>
    <div class="clr-col-sm-6 clr-col-md-3"><span class="cell">sm-6 md-3</span></div>
    <div class="clr-col-sm-6 clr-col-md-3"><span class="cell">sm-6 md-3</span></div>
    <div class="clr-col-sm-6 clr-col-md-3"><span class="cell">sm-6 md-3</span></div>
  </div>
  <div cds-layout="grid cols@sm:6 gap:md">
    <span class="cell">cds-layout cols&#64;sm:6</span>
    <span class="cell">cds-layout cols&#64;sm:6</span>
  </div>
  <div class="clr-row">
    <div class="clr-col-6 clr-hidden-md-down"><span class="cell">clr-hidden-md-down</span></div>
    <div class="clr-col-6 clr-hidden-md-up"><span class="cell">clr-hidden-md-up</span></div>
  </div>
  <div class="clr-row clr-hidden-md-up probe-flex"><span class="cell">.clr-row (flex) clr-hidden-md-up</span></div>
  <div class="clr-hidden-md-up probe-block"><span class="cell">div (block) clr-hidden-md-up</span></div>
  <span class="clr-hidden-md-up probe-inline">span (inline) clr-hidden-md-up</span>
`;

const STYLES = `
  .cell { display: block; padding: 8px; margin-bottom: 8px; background: var(--cds-alias-object-container-background-tint); border: 1px solid var(--cds-alias-object-border-color); }
  .slot { margin-bottom: 24px; outline: 2px dashed var(--cds-alias-status-info); }
  .caption { font-weight: 600; margin: 0 0 8px; }
`;

const meta = {
  title: 'Foundations/Container Queries',
  decorators: [moduleMetadata({ imports: [...CommonModules, GridContainerQueriesAddOnComponent] })],
  render: () => ({
    styles: [
      `
        .cell { display: block; padding: 8px; margin-bottom: 8px; background: var(--cds-alias-object-container-background-tint); border: 1px solid var(--cds-alias-object-border-color); }
        .slot { margin-bottom: 24px; outline: 2px dashed var(--cds-alias-status-info); }
        .caption { font-weight: 600; margin: 0 0 8px; }
      `,
    ],
    template: `
      <p class="caption">No container (viewport)</p>
      <div class="slot">${LAYOUT}</div>
      <p class="caption">clr-layout container, 400px</p>
      <div class="slot" style="width: 400px; container: clr-layout / inline-size">${LAYOUT}</div>
      <p class="caption">clr-layout container, 650px</p>
      <div class="slot" style="width: 650px; container: clr-layout / inline-size">${LAYOUT}</div>
      <p class="caption">clr-layout container, 900px</p>
      <div class="slot" style="width: 900px; container: clr-layout / inline-size">${LAYOUT}</div>
    `,
  }),
} satisfies Meta<ContainerQueriesArgs>;

export default meta;

type Story = StoryObj<ContainerQueriesArgs>;

/** `clr-layout` containers narrower than the viewport, next to the same layout without a container. */
export const NarrowerThanViewport: Story = {};

/** The same slots with the branch's grid add-on: `clr-layout-container` instead of an inline `container`. */
export const GridAddOn: Story = {
  // eslint-disable-next-line no-restricted-syntax -- loads the add-on and marks the slots with clr-layout-container
  render: () => ({
    styles: [STYLES],
    template: `
      <grid-container-queries-add-on>
        <p class="caption">No container (viewport)</p>
        <div class="slot">${LAYOUT}</div>
        <p class="caption">clr-layout-container, 400px</p>
        <div class="slot" clr-layout-container style="width: 400px">${LAYOUT}</div>
        <p class="caption">clr-layout-container, 650px</p>
        <div class="slot" clr-layout-container style="width: 650px">${LAYOUT}</div>
        <p class="caption">clr-layout-container, 900px</p>
        <div class="slot" clr-layout-container style="width: 900px">${LAYOUT}</div>
      </grid-container-queries-add-on>
    `,
  }),
};
