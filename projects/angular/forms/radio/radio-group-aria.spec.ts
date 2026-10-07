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

import { ClrRadioModule } from './radio.module';

@Component({
  template: `
    <form clrForm [formGroup]="form">
      <clr-radio-container>
        <label>Tier</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="tier" value="gold" />
          <label>Gold</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="tier" value="silver" />
          <label>Silver</label>
        </clr-radio-wrapper>
        <clr-control-error>Pick a tier</clr-control-error>
      </clr-radio-container>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  form = new FormGroup({
    tier: new FormControl<string | null>(null, Validators.required),
  });
}

@Component({
  template: `
    <form clrForm [formGroup]="form">
      <clr-radio-container aria-required="true" aria-invalid="false">
        <label>Plan</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="plan" value="monthly" />
          <label>Monthly</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-radio-container>
        <label>Region</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="region" value="eu" />
          <label>EU</label>
        </clr-radio-wrapper>
      </clr-radio-container>
    </form>
  `,
  standalone: false,
})
class AuthoredComponent {
  form = new FormGroup({
    plan: new FormControl<string | null>(null),
    region: new FormControl<string | null>(null, Validators.required),
  });
}

describe('Radio group, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  function group(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-radio-container');
  }

  function radios(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrRadioModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('reports the requirement once, on the radiogroup, rather than on every radio', () => {
    expect(group().getAttribute('role')).toBe('radiogroup');
    expect(group().getAttribute('aria-required')).toBe('true');
    expect(radios().every(radio => !radio.hasAttribute('aria-required'))).toBe(true);
  });

  it('does not call the group invalid before the user has touched it', () => {
    expect(group().hasAttribute('aria-invalid')).toBe(false);
    expect(radios().every(radio => !radio.hasAttribute('aria-invalid'))).toBe(true);
  });

  it('reports the group as invalid once touched, again on the group and not on each radio', () => {
    fixture.componentInstance.form.controls.tier.markAsTouched();
    fixture.detectChanges();

    expect(group().getAttribute('aria-invalid')).toBe('true');
    expect(radios().every(radio => !radio.hasAttribute('aria-invalid'))).toBe(true);
  });
});

describe('Radio group ARIA the application wrote', () => {
  it('keeps aria-required and aria-invalid written on the group, and reports invalid without an error message', () => {
    TestBed.configureTestingModule({
      imports: [ClrRadioModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [AuthoredComponent],
    });
    const fixture = TestBed.createComponent(AuthoredComponent);
    fixture.detectChanges();
    const [authored, region] = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-radio-container'));

    expect(authored.getAttribute('aria-required')).toBe('true');
    expect(authored.getAttribute('aria-invalid')).toBe('false');

    // No clr-control-error is projected: the group is still invalid once touched.
    fixture.componentInstance.form.controls.region.markAsTouched();
    fixture.detectChanges();
    expect(region.getAttribute('aria-invalid')).toBe('true');
    fixture.destroy();
  });
});
