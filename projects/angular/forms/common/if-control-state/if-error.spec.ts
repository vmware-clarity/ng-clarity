/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrInput, ClrInputContainer } from '@clr/angular/forms/input';
import { ClrIcon } from '@clr/angular/icon';
import { delay } from '@clr/angular/testing';

import { ClrIfError } from './if-error';
import { ClrControlError } from '../control-subtexts/error';
import { ClrForm } from '../form';
import { NgControlService } from '../providers/ng-control.service';

const errorMessage = 'ERROR_MESSAGE';
const minLengthMessage = 'MIN_LENGTH_MESSAGE';
const maxLengthMessage = 'MAX_LENGTH_MESSAGE';

@Component({
  template: ` <div *clrIfError></div>`,
  standalone: false,
})
class InvalidUseTest {}

@Component({
  template: ` <clr-control-error *clrIfError>${errorMessage}</clr-control-error>`,
  providers: [NgControlService],
  standalone: false,
})
class GeneralErrorTest {}

@Component({
  template: `
    <clr-control-error *clrIfError="'required'">${errorMessage}</clr-control-error>
    <clr-control-error *clrIfError="'minlength'">${minLengthMessage}</clr-control-error>
    <clr-control-error *clrIfError="'maxlength'; error as err">
      ${maxLengthMessage}-{{ err.requiredLength }}-{{ err.actualLength }}
    </clr-control-error>
  `,
  providers: [NgControlService],
  standalone: false,
})
class SpecificErrorTest {}

@Component({
  template: `
    <form clrForm [formGroup]="undefinedErrorForm" (ngSubmit)="onSubmit()">
      <clr-input-container>
        <label>Password</label>
        <input clrInput formControlName="password" />
        <clr-control-error *clrIfError="'required'"> Input is required</clr-control-error>
        <clr-control-error *clrIfError="'maxlength'">
          The value must be shorter than {{ maxLength }} characters.
        </clr-control-error>
        <clr-control-error *clrIfError="'minlength'; error as err">
          Must be at least {{ err.requiredLength }} characters
        </clr-control-error>
      </clr-input-container>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `,
  providers: [NgControlService],
  standalone: false,
})
class DynamicErrorTypeTest implements OnInit {
  readonly maxLength = 10;
  readonly minLength = 8;
  undefinedErrorForm: FormGroup = new FormGroup({
    password: new FormControl('', []),
  });

  ngOnInit() {
    if (this.undefinedErrorForm) {
      const ctrl = this.undefinedErrorForm.get('password');
      ctrl.setValidators([
        Validators.required,
        Validators.maxLength(this.maxLength),
        Validators.minLength(this.minLength),
      ]);
      ctrl.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.undefinedErrorForm.markAllAsTouched();
    const controlNames = Object.keys(this.undefinedErrorForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      this.undefinedErrorForm.controls[controlNames[i]].updateValueAndValidity();
    }
  }
}

export default function (): void {
  describe('ClrIfError', () => {
    describe('invalid use', () => {
      it('throws error when used outside of a control container', () => {
        TestBed.configureTestingModule({ declarations: [ClrIfError, InvalidUseTest] });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });

    describe('general error', () => {
      let fixture, ngControlService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, FormsModule],
          declarations: [ClrInput, ClrControlError, ClrInputContainer, ClrIfError, GeneralErrorTest],
        });
        fixture = TestBed.createComponent(GeneralErrorTest);
        fixture.detectChanges();
        ngControlService = fixture.debugElement.injector.get(NgControlService);
      });

      it('hides the error initially', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
      });

      it('displays the error message after touched on general errors', async () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('', Validators.required);
        control.markAsTouched();
        ngControlService.addControl(control);
        control.markAsTouched();
        fixture.detectChanges();
        await delay();
        expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
      });
    });

    describe('specific error', () => {
      let fixture, ngControlService;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, FormsModule],
          declarations: [ClrInput, ClrControlError, ClrInputContainer, ClrIfError, SpecificErrorTest],
        });
        fixture = TestBed.createComponent(SpecificErrorTest);
        fixture.detectChanges();
        ngControlService = fixture.debugElement.injector.get(NgControlService);
      });

      it('hides the error initially', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
      });

      it('displays the error when the specific error is defined', async () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('', [Validators.required, Validators.minLength(5)]);
        ngControlService.addControl(control);
        control.markAsTouched();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
      });

      it('hides the message even when it is invalid due to a different validation error', async () => {
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        const control = new FormControl('abc', [Validators.required, Validators.minLength(5)]);
        ngControlService.addControl(control);
        control.markAsTouched();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).toContain(minLengthMessage);
      });

      it('displays the error message with values from error object in context', async () => {
        const control = new FormControl('abcdef', [Validators.maxLength(5)]);
        ngControlService.addControl(control);
        control.markAsTouched();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(`${maxLengthMessage}-5-6`);
      });

      it('updates the error message with values from error object in context', async () => {
        const control = new FormControl('abcdef', [Validators.maxLength(5)]);
        ngControlService.addControl(control);
        control.markAsTouched();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(`${maxLengthMessage}-5-6`);

        control.setValue('abcdefg');
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain(`${maxLengthMessage}-5-7`);
      });

      it('should show error only when they are required', async () => {
        const control = new FormControl(undefined, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(5),
        ]);
        control.markAsTouched();
        ngControlService.addControl(control);
        control.markAsTouched();
        await delay();
        fixture.detectChanges();

        // Required message
        expect(fixture.nativeElement.innerHTML).toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(minLengthMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(maxLengthMessage);

        // MinLength message
        control.setValue('abc');
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).toContain(minLengthMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(maxLengthMessage);

        // MaxLength message
        control.setValue('abcdef');
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(minLengthMessage);
        expect(fixture.nativeElement.innerHTML).toContain(maxLengthMessage);

        // No errors
        control.setValue('abcde');
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain(errorMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(minLengthMessage);
        expect(fixture.nativeElement.innerHTML).not.toContain(maxLengthMessage);
      });
    });

    describe('dynamic error input (CDE-3109 / CDE-3111 regression)', () => {
      let fixture: ComponentFixture<DynamicErrorTypeTest>;
      let component: DynamicErrorTypeTest;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, FormsModule, ReactiveFormsModule],
          declarations: [ClrForm, ClrInput, ClrControlError, ClrInputContainer, ClrIfError, DynamicErrorTypeTest],
        });
        fixture = TestBed.createComponent(DynamicErrorTypeTest);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      // Correct errors ARE shown after validators are applied dynamically and no error in console (CDE-3109)
      it('hides all errors initially before the form is interacted with', () => {
        expect(fixture.nativeElement.innerHTML).not.toContain('Input is required');
        expect(fixture.nativeElement.innerHTML).not.toContain(`shorter than ${component.maxLength} characters`);
        expect(fixture.nativeElement.innerHTML).not.toContain(`Must be at least ${component.minLength} characters`);
      });

      it('hides all errors when the value satisfies all validators after submit', async () => {
        fixture.componentInstance.undefinedErrorForm.get('password').setValue('abcdefgh');
        fixture.componentInstance.onSubmit();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain('Input is required');
        expect(fixture.nativeElement.innerHTML).not.toContain(`shorter than ${component.maxLength} characters`);
        expect(fixture.nativeElement.innerHTML).not.toContain(`Must be at least ${component.minLength} characters`);
      });

      // Only the matching error is shown, not all errors at once (CDE-3111)
      it('does not show minlength or maxlength errors when only the required error is active', async () => {
        fixture.componentInstance.onSubmit();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).toContain('Input is required');
        expect(fixture.nativeElement.innerHTML).not.toContain(`shorter than ${component.maxLength} characters`);
        expect(fixture.nativeElement.innerHTML).not.toContain(`Must be at least ${component.maxLength} characters`);
      });

      it('does not show required or maxlength errors when only the minlength error is active', async () => {
        fixture.componentInstance.undefinedErrorForm.get('password').setValue('abc');
        fixture.componentInstance.onSubmit();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain('Input is required');
        expect(fixture.nativeElement.innerHTML).not.toContain(`shorter than ${component.maxLength} characters`);
        expect(fixture.nativeElement.innerHTML).toContain(`Must be at least ${component.minLength} characters`);
      });

      it('does not show required or minlength errors when only the maxlength error is active', async () => {
        fixture.componentInstance.undefinedErrorForm.get('password').setValue('abcdefghijk');
        fixture.componentInstance.onSubmit();
        await delay();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toContain('Input is required');
        expect(fixture.nativeElement.innerHTML).toContain(`shorter than ${component.maxLength} characters`);
        expect(fixture.nativeElement.innerHTML).not.toContain(`Must be at least ${component.minLength} characters`);
      });
    });
  });
}
