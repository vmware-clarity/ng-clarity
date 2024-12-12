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
  title: 'File Input/Advanced File Input',
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

const advancedAdvancedFileInputTemplate = `
  <form clrForm [clrLayout]="clrLayout">
    <clr-file-input-container [clrButtonLabel]="clrButtonLabel">
      <label>File</label>
      <input type="file" name="file" [(ngModel)]="file" clrFileInput required multiple />
      <clr-control-helper>Helper message</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error *clrIfError="'required'">Required</clr-control-error>

      <!-- This makes this file input an "advanced" file input. -->
      <clr-file-list>
        <ng-template clr-file-messages let-file let-errors="errors">
          <clr-file-info>Info text for {{ file.name }}</clr-file-info>
          <clr-file-success>Success message for {{ file.name }}</clr-file-success>
        </ng-template>
      </clr-file-list>
    </clr-file-input-container>
  </form>
`;

const advancedAdvancedFileInputStoryFn: StoryFn = args => ({
  template: advancedAdvancedFileInputTemplate,
  props: { ...args },
});

export const VerticalAdvancedFileInput: StoryObj = {
  render: advancedAdvancedFileInputStoryFn,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalAdvancedFileInput: StoryObj = {
  render: advancedAdvancedFileInputStoryFn,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactAdvancedFileInput: StoryObj = {
  render: advancedAdvancedFileInputStoryFn,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};
