/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsModule } from '@angular/forms';
import { ClrFileInputModule, ClrFormLayout } from '@clr/angular';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { clearFiles, selectFiles } from '../../../projects/angular/src/forms/file-input/file-input.helpers';
import { toCamelCase, toKebabCase } from '../../helpers/casing.helpers';

export default {
  title: 'File Input/Advanced File Input States',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, ClrFileInputModule],
    }),
  ],
  argTypes: {
    // form inputs
    clrLayout: { control: { disable: true } },
  },
};

const advancedFileInputStatesTemplate: StoryFn = args => ({
  template: `
    <form clrForm [clrLayout]="clrLayout">
      <div>${advancedFileInputTemplateFn('Success State')}</div>
      <div>${advancedFileInputTemplateFn('Empty Error State')}</div>
      <div>${advancedFileInputTemplateFn('Multiple Files Success State')}</div>
      <div>${advancedFileInputTemplateFn('Multiple Files Error State')}</div>
      <div>${advancedFileInputTemplateFn('Multiple Files Mixed State')}</div>
      <div>${advancedFileInputTemplateFn('Long Filename')}</div>

      <clr-file-input-container>
        <label>Disabled</label>
        <input type="file" clrFileInput disabled />
      </clr-file-input-container>
    </form>
  `,
  props: { ...args },
});

function advancedFileInputTemplateFn(label: string) {
  const id = `${toKebabCase(label)}-file-input`;
  const ngModel = `${toCamelCase(label)}File`;

  return `
<clr-file-input-container>
  <label>${label}</label>
  <input
    id="${id}"
    name="${id}"
    type="file"
    accept=".txt,text/plain"
    multiple
    required
    clrFileInput
    [clrMinFileSize]="50"
    [clrMaxFileSize]="500"
    [(ngModel)]="${ngModel}"
    #${ngModel}NgModel="ngModel"
  />
  <clr-control-helper>Helper text for file input control</clr-control-helper>
  <clr-control-success>Success message for file input control</clr-control-success>
  <clr-control-error *clrIfError="'required'">Required</clr-control-error>
  <clr-control-error *ngIf="${ngModel}NgModel.invalid && !${ngModel}NgModel.control.hasError('required')">Error message for file input control</clr-control-error>
  
  <!-- This makes this file input an "advanced" file input. -->
  <clr-file-list>
    <ng-template clr-file-messages let-file let-errors="errors">
      <clr-file-info>Info text for {{ file.name }}</clr-file-info>
      <clr-file-success>Success message for {{ file.name }}</clr-file-success>
      <clr-file-error *ngIf="errors.accept">File type not accepted</clr-file-error>
      <clr-file-error *ngIf="errors.minFileSize">File size too small</clr-file-error>
      <clr-file-error *ngIf="errors.maxFileSize">File size too large</clr-file-error>
    </ng-template>
  </clr-file-list>
</clr-file-input-container>
`;
}

export const VerticalAdvancedFileInputStates: StoryObj = {
  render: advancedFileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.VERTICAL,
  },
};

export const HorizontalAdvancedFileInputStates: StoryObj = {
  render: advancedFileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.HORIZONTAL,
  },
};

export const CompactAdvancedFileInputStates: StoryObj = {
  render: advancedFileInputStatesTemplate,
  play: fileInputStatesPlayFn,
  args: {
    clrLayout: ClrFormLayout.COMPACT,
  },
};

function fileInputStatesPlayFn({ canvasElement }: StoryContext) {
  const successStateFileInputElement = canvasElement.querySelector<HTMLInputElement>('#success-state-file-input');
  selectFiles(successStateFileInputElement, [new File(['.'.repeat(50)], 'file.txt')]);

  const emptyErrorStateFileInputElement = canvasElement.querySelector<HTMLInputElement>(
    '#empty-error-state-file-input'
  );
  selectFiles(emptyErrorStateFileInputElement, [new File([''], 'file.txt')]);
  clearFiles(emptyErrorStateFileInputElement);

  const multipleFilesSuccessStateFileInputElement = canvasElement.querySelector<HTMLInputElement>(
    '#multiple-files-success-state-file-input'
  );
  selectFiles(multipleFilesSuccessStateFileInputElement, [
    new File(['.'.repeat(50)], 'file-1.txt'),
    new File(['.'.repeat(50)], 'file-2.txt'),
    new File(['.'.repeat(50)], 'file-3.txt'),
  ]);

  const multipleFilesErrorStateFileInputElement = canvasElement.querySelector<HTMLInputElement>(
    '#multiple-files-error-state-file-input'
  );
  selectFiles(multipleFilesErrorStateFileInputElement, [
    new File(['.'.repeat(25)], 'file-1.txt'),
    new File(['.'.repeat(501)], 'file-2.txt'),
    new File(['.'.repeat(50)], 'file-3.png'),
  ]);

  const multipleFilesMixedStateFileInputElement = canvasElement.querySelector<HTMLInputElement>(
    '#multiple-files-mixed-state-file-input'
  );
  selectFiles(multipleFilesMixedStateFileInputElement, [
    new File(['.'.repeat(25)], 'file-1.txt'),
    new File(['.'.repeat(50)], 'file-2.txt'),
    new File(['.'.repeat(501)], 'file-3.txt'),
  ]);

  const longFilenameFileInputElement = canvasElement.querySelector<HTMLInputElement>('#long-filename-file-input');
  selectFiles(longFilenameFileInputElement, [
    new File(
      [''],
      'long-filename-lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-mauris-a-ante-pharetra-hendrerit-turpis-nec-volutpat-leo-duis-consectetur-tincidunt-risus-non-lobortis.txt'
    ),
  ]);
}
