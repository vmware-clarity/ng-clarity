/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout, commonStringsDefault } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryContext, type StoryObj } from '@storybook/angular';

import { selectFiles } from '../../../../../projects/angular/forms/file-input/file-input.helpers';

/**
 * This file has no `component:`, and the two args are named after Clarity's input aliases
 * (`ClrFileInputContainer` declares `@Input('clrButtonLabel') customButtonLabel`, `ClrForm` declares
 * `@Input('clrLayout') layout`), so neither class can serve as the args base. The args are declared here.
 */
type FileInputArgs = {
  clrButtonLabel: string;
  clrLayout: ClrFormLayout | string;
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

const meta: Meta<FileInputArgs> = {
  title: 'Components/Forms/File Input',
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
  render: args => ({
    template: fileInputTemplate,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<FileInputArgs>;

export const VerticalFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const VerticalFileInputWithSelection: Story = {
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const HorizontalFileInputSelection: Story = {
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactFileInput: Story = {
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

export const CompactFileInputWithSelection: Story = {
  play: selectFile,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

// regression test for CDE-2183
export const VerticalFileInputWithSelectionInConstrainedContainer: Story = {
  // render-override: this story wraps the form in a 10px-wide container, which the meta template cannot express
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
