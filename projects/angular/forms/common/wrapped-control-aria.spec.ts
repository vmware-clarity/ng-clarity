/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrInputModule } from '../input/input.module';

@Component({
  template: `
    <form clrForm [formGroup]="form">
      <clr-input-container>
        <label>Host name</label>
        <input clrInput formControlName="host" />
      </clr-input-container>
      <clr-input-container>
        <label>Notes</label>
        <input clrInput formControlName="notes" />
      </clr-input-container>
      <clr-input-container>
        <label>Authored</label>
        <input clrInput formControlName="authored" aria-invalid="grammar" aria-required="false" />
      </clr-input-container>
      <clr-input-container>
        <label>Bound</label>
        <input clrInput formControlName="bound" [attr.aria-invalid]="boundInvalid" />
      </clr-input-container>
      <clr-input-container>
        <label>Authored required</label>
        <input clrInput formControlName="authoredRequired" aria-required="true" />
      </clr-input-container>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  boundInvalid: string | null = 'spelling';
  form = new FormGroup({
    host: new FormControl('', Validators.required),
    notes: new FormControl(''),
    authored: new FormControl('', Validators.required),
    bound: new FormControl('', Validators.required),
    authoredRequired: new FormControl(''),
  });
}

describe('Wrapped form control, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  function input(name: string): HTMLElement {
    return fixture.nativeElement.querySelector(`input[formcontrolname="${name}"]`);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrInputModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('tells assistive technology that a value is required', () => {
    // The control has no `required` attribute, so without this nothing conveys it.
    expect(input('host').getAttribute('aria-required')).toBe('true');
  });

  it('keeps aria-invalid and aria-required the author wrote, rather than overwriting them', () => {
    fixture.componentInstance.form.get('authored')?.markAsTouched();
    fixture.detectChanges();

    expect(input('authored').getAttribute('aria-required')).toBe('false');
    expect(input('authored').getAttribute('aria-invalid')).toBe('grammar');
  });

  it('says nothing about requiredness for an optional control', () => {
    expect(input('notes').hasAttribute('aria-required')).toBe(false);
  });

  it('does not call a control invalid before the user has touched it', () => {
    expect(input('host').hasAttribute('aria-invalid')).toBe(false);
  });

  it('reports a control as invalid once the user has touched it, matching when the error shows', () => {
    fixture.componentInstance.form.controls.host.markAsTouched();
    fixture.detectChanges();

    expect(input('host').getAttribute('aria-invalid')).toBe('true');
  });

  it('stops reporting invalid once the control becomes valid', () => {
    fixture.componentInstance.form.controls.host.markAsTouched();
    fixture.componentInstance.form.controls.host.setValue('esx-prod-04');
    fixture.detectChanges();

    expect(input('host').hasAttribute('aria-invalid')).toBe(false);
  });

  it('keeps aria-invalid the application binds, rather than its own computed value', () => {
    // Untouched, the control itself would report nothing.
    expect(input('bound').getAttribute('aria-invalid')).toBe('spelling');

    fixture.componentInstance.form.controls.bound.markAsTouched();
    fixture.detectChanges();
    expect(input('bound').getAttribute('aria-invalid')).toBe('spelling');
  });

  it('keeps following aria-invalid the application binds when it changes later', () => {
    fixture.componentInstance.boundInvalid = 'false';
    fixture.componentInstance.form.controls.bound.markAsTouched();
    fixture.detectChanges();
    // Touched and invalid, the control itself would report 'true'.
    expect(input('bound').getAttribute('aria-invalid')).toBe('false');

    fixture.componentInstance.boundInvalid = null;
    fixture.detectChanges();
    expect(input('bound').hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.boundInvalid = 'grammar';
    fixture.componentInstance.form.controls.bound.setValue('fixed');
    fixture.detectChanges();
    expect(input('bound').getAttribute('aria-invalid')).toBe('grammar');
  });

  it('keeps aria-required the author wrote on an otherwise optional control', () => {
    fixture.detectChanges();

    expect(input('authoredRequired').getAttribute('aria-required')).toBe('true');
  });

  it('reports its own aria-invalid and aria-required when the author wrote neither', () => {
    fixture.componentInstance.form.controls.host.markAsTouched();
    fixture.detectChanges();
    expect(input('host').getAttribute('aria-invalid')).toBe('true');
    expect(input('host').getAttribute('aria-required')).toBe('true');

    fixture.componentInstance.form.controls.host.setValue('esx-prod-04');
    fixture.componentInstance.form.controls.host.clearValidators();
    fixture.componentInstance.form.controls.host.updateValueAndValidity();
    fixture.detectChanges();
    expect(input('host').hasAttribute('aria-invalid')).toBe(false);
    expect(input('host').hasAttribute('aria-required')).toBe(false);
  });
});
