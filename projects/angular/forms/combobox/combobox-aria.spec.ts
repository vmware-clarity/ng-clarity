/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrComboboxModule } from './combobox.module';

@Component({
  template: `
    <clr-combobox [formControl]="fruit">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TestComponent {
  fruit = new FormControl<string | null>(null);
}

describe('ClrCombobox required state', () => {
  let fixture: ComponentFixture<TestComponent>;

  function comboboxInput(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="combobox"]');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('tells assistive technology when a value is required', () => {
    fixture.componentInstance.fruit = new FormControl<string | null>(null, Validators.required);
    fixture.detectChanges();

    expect(comboboxInput().getAttribute('aria-required')).toBe('true');
  });

  it('reports the field invalid once touched while a required value is missing', () => {
    fixture.componentInstance.fruit = new FormControl<string | null>(null, Validators.required);
    fixture.detectChanges();
    fixture.componentInstance.fruit.markAsTouched();
    fixture.detectChanges();
    expect(comboboxInput().getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.fruit.setValue('apple');
    fixture.detectChanges();
    expect(comboboxInput().hasAttribute('aria-invalid')).toBe(false);
  });

  it('says nothing about requiredness when a value is optional', () => {
    expect(comboboxInput().hasAttribute('aria-required')).toBe(false);
  });

  it('keeps the deprecated aria-required host class for applications that relied on it, and reports the state as ARIA', () => {
    // The class has never meant that a value is required; it stays until a major release
    // so that styles or queries written against it do not break.
    const host = fixture.nativeElement.querySelector('clr-combobox');
    expect(host.classList).toContain('aria-required');
    expect(host.hasAttribute('aria-required')).toBeFalse();
  });
});

@Component({
  template: `
    <clr-combobox [(ngModel)]="fruit" [required]="mandatory">
      <clr-options>
        <clr-option clrValue="apple">Apple</clr-option>
      </clr-options>
    </clr-combobox>
  `,
  standalone: false,
})
class TemplateDrivenTestComponent {
  fruit: string | null = null;
  mandatory = true;
}

describe('ClrCombobox required state, template-driven', () => {
  let fixture: ComponentFixture<TemplateDrivenTestComponent>;

  function comboboxInput(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="combobox"]');
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrComboboxModule, FormsModule, NoopAnimationsModule],
      declarations: [TemplateDrivenTestComponent],
    });
    fixture = TestBed.createComponent(TemplateDrivenTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('recognises a [required] binding, which writes no attribute and registers no Validators.required', () => {
    expect(comboboxInput().getAttribute('aria-required')).toBe('true');
  });

  it('drops the requirement when the binding turns false', async () => {
    fixture.componentInstance.mandatory = false;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(comboboxInput().hasAttribute('aria-required')).toBe(false);
  });

  it('does not call the field invalid before the user has touched it, like every other control', () => {
    expect(comboboxInput().hasAttribute('aria-invalid')).toBe(false);
  });
});
