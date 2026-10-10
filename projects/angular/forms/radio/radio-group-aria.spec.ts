/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrRadioModule } from './radio.module';

function render<T>(component: Type<T>, imports: unknown[]): ComponentFixture<T> {
  TestBed.configureTestingModule({ imports: [...imports, NoopAnimationsModule], declarations: [component] });
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

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

// Without an enclosing form each standalone ngModel radio has its own control, and only
// the last one carries the required validator.
@Component({
  template: `
    <clr-radio-container>
      <label>Size</label>
      <clr-radio-wrapper>
        <input type="radio" clrRadio [(ngModel)]="size" [ngModelOptions]="{ standalone: true }" value="small" />
        <label>Small</label>
      </clr-radio-wrapper>
      <clr-radio-wrapper>
        <input
          type="radio"
          clrRadio
          [(ngModel)]="size"
          [ngModelOptions]="{ standalone: true }"
          value="large"
          required
        />
        <label>Large</label>
      </clr-radio-wrapper>
      <clr-control-error>Pick a size</clr-control-error>
    </clr-radio-container>
  `,
  standalone: false,
})
class StandaloneNgModelComponent {
  size: string | null = null;
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
    fixture = render(TestComponent, [ClrRadioModule, ReactiveFormsModule]);
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
    const fixture = render(AuthoredComponent, [ClrRadioModule, ReactiveFormsModule]);
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

describe('Radio group of standalone ngModel radios', () => {
  it('reports the group as required and invalid when a radio other than the first is', async () => {
    const fixture = render(StandaloneNgModelComponent, [ClrRadioModule, FormsModule]);
    await fixture.whenStable();
    fixture.detectChanges();
    const group: HTMLElement = fixture.nativeElement.querySelector('clr-radio-container');
    const models = fixture.debugElement.queryAll(By.directive(NgModel)).map(debug => debug.injector.get(NgModel));

    expect(models.length).toBe(2);
    expect(models[0].control).not.toBe(models[1].control);
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(group.hasAttribute('aria-invalid')).toBe(false);

    // Shift+Tab into the group lands on the last radio, and leaving it touches only that one.
    models[1].control.markAsTouched();
    fixture.detectChanges();
    expect(group.getAttribute('aria-invalid')).toBe('true');
    fixture.destroy();
  });
});

@Component({
  template: `
    <form clrForm [formGroup]="form">
      <clr-radio-container>
        <label>Later</label>
        @if (show) {
          <clr-radio-wrapper>
            <input type="radio" clrRadio formControlName="later" value="yes" />
            <label>Yes</label>
          </clr-radio-wrapper>
        }
      </clr-radio-container>
    </form>
  `,
  standalone: false,
})
class LateRadiosComponent {
  show = false;
  form = new FormGroup({ later: new FormControl<string | null>(null, Validators.required) });
}

describe('Radio group whose radios render after it', () => {
  it('reports no requirement or validity on a container that has no radiogroup role', () => {
    const fixture = render(LateRadiosComponent, [ClrRadioModule, ReactiveFormsModule]);
    fixture.componentInstance.show = true;
    fixture.detectChanges();
    fixture.componentInstance.form.controls.later.markAsTouched();
    fixture.detectChanges();
    const group: HTMLElement = fixture.nativeElement.querySelector('clr-radio-container');

    expect(group.hasAttribute('role')).toBe(false);
    expect(group.hasAttribute('aria-required')).toBe(false);
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    fixture.destroy();
  });
});
