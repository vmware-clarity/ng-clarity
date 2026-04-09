/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ClrCommonFormsModule } from '../common';
import { ClrIconModule } from '../../icon/icon.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';
import { ClrFileInput } from './file-input';
import { ClrFileInputContainer } from './file-input-container';
import { ClrFileInputValueAccessor } from './file-input-value-accessor';
import { selectFiles } from './file-input.helpers';

interface TestComponent {
  buttonLabel: string;
}

@Component({
  template: `
    <clr-file-input-container>
      <input type="file" name="model" [(ngModel)]="model" clrFileInput required />
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
})
class TemplateDrivenTest implements TestComponent {
  disabled = false;
  model: FileList;

  buttonLabel: string;
}

@Component({
  template: `
    <clr-file-input-container>
      <label>File</label>
      <input type="file" clrFileInput />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-file-input-container>
  `,
})
class NoNgControlTest {}

describe('ClrFileInputContainer', () => {
  const clrFileInputSelector = '.clr-file-input-wrapper [clrFileInput]';

  ContainerNoLabelSpec(ClrFileInputContainer, ClrFileInput, NoLabelTest);
  ReactiveSpec(ClrFileInputContainer, ClrFileInput, ReactiveTest, clrFileInputSelector);
  TemplateDrivenSpec(ClrFileInputContainer, ClrFileInput, TemplateDrivenTest, clrFileInputSelector);

  describe('reactive', () => {
    fileInputSpec(ReactiveTest);

    describe('FormControl disable state', () => {
      let fixture: ComponentFixture<ReactiveTest>;
      let browseButtonElement: HTMLButtonElement;
      let fileInputElement: HTMLInputElement;

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrIconModule],
          declarations: [ClrFileInputContainer, ClrFileInput, ClrFileInputValueAccessor, ReactiveTest],
        });

        fixture = TestBed.createComponent(ReactiveTest);
        browseButtonElement = fixture.nativeElement.querySelector('.clr-file-input-browse-button');
        fileInputElement = fixture.nativeElement.querySelector('input[type="file"]');
        fixture.detectChanges();
      });

      it('should disable the browse button when the control is disabled', () => {
        fixture.componentInstance.form.get('model').disable();
        fixture.detectChanges();

        expect(browseButtonElement.disabled).toBeTrue();
        expect(fileInputElement.disabled).toBeTrue();
      });

      it('should enable the browse button after disable() then enable()', () => {
        const control = fixture.componentInstance.form.get('model');
        control.disable();
        fixture.detectChanges();
        expect(browseButtonElement.disabled).toBeTrue();

        control.enable();
        fixture.detectChanges();
        expect(browseButtonElement.disabled).toBeFalse();
        expect(fileInputElement.disabled).toBeFalse();
      });
    });
  });

  describe('template-driven', () => {
    fileInputSpec(TemplateDrivenTest);

    describe('NgModel FormControl disable state', () => {
      let fixture: ComponentFixture<TemplateDrivenTest>;
      let browseButtonElement: HTMLButtonElement;
      let fileInputElement: HTMLInputElement;

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrIconModule],
          declarations: [ClrFileInputContainer, ClrFileInput, ClrFileInputValueAccessor, TemplateDrivenTest],
        });

        fixture = TestBed.createComponent(TemplateDrivenTest);
        browseButtonElement = fixture.nativeElement.querySelector('.clr-file-input-browse-button');
        fileInputElement = fixture.nativeElement.querySelector('input[type="file"]');
        fixture.detectChanges();
      });

      it('should disable the browse button when the NgModel FormControl is disabled', () => {
        const ngModel = fixture.debugElement.query(By.directive(NgModel)).injector.get(NgModel);
        ngModel.control.disable();
        fixture.detectChanges();

        expect(browseButtonElement.disabled).toBeTrue();
        expect(fileInputElement.disabled).toBeTrue();
      });

      it('should enable the browse button after disable() then enable() on the NgModel FormControl', () => {
        const ngModel = fixture.debugElement.query(By.directive(NgModel)).injector.get(NgModel);
        ngModel.control.disable();
        fixture.detectChanges();
        expect(browseButtonElement.disabled).toBeTrue();

        ngModel.control.enable();
        fixture.detectChanges();
        expect(browseButtonElement.disabled).toBeFalse();
        expect(fileInputElement.disabled).toBeFalse();
      });
    });
  });

  describe('without NgControl', () => {
    let fixture: ComponentFixture<NoNgControlTest>;
    let browseButtonElement: HTMLButtonElement;
    let fileInputElement: HTMLInputElement;

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrIconModule],
        declarations: [ClrFileInputContainer, ClrFileInput, ClrFileInputValueAccessor, NoNgControlTest],
      });

      fixture = TestBed.createComponent(NoNgControlTest);
      browseButtonElement = fixture.nativeElement.querySelector('.clr-file-input-browse-button');
      fileInputElement = fixture.nativeElement.querySelector('input[type="file"]');
      fixture.detectChanges();
    });

    it('should reflect native disabled on the browse button when there is no form control', () => {
      fileInputElement.disabled = true;
      fixture.detectChanges();

      expect(browseButtonElement.disabled).toBeTrue();
    });
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
      imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrIconModule],
      declarations: [ClrFileInputContainer, ClrFileInput, ClrFileInputValueAccessor, testComponent],
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
}
