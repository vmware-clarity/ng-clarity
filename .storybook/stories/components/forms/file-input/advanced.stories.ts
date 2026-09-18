/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout, commonStringsDefault } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

/**
 * This file has no `component:`, and the args are named after Clarity's input aliases
 * (`ClrFileInputContainer` declares `@Input('clrButtonLabel') customButtonLabel`, the file-input validator
 * declares `@Input('clrMinFileSize') minFileSize`), so no class can serve as the args base. `accept` and
 * `multiple` are plain input attributes.
 */
type AdvancedFileInputArgs = {
  clrButtonLabel: string;
  clrMinFileSize: number;
  clrMaxFileSize: number;
  accept: string;
  multiple: boolean;
  clrLayout: ClrFormLayout | string;
};

const advancedAdvancedFileInputTemplate = `
  <form clrForm [clrLayout]="clrLayout">
    <clr-file-input-container [clrButtonLabel]="clrButtonLabel">
      <label>File</label>
      <input
        type="file"
        name="file"
        [(ngModel)]="file"
        clrFileInput
        [accept]="accept"
        [multiple]="multiple"
        [clrMinFileSize]="clrMinFileSize"
        [clrMaxFileSize]="clrMaxFileSize"
        required
      />
      <clr-control-helper>Helper message</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error *clrIfError="'required'">Required</clr-control-error>

      <!-- This makes this file input an "advanced" file input. -->
      <clr-file-list>
        <ng-template clr-file-messages let-file let-errors="errors">
          <clr-file-info>Info text for {{ file.name }}</clr-file-info>
          <clr-file-success>Success message for {{ file.name }}</clr-file-success>
          @if (errors.accept) {
            <clr-file-error>File type not accepted</clr-file-error>
          }
          @if (errors.minFileSize) {
            <clr-file-error>File size too small</clr-file-error>
          }
          @if (errors.maxFileSize) {
            <clr-file-error>File size too large</clr-file-error>
          }
        </ng-template>
      </clr-file-list>
    </clr-file-input-container>
  </form>
`;

const meta: Meta<AdvancedFileInputArgs> = {
  title: 'Components/Forms/File Input/Advanced',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ClrFileInputModule],
    }),
  ],
  argTypes: {
    // inputs
    clrButtonLabel: { type: 'string' },
    // form inputs
    clrLayout: { control: { disable: true } },
  },
  args: {
    // inputs
    clrButtonLabel: commonStringsDefault.browse,
    clrMinFileSize: 50,
    clrMaxFileSize: 500,
    // input attributes
    accept: 'text/plain',
    multiple: true,
  },
  render: args => ({
    template: advancedAdvancedFileInputTemplate,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<AdvancedFileInputArgs>;

export const VerticalAdvancedFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalAdvancedFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactAdvancedFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};
