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
    </form>
  `,
  standalone: false,
})
class TestComponent {
  form = new FormGroup({
    host: new FormControl('', Validators.required),
    notes: new FormControl(''),
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
});
