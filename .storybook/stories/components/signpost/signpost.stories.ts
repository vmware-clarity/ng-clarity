/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSignpostContent, ClrSignpostModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrSignpostContent` aliases its inputs (`@Input('clrPosition') get position`,
 * `@Input('clrSignpostCloseAriaLabel') signpostCloseAriaLabel`), so the component class cannot be the args
 * type; the args are the `clr*` names the templates bind plus the two story-only strings.
 */
type SignpostArgs = {
  clrPosition: string;
  clrSignpostCloseAriaLabel: string;
  clrSignpostTriggerAriaLabel: string;
  content: string;
  title: string;
};

const positions: string[] = [
  'top-left',
  'top-middle',
  'top-right',
  'right-top',
  'right-middle',
  'right-bottom',
  'bottom-right',
  'bottom-middle',
  'bottom-left',
  'left-bottom',
  'left-middle',
  'left-top',
];

const meta: Meta<SignpostArgs> = {
  title: 'Signpost/Signpost',
  component: ClrSignpostContent,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSignpostModule],
    }),
  ],
  argTypes: {
    // inputs
    clrPosition: { control: { type: 'radio' }, options: positions },
    // methods
    ...hideControls('close', 'anchor', 'release'),
  },
  args: {
    // inputs
    clrPosition: 'right-middle',
    clrSignpostCloseAriaLabel: 'Info Close',
    clrSignpostTriggerAriaLabel: 'Info',
    // story helpers
    content: 'Hello World!',
    title: 'Title',
  },
  render: args => ({
    template: `
      <div style="padding: 250px; text-align: center">
        <clr-signpost [clrSignpostTriggerAriaLabel]="clrSignpostTriggerAriaLabel">
          <clr-signpost-content [clrPosition]="clrPosition" [clrSignpostCloseAriaLabel]="clrSignpostCloseAriaLabel">
            {{ content }}
          </clr-signpost-content>
        </clr-signpost>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<SignpostArgs>;

export const Initial: Story = {};

export const Opened: Story = {
  play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
};

// visual regression test for CDE-3123
export const DefaultPositionOpened: Story = {
  // render-override: this story omits the `clrPosition` binding entirely so the content falls back to its default position, which the meta template cannot express
  render: args => ({
    template: `
      <div style="padding: 250px; text-align: center">
        <clr-signpost [clrSignpostTriggerAriaLabel]="clrSignpostTriggerAriaLabel">
          <clr-signpost-content [clrSignpostCloseAriaLabel]="clrSignpostCloseAriaLabel">
            {{ content }}
          </clr-signpost-content>
        </clr-signpost>
      </div>
    `,
    props: args,
  }),
  play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
};

// visual regression test for CDE-2226
export const OpenedLongContent: Story = {
  play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
  args: {
    content: 'Hello World! '.repeat(170),
  },
};

export const SignpostWithTitle: Story = {
  // render-override: this story adds a `<clr-signpost-title>` and drops the aria-label bindings, which the meta template cannot express
  render: args => ({
    template: `
      <div style="padding: 250px; text-align: center">
        <clr-signpost>
          <clr-signpost-content [clrPosition]="clrPosition">
            <clr-signpost-title>{{ title }}</clr-signpost-title>
            {{ content }}
          </clr-signpost-content>
        </clr-signpost>
      </div>
    `,
    props: args,
  }),
  play({ canvasElement }) {
    canvasElement.querySelector('button').click();
  },
};
