/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSpinner, ClrSpinnerModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';
import { withStyles } from '@storybook-helpers/decorators';

/** `ClrSpinner` declares its inputs under their own names (`@Input('clrInline') set clrInline`), so the
 * component class can be used directly as the args type; `text` is the one story-only prop. */
type SpinnerArgs = ClrSpinner & {
  text: string;
};

/** Was an inline `<style>` at the head of the story template; `withStyles()` injects it unencapsulated,
 * exactly as the inline block did. */
const SPINNER_INVERSE_STYLES = `
  .spinner-inverse-container {
    background: var(--cds-alias-object-container-background-inverse);
    color: var(--cds-alias-typography-color-100);
    padding: 20px;
  }
`;

const meta: Meta<SpinnerArgs> = {
  title: 'Components/Spinner',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSpinnerModule],
    }),
    withStyles(SPINNER_INVERSE_STYLES),
  ],
  component: ClrSpinner,
  argTypes: {
    // story helpers
    text: { control: { type: 'text' }, description: 'Optional text' },
  },
  args: {
    // inputs
    clrInline: false,
    clrInverse: false,
    clrMedium: false,
    clrSmall: false,
    // story helpers
    text: 'Loading',
  },
  render: args => ({
    template: `
      <div style="text-align: center" [class.spinner-inverse-container]="clrInverse">
        <clr-spinner [clrInverse]="clrInverse" [clrSmall]="clrSmall" [clrMedium]="clrMedium" [clrInline]="clrInline">
          {{ text }}
        </clr-spinner>
        @if (!clrInline) {
          <br />
        }
        {{ text }}
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<SpinnerArgs>;

export const Spinner: Story = {};

export const Inverse: Story = {
  args: { clrInverse: true },
};

export const Medium: Story = {
  args: { clrMedium: true },
};

export const MediumInverse: Story = {
  args: { clrMedium: true, clrInverse: true },
};

export const Small: Story = {
  args: { clrSmall: true },
};

export const SmallInverse: Story = {
  args: { clrSmall: true, clrInverse: true },
};

export const Inline: Story = {
  args: { clrInline: true },
};

export const InlineInverse: Story = {
  args: { clrInline: true, clrInverse: true },
};
