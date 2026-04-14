/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Layout/Divider',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
};

// ─── Horizontal ───────────────────────────────────────────────────────────────

const HorizontalTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="vertical gap:md" style="max-width: 500px">
      <p cds-text="body disable-lhe">It is often preferable to use dividers inside of layouts.</p>
      <hr cds-divider />
      <p cds-text="body disable-lhe">This allows them to span the dimensions of their containers as expected.</p>
    </div>
  `,
});

export const Horizontal: StoryObj = { render: HorizontalTemplate };

// ─── Vertical ─────────────────────────────────────────────────────────────────

const VerticalTemplate: StoryFn = () => ({
  template: `
    <div
      cds-layout="horizontal gap:md align:vertical-center p-x:md"
      style="background: var(--cds-alias-object-app-background); height: 60px"
    >
      <button class="btn btn-sm btn-outline">Button 1</button>
      <button class="btn btn-sm btn-outline">Button 2</button>
      <hr cds-divider orientation="vertical" />
      <button class="btn btn-sm btn-outline">Button 3</button>
      <hr cds-divider orientation="vertical" />
      <p cds-text="body disable-lhe">Vertical dividers should be used inside horizontal layouts.</p>
    </div>
  `,
});

export const Vertical: StoryObj = { render: VerticalTemplate };

// ─── Vertical Fill ────────────────────────────────────────────────────────────

const VerticalFillTemplate: StoryFn = () => ({
  template: `
    <div
      cds-layout="horizontal gap:md align:vertical-center p-y:md"
      style="background: var(--cds-alias-object-app-background); height: 80px; padding: 0 48%"
    >
      <hr cds-divider orientation="vertical" style="height: 100%" />
    </div>
    <p cds-text="body" cds-layout="m-t:md">
      When not using a cds-layout, the vertical divider fills a container with a known height.
    </p>
  `,
});

export const VerticalFill: StoryObj = { render: VerticalFillTemplate };

// ─── In Context ───────────────────────────────────────────────────────────────

const InContextTemplate: StoryFn = () => ({
  template: `
    <style>
      .demo-card {
        border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
        border-radius: var(--cds-alias-object-border-radius-100);
      }
    </style>
    <div cds-layout="vertical gap:md" style="max-width: 500px">
      <div class="demo-card" cds-layout="vertical gap:sm p:md">
        <h4 cds-text="title">Section Header</h4>
        <p cds-text="body disable-lhe">Content above the divider goes here.</p>
        <hr cds-divider />
        <p cds-text="body disable-lhe">Content below the divider goes here.</p>
      </div>

      <div class="demo-card" cds-layout="horizontal gap:md align:vertical-center p:md">
        <p cds-text="body disable-lhe" style="flex: 1">Left content</p>
        <hr cds-divider orientation="vertical" style="height: 24px" />
        <p cds-text="body disable-lhe">Right content</p>
      </div>
    </div>
  `,
});

export const InContext: StoryObj = { render: InContextTemplate };
