/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
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
import { selectFiles } from './file-input.spec.helpers';

@Component({
  template: `
    <clr-file-input-container>
      <input type="file" name="model" [(ngModel)]="model" clrFileInput required required />
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Success message</clr-control-success>
      <clr-control-error>Error message</clr-control-error>
    </clr-file-input-container>
  `,
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
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: undefined, disabled: this.disabled }, Validators.required),
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
})
class TemplateTest {
  disabled = false;
  model: string;

  buttonLabel: string;
}

describe('ClrFileInputContainer', () => {
  ContainerNoLabelSpec(ClrFileInputContainer, ClrFileInput, NoLabelTest);
  ReactiveSpec(ClrFileInputContainer, ClrFileInput, ReactiveTest, '.clr-file-input-wrapper [clrFileInput]');
  TemplateDrivenSpec(ClrFileInputContainer, ClrFileInput, TemplateTest, '.clr-file-input-wrapper [clrFileInput]');

  describe('reactive', () => {
    fileInputSpec<ReactiveTest>(ReactiveTest);
  });

  describe('template-driven', () => {
    fileInputSpec<TemplateTest>(TemplateTest);
  });
});

interface ITestComponent {
  buttonLabel: string;
}

function fileInputSpec<TTestComponent extends ITestComponent>(TestComponent: Type<TTestComponent>) {
  let fixture: ComponentFixture<TTestComponent>;
  let nativeElement: HTMLElement;
  let fileInputElement: HTMLInputElement;
  let browseButtonElement: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule],
      declarations: [ClrFileInputContainer, ClrFileInput, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);

    nativeElement = fixture.nativeElement;
    fileInputElement = nativeElement.querySelector('input[type="file"]');
    browseButtonElement = nativeElement.querySelector('.clr-file-input-browse-button');

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

  it('should show a clear files button when a file is selected', () => {
    selectFiles(fileInputElement, [new File([''], 'file.txt')]);
    fixture.detectChanges();

    expect(nativeElement.querySelector('.clr-file-input-clear-button')).toBeTruthy();
  });

  it('should clear the selected file when the clear button is clicked', () => {
    selectFiles(fileInputElement, [new File([''], 'file.txt')]);
    fixture.detectChanges();

    nativeElement.querySelector<HTMLButtonElement>('.clr-file-input-clear-button').click();
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
