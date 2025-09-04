/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout, commonStringsDefault } from '@clr/angular';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { selectFiles } from '../../../projects/angular/src/forms/file-input/file-input.helpers';

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
    clrLayout: { control: { disable: true } },
  },
  args: {
    // inputs
    clrButtonLabel: commonStringsDefault.browse,
  },
};

const fileInputTemplate = `
  <form clrForm [clrLayout]="clrLayout">
    <clr-file-input-container [clrButtonLabel]="clrButtonLabel">
      <label>File</label>
      <input type="file" name="file" [(ngModel)]="file" clrFileInput required multiple />
      <clr-control-helper>Helper message</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error *clrIfError="'required'">Required</clr-control-error>
    </clr-file-input-container>
  </form>
`;

const fileInputTemplateStoryFn: StoryFn = args => ({
  template: fileInputTemplate,
  props: { ...args },
});

export const VerticalFileInput: StoryObj = {
  render: fileInputTemplateStoryFn,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const VerticalFileInputWithSelection: StoryObj = {
  render: fileInputTemplateStoryFn,
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalFileInput: StoryObj = {
  render: fileInputTemplateStoryFn,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const HorizontalFileInputSelection: StoryObj = {
  render: fileInputTemplateStoryFn,
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactFileInput: StoryObj = {
  render: fileInputTemplateStoryFn,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

export const CompactFileInputWithSelection: StoryObj = {
  render: fileInputTemplateStoryFn,
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

// regression test for CDE-2183
export const VerticalFileInputWithSelectionInConstrainedContainer: StoryObj = {
  render: args => ({
    template: `
      <div style="width: 10px">${fileInputTemplate}</div>
    `,
    props: { ...args },
  }),
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

function selectFile({ canvasElement }: StoryContext) {
  const fileInputElement = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
  selectFiles(fileInputElement, [new File([''], 'file.txt')]);
}
