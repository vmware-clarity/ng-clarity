/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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

  it('says nothing about requiredness when a value is optional', () => {
    expect(comboboxInput().hasAttribute('aria-required')).toBe(false);
  });

  it('does not stamp a meaningless aria-required class on the host', () => {
    // The host used to carry `class="aria-required"`, which no stylesheet defines and no
    // assistive technology reads — a `[class.…]` binding where `[attr.…]` was intended.
    expect(fixture.nativeElement.querySelector('clr-combobox').classList).not.toContain('aria-required');
  });
});
