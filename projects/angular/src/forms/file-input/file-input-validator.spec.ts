/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClrFormsModule } from '../forms.module';
import { ClrFileInput } from './file-input';
import { ClrFileInputContainer } from './file-input-container';
import { clearFiles, selectFiles } from './file-input.spec.helpers';

@Component({
  template: `
    <form [formGroup]="form">
      <clr-file-input-container>
        <label>File</label>
        <input
          type="file"
          accept=".txt,text/plain"
          formControlName="file"
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
})
class ReactiveTest {
  readonly form = new FormGroup({
    file: new FormControl(undefined, Validators.required),
  });
}

@Component({
  template: `
    <clr-file-input-container>
      <label>File</label>
      <input
        type="file"
        accept=".txt,text/plain"
        name="file"
        [(ngModel)]="model"
        clrFileInput
        [clrMinFileSize]="100"
        [clrMaxFileSize]="500"
        required
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
class TemplateTest {
  file: string;
}

describe('ClrFileInputValidator', () => {
  describe('reactive', () => {
    fileInputValidatorSpec<ReactiveTest>(ReactiveTest);
  });

  describe('template-driven', () => {
    fileInputValidatorSpec<TemplateTest>(TemplateTest);
  });
});

function fileInputValidatorSpec<TTestComponent>(TestComponent: Type<TTestComponent>) {
  let fixture: ComponentFixture<TTestComponent>;
  let nativeElement: HTMLElement;
  let fileInputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ClrFormsModule],
      declarations: [ClrFileInputContainer, ClrFileInput, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);

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

  it('should show the required error when touched and no file is selected', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'file.txt')]);
    fixture.detectChanges();

    clearFiles(fileInputElement);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('Required');
  });

  it('should show the file type error when the file is not accepted', () => {
    selectFiles(fileInputElement, [new File(['+'.repeat(100)], 'image.png')]);
    fixture.detectChanges();

    expect(getErrorMessages(nativeElement)).toBe('File type not accepted');
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
