/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout } from '@clr/angular';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { clearFiles, selectFiles } from '../../../projects/angular/src/forms/file-input/file-input.helpers';

export default {
  title: 'File Input/File Input States',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ClrFileInputModule],
    }),
  ],
  argTypes: {
    // form inputs
    clrLayout: { control: false },
  },
};

const fileInputStatesTemplate: StoryFn = args => ({
  template: `
    <form clrForm [clrLayout]="clrLayout">
      <clr-file-input-container>
        <label>Success State</label>
        <input
          id="success-state-file-input"
          type="file"
          name="success-state-file"
          [(ngModel)]="successStateFile"
          clrFileInput
          required
          multiple
        />
        <clr-control-helper>Helper message</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-file-input-container>

      <clr-file-input-container>
        <label>Error State</label>
        <input
          id="error-state-file-input"
          type="file"
          name="error-state-file"
          [(ngModel)]="errorStateFile"
          clrFileInput
          required
          multiple
        />
        <clr-control-helper>Helper message</clr-control-helper>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-file-input-container>

      <clr-file-input-container>
        <label>Multiple Files</label>
        <input
          id="multiple-files-file-input"
          type="file"
          name="multiple-files-file"
          [(ngModel)]="multipleFilesFile"
          clrFileInput
          required
          multiple
        />
        <clr-control-helper>Helper message</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-file-input-container>

      <clr-file-input-container>
        <label>Long Filename</label>
        <input
          id="long-filename-file-input"
          type="file"
          name="long-filename-file"
          [(ngModel)]="longFilenameFile"
          clrFileInput
          required
          multiple
        />
        <clr-control-helper>Helper message</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      </clr-file-input-container>

      <clr-file-input-container>
        <label>Disabled</label>
        <input type="file" clrFileInput disabled />
      </clr-file-input-container>
    </form>
  `,
  props: { ...args },
});

export const VerticalFileInputStates: StoryObj = {
  render: fileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalFileInputStates: StoryObj = {
  render: fileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactFileInputStates: StoryObj = {
  render: fileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

function fileInputStatesPlayFn({ canvasElement }: StoryContext) {
  const successStateFileInputElement = canvasElement.querySelector<HTMLInputElement>('#success-state-file-input');
  selectFiles(successStateFileInputElement, [new File([''], 'file.txt')]);

  const errorStateFileInputElement = canvasElement.querySelector<HTMLInputElement>('#error-state-file-input');
  selectFiles(errorStateFileInputElement, [new File([''], 'file.txt')]);
  clearFiles(errorStateFileInputElement);

  const multipleFilesFileInputElement = canvasElement.querySelector<HTMLInputElement>('#multiple-files-file-input');
  selectFiles(multipleFilesFileInputElement, [new File([''], 'file-1.txt'), new File([''], 'file-2.txt')]);

  const longFilenameFileInputElement = canvasElement.querySelector<HTMLInputElement>('#long-filename-file-input');
  selectFiles(longFilenameFileInputElement, [new File([''], 'long-filename-lorem-ipsum-dolor-sit-amet.txt')]);
}
