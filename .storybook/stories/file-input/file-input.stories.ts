/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout, commonStringsDefault } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

export default {
  title: 'File Input/File Input',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ClrFileInputModule],
    }),
  ],
  argTypes: {
    // inputs
    clrButtonLabel: { type: 'string' },
    // form inputs
    clrLayout: { control: false },
  },
  args: {
    // inputs
    clrButtonLabel: commonStringsDefault.browse,
  },
};

const fileInputTemplate: StoryFn = args => ({
  template: `
    <form clrForm [clrLayout]="clrLayout">
      <clr-file-input-container [clrButtonLabel]="clrButtonLabel">
        <label>File</label>
        <input type="file" name="file" [(ngModel)]="file" clrFileInput required multiple />
        <clr-control-helper>Helper message</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-file-input-container>
    </form>
  `,
  props: { ...args },
});

export const VerticalFileInput: StoryObj = {
  render: fileInputTemplate,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalFileInput: StoryObj = {
  render: fileInputTemplate,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactFileInput: StoryObj = {
  render: fileInputTemplate,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};
