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

  it('accept: ".gz" should accept both readme.gz, archive.tar.gz (suffix match) but reject package.gz.tar', () => {
    fixture.componentInstance.accept = '.gz';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'readme.gz')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'archive.tar.gz')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'package.gz.tar')]);
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('accept: ".tar.gz" should accept archive.tar.gz and reject readme.gz', () => {
    fixture.componentInstance.accept = '.tar.gz';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'archive.tar.gz')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'readme.gz')]);
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('accept: ".gz,.tar.gz" should accept both variants', () => {
    fixture.componentInstance.accept = '.gz,.tar.gz';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'readme.gz')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'archive.tar.gz')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('accept: "application/gzip" should accept by MIME even if extension differs', () => {
    fixture.componentInstance.accept = 'application/gzip';
    fixture.detectChanges();

    // Simulate a gzip file with correct MIME
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'anything.any', { type: 'application/gzip' })]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('accept: "image/*" should accept image/png and reject text/plain', () => {
    fixture.componentInstance.accept = 'image/*';
    fixture.detectChanges();

    // valid: image/png
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'pic.png', { type: 'image/png' })]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    // invalid: text/plain
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'note.txt', { type: 'text/plain' })]);
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('should be case-insensitive for extensions', () => {
    fixture.componentInstance.accept = '.gz,.tar.gz';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'README.GZ')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'ARCHIVE.TAR.GZ')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('dotfile with no further dot should be treated as no extension', () => {
    fixture.componentInstance.accept = '.txt';
    fixture.detectChanges();

    // ".gitignore" should NOT match ".txt"
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], '.gitignore')]);
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('no extension should be rejected when an extension is required', () => {
    fixture.componentInstance.accept = '.txt';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'readme')]); // no extension
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('multi-part custom: accept ".module.css" should accept style.module.css and reject style.css', () => {
    fixture.componentInstance.accept = '.module.css';
    fixture.detectChanges();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'style.module.css')]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();

    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'style.css')]);
    fixture.detectChanges();
    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
  });

  it('MIME exact should override extension when present', () => {
    fixture.componentInstance.accept = '.txt,text/plain';
    fixture.detectChanges();

    // Wrong extension but correct MIME -> accepted
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'data.bin', { type: 'text/plain' })]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });

  it('empty MIME type falls back to extension checks only', () => {
    fixture.componentInstance.accept = '.gz';
    fixture.detectChanges();

    // No MIME provided, should be accepted by extension
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'readme.gz', { type: '' })]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('clr-control-error')).toBeNull();
  });
}

function getErrorMessages(nativeElement: HTMLElement) {
  return Array.from(nativeElement.querySelectorAll<HTMLElement>('clr-control-error'))
    .map(controlErrorElement => controlErrorElement.innerText.trim())
    .join('\n');
}
