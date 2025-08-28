/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClrCommonFormsModule } from '../common';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrFileInput } from './file-input';
import { ClrFileInputContainer } from './file-input-container';
import { selectFiles } from './file-input.helpers';

interface TestComponent {
  buttonLabel: string;
}

@Component({
  template: `
    <clr-file-input-container>
      <input type="file" name="model" [(ngModel)]="model" clrFileInput required required />
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error>Error message</clr-control-error>
    </clr-file-input-container>
  `,
  standalone: false,
})
class NoLabelTest {
  model: string;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-file-input-container [clrButtonLabel]="buttonLabel">
        <label>File</label>
        <input type="file" formControlName="model" clrFileInput required />
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-success>Success message</clr-control-success>
        <clr-control-error>Error message</clr-control-error>
      </clr-file-input-container>
    </form>
  `,
  standalone: false,
})
class ReactiveTest implements TestComponent {
  disabled = false;
  form = new FormGroup({
    model: new FormControl<FileList>({ value: undefined, disabled: this.disabled }, Validators.required),
  });

  buttonLabel: string;
}

@Component({
  template: `
    <clr-file-input-container [clrButtonLabel]="buttonLabel">
      <label>File</label>
      <input type="file" name="file" [(ngModel)]="model" clrFileInput [disabled]="disabled" required />
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error>Error message</clr-control-error>
    </clr-file-input-container>
  `,
  standalone: false,
})
class TemplateDrivenTest implements TestComponent {
  disabled = false;
  model: FileList;

  buttonLabel: string;
}

describe('ClrFileInputContainer', () => {
  const clrFileInputSelector = '.clr-file-input-wrapper [clrFileInput]';

  ContainerNoLabelSpec(ClrFileInputContainer, ClrFileInput, NoLabelTest);
  ReactiveSpec(ClrFileInputContainer, ClrFileInput, ReactiveTest, clrFileInputSelector);
  TemplateDrivenSpec(ClrFileInputContainer, ClrFileInput, TemplateDrivenTest, clrFileInputSelector);

  describe('reactive', () => {
    fileInputSpec(ReactiveTest);
  });

  describe('template-driven', () => {
    fileInputSpec(TemplateDrivenTest);
  });
});

function fileInputSpec(testComponent: Type<TestComponent>) {
  let fixture: ComponentFixture<TestComponent>;
  let nativeElement: HTMLElement;
  let fileInputElement: HTMLInputElement;
  let browseButtonElement: HTMLButtonElement;
  let queryClearButtonElement: () => HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule],
      declarations: [ClrFileInputContainer, ClrFileInput, testComponent],
    });

    fixture = TestBed.createComponent(testComponent);

    nativeElement = fixture.nativeElement;
    fileInputElement = nativeElement.querySelector('input[type="file"]');
    browseButtonElement = nativeElement.querySelector('.clr-file-input-browse-button');
    queryClearButtonElement = () => nativeElement.querySelector('.clr-file-input-clear-button');

    fixture.detectChanges();
  });

  it('should have a default button label', () => {
    expect(browseButtonElement.innerText.trim()).toBe('BROWSE');
  });

  it('should have a customizable button label', () => {
    fixture.componentInstance.buttonLabel = 'Select File';
    fixture.detectChanges();

    expect(browseButtonElement.innerText.trim()).toBe('SELECT FILE');
  });

  it('should update the button label when a single file is selected', () => {
    selectFiles(fileInputElement, [new File([''], 'file.txt')]);
    fixture.detectChanges();

    expect(browseButtonElement.innerText.trim()).toBe('FILE.TXT');
  });

  it('should update the button label when two files are selected', () => {
    selectFiles(fileInputElement, [new File([''], 'file-1.txt'), new File([''], 'file-2.txt')]);
    fixture.detectChanges();

    expect(browseButtonElement.innerText.trim()).toBe('2 FILES');
  });

  it('should update the button label when three files are selected', () => {
    selectFiles(fileInputElement, [
      new File([''], 'file-1.txt'),
      new File([''], 'file-2.txt'),
      new File([''], 'file-3.txt'),
    ]);
    fixture.detectChanges();

    expect(browseButtonElement.innerText.trim()).toBe('3 FILES');
  });

  it('should not have a clear button when no file is selected', () => {
    const clearButtonElement = queryClearButtonElement();

    expect(clearButtonElement).toBeNull();
  });

  it('show a clear button when a single file is selected', () => {
    selectFiles(fileInputElement, [new File([''], 'file.txt')]);
    fixture.detectChanges();

    const clearButtonElement = queryClearButtonElement();
    expect(clearButtonElement).toBeDefined();
    expect(clearButtonElement.getAttribute('aria-label')).toBe('Clear file.txt');
  });

  it('show a clear button when two files are selected', () => {
    selectFiles(fileInputElement, [new File([''], 'file-1.txt'), new File([''], 'file-2.txt')]);
    fixture.detectChanges();

    const clearButtonElement = queryClearButtonElement();
    expect(clearButtonElement).toBeDefined();
    expect(clearButtonElement.getAttribute('aria-label')).toBe('Clear 2 files');
  });

  it('should clear the selected file when the clear button is clicked', () => {
    selectFiles(fileInputElement, [new File([''], 'file.txt')]);
    fixture.detectChanges();

    const clearButtonElement = queryClearButtonElement();
    clearButtonElement.click();
    fixture.detectChanges();

    expect(fileInputElement.files.length).toBe(0);
    expect(browseButtonElement.innerText.trim()).toBe('BROWSE');
    expect(nativeElement.querySelector('.clr-file-input-clear-button')).toBeNull();
  });

  it('should disable the button when the control is disabled', () => {
    fileInputElement.disabled = true;
    fixture.detectChanges();

    expect(browseButtonElement.disabled).toBeTrue();
  });
}
