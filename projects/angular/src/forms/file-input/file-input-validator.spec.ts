/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

import { ClrFormsModule } from '../forms.module';
import { clearFiles, selectFiles } from './file-input.helpers';

interface TestComponent {
  accept: string;

  get control(): FormControl<FileList>;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-file-input-container>
        <label>File</label>
        <input
          type="file"
          formControlName="files"
          clrFileInput
          [clrMinFileSize]="100"
          [clrMaxFileSize]="500"
          [accept]="accept"
          multiple
          required
        />
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error *clrIfError="'required'">Required</clr-control-error>
        <clr-control-error *clrIfError="'accept'">File type not accepted</clr-control-error>
        <clr-control-error *clrIfError="'minFileSize'">File size too small</clr-control-error>
        <clr-control-error *clrIfError="'maxFileSize'">File size too large</clr-control-error>
      </clr-file-input-container>
    </form>
  `,
  standalone: false,
})
class ReactiveTest implements TestComponent {
  accept = '.txt,text/plain';

  readonly form = new FormGroup({
    files: new FormControl<FileList>(undefined),
  });

  get control() {
    return this.form.controls.files;
  }
}

@Component({
  template: `
    <clr-file-input-container>
      <label>File</label>
      <input
        #ngModel="ngModel"
        type="file"
        name="files"
        [(ngModel)]="files"
        clrFileInput
        [clrMinFileSize]="100"
        [clrMaxFileSize]="500"
        [accept]="accept"
        required
        multiple
      />
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error *clrIfError="'required'">Required</clr-control-error>
      <clr-control-error *clrIfError="'accept'">File type not accepted</clr-control-error>
      <clr-control-error *clrIfError="'minFileSize'">File size too small</clr-control-error>
      <clr-control-error *clrIfError="'maxFileSize'">File size too large</clr-control-error>
    </clr-file-input-container>
  `,
  standalone: false,
})
class TemplateDrivenTest implements TestComponent {
  files: FileList;
  accept = '.txt,text/plain';

  @ViewChild('ngModel') private readonly ngModel: NgModel;

  get control() {
    return this.ngModel.control;
  }
}

describe('ClrFileInputValidator', () => {
  describe('reactive', () => {
    fileInputValidatorSpec(ReactiveTest);
  });

  describe('template-driven', () => {
    fileInputValidatorSpec(TemplateDrivenTest);
  });
});

function fileInputValidatorSpec(testComponent: Type<TestComponent>) {
  let fixture: ComponentFixture<TestComponent>;
  let nativeElement: HTMLElement;
  let fileInputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ClrFormsModule],
      declarations: [testComponent],
    });

    fixture = TestBed.createComponent(testComponent);

    nativeElement = fixture.nativeElement;
    fileInputElement = nativeElement.querySelector('input[type="file"]');

    fixture.detectChanges();
  });

  it('should not show an error when not touched', () => {
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('should not show an error when valid', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'file.txt')]);
    fixture.detectChanges();

    expect(nativeElement.querySelector('clr-control-error')?.innerHTML).toBeUndefined();
  });

  it('should show the required error when touched and no file is selected', async () => {
    clearFiles(fileInputElement);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('Required');
  });

  it('should show the file type error when the file is not accepted', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'image.png')]);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('should not show the file type error when `accept` is an empty string', () => {
    fixture.componentInstance.accept = '';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'image.png')]);
    fixture.detectChanges();

    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('should show the file size error when the file is too small', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(99)], 'file.txt')]);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('File size too small');
  });

  it('should show the file size error when the file is too large', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(501)], 'file.txt')]);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('File size too large');
  });
}

function getErrorMessages(nativeElement: HTMLElement) {
  return Array.from(nativeElement.querySelectorAll<HTMLElement>('clr-control-error'))
    .map(controlErrorElement => controlErrorElement.innerText.trim())
    .join('\n');
}
