/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClrFormsModule } from '../forms.module';
import { buildFileList, selectFiles } from './file-input.helpers';

interface TestComponent {
  get control(): FormControl<FileList>;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-file-input-container>
        <label>File</label>
        <input
          type="file"
          accept=".txt,text/plain"
          formControlName="files"
          clrFileInput
          [clrMinFileSize]="100"
          [clrMaxFileSize]="500"
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
  readonly form = new FormGroup({
    files: new FormControl<FileList>(undefined, Validators.required),
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
        accept=".txt,text/plain"
        name="files"
        [(ngModel)]="files"
        clrFileInput
        [clrMinFileSize]="100"
        [clrMaxFileSize]="500"
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

  @ViewChild('ngModel') private readonly ngModel: NgModel;

  get control() {
    return this.ngModel.control;
  }
}

describe('ClrFileInputValueAccessor', () => {
  describe('reactive', () => {
    fileInputValueAccessorSpec(ReactiveTest);
  });

  describe('template-driven', () => {
    fileInputValueAccessorSpec(TemplateDrivenTest);
  });
});

function fileInputValueAccessorSpec(testComponent: Type<TestComponent>) {
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

  it('should mark the control touched when a file is selected', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'file.txt')]);
    fixture.detectChanges();

    expect(fixture.componentInstance.control.touched).toBeTrue();
  });

  it('should set the control value when a file is selected', () => {
    const files = buildFileList([new File(['+'.repeat(100)], 'file.txt')]);

    selectFiles(fileInputElement, files);
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(files);
  });

  it('should handle writing value: undefined (do nothing when no file was selected to prevent touching the control)', () => {
    const files = fileInputElement.files;

    fixture.componentInstance.control.setValue(undefined);

    expect(fileInputElement.files).toBe(files);
  });

  it('should handle writing value: null (do nothing when no file was selected to prevent touching the control)', () => {
    const files = fileInputElement.files;

    fixture.componentInstance.control.setValue(null);

    expect(fileInputElement.files).toBe(files);
  });

  it('should handle writing value: undefined (clear selected files)', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'file.txt')]);

    fixture.componentInstance.control.setValue(undefined);

    expect(fileInputElement.files.length).toBe(0);
  });

  it('should handle writing value: null (clear selected files)', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'file.txt')]);

    fixture.componentInstance.control.setValue(null);

    expect(fileInputElement.files.length).toBe(0);
  });

  it('should handle writing value: FileList', () => {
    const files = buildFileList([new File(['+'.repeat(100)], 'file.txt')]);

    fixture.componentInstance.control.setValue(files);

    expect(fileInputElement.files).toBe(files);
  });

  it('should throw when writing invalid value', () => {
    expect(writeInvalidValue).toThrowError('The value of a file input control must be a FileList.');

    function writeInvalidValue() {
      fixture.componentInstance.control.setValue('files' as any);
    }
  });
}
