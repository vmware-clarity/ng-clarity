/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { ClrCommonFormsModule } from './common.module';
import { ClrForm } from './form';
import { ClrFormLayout } from './providers/layout.service';

/**
 * OnPush hosts that never mark themselves dirty: every change below comes from consumer code outside a template
 * event (an HTTP callback, a submit handler), so only the library's own signals can refresh the container.
 */
@Component({
  template: `
    <form clrForm>
      <clr-control-container>
        @if (showLabel()) {
          <label>Name</label>
        }
        <input clrControl [formControl]="control()" />
        <clr-control-helper>Helper</clr-control-helper>
        @if (showError()) {
          <clr-control-error>Required</clr-control-error>
        }
        <clr-control-success>Valid</clr-control-success>
      </clr-control-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrCommonFormsModule, ReactiveFormsModule],
})
class ReactiveHost {
  readonly control = signal(new FormControl('', Validators.required));
  readonly showLabel = signal(true);
  readonly showError = signal(true);
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-control-container>
        <label>Name</label>
        <input clrControl formControlName="name" />
        <clr-control-error>Required</clr-control-error>
      </clr-control-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrCommonFormsModule, ReactiveFormsModule],
})
class FormControlNameHost {
  readonly form = new FormGroup({ name: new FormControl('', Validators.required) });
}

@Component({
  template: `
    <clr-control-container>
      <label>Name</label>
      <input clrControl name="name" required [(ngModel)]="name" [disabled]="disabled()" />
      <clr-control-error>Required</clr-control-error>
    </clr-control-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrCommonFormsModule, FormsModule],
})
class TemplateDrivenHost {
  name = '';
  readonly disabled = signal(false);
}

describe('ClrControlContainer (zoneless, OnPush host)', () => {
  // Other spec files declare the subtexts in their own testing modules. Importing the module here gives them
  // their module scope back, because the browser test files share one environment.
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrCommonFormsModule] });
  });

  function container(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.nativeElement.querySelector('clr-control-container');
  }

  function controlContainer(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.nativeElement.querySelector('.clr-control-container');
  }

  /** The label and the subtexts that are shown. */
  function text(fixture: ComponentFixture<unknown>): string {
    return Array.from(container(fixture).querySelectorAll('label, .clr-subtext'))
      .map(element => element.textContent.trim())
      .filter(Boolean)
      .join(' ');
  }

  describe('reactive', () => {
    let fixture: ComponentFixture<ReactiveHost>;
    let host: ReactiveHost;

    beforeEach(async () => {
      fixture = TestBed.createComponent(ReactiveHost);
      host = fixture.componentInstance;
      await fixture.whenStable();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('shows the error when the control is touched from consumer code', async () => {
      expect(text(fixture)).toBe('Name Helper');

      host.control().markAsTouched();
      await fixture.whenStable();

      expect(controlContainer(fixture).classList).toContain('clr-error');
      expect(text(fixture)).toBe('Name Helper Required');
    });

    it('shows success when the value is set from consumer code', async () => {
      host.control().markAsTouched();
      await fixture.whenStable();

      host.control().setValue('Ada');
      await fixture.whenStable();

      expect(controlContainer(fixture).classList).toContain('clr-success');
      expect(controlContainer(fixture).classList).not.toContain('clr-error');
      expect(text(fixture)).toBe('Name Helper Valid');
    });

    it('marks the container disabled when the control is disabled from consumer code', async () => {
      host.control().disable();
      await fixture.whenStable();
      expect(container(fixture).classList).toContain('clr-form-control-disabled');

      host.control().enable();
      await fixture.whenStable();
      expect(container(fixture).classList).not.toContain('clr-form-control-disabled');
    });

    it('updates when errors are set from consumer code', async () => {
      host.control().setValue('Ada');
      host.control().markAsTouched();
      await fixture.whenStable();
      expect(controlContainer(fixture).classList).toContain('clr-success');

      host.control().setErrors({ taken: true });
      await fixture.whenStable();

      expect(controlContainer(fixture).classList).toContain('clr-error');
    });

    it('describes the input by the error text when invalid', async () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-describedby')).not.toContain('-error');

      host.control().markAsTouched();
      await fixture.whenStable();

      expect(input.getAttribute('aria-describedby')).toContain('-error');
    });

    it('marks the controls touched when the form is marked from a submit handler', async () => {
      const form: ClrForm = fixture.debugElement.children[0].injector.get(ClrForm);

      form.markAsTouched();
      await fixture.whenStable();

      expect(controlContainer(fixture).classList).toContain('clr-error');
    });

    it('follows the layout set after the first render', async () => {
      const form: ClrForm = fixture.debugElement.children[0].injector.get(ClrForm);
      expect(container(fixture).classList).toContain('clr-row');

      form.layoutService.layout = ClrFormLayout.VERTICAL;
      await fixture.whenStable();

      expect(container(fixture).classList).not.toContain('clr-row');
      expect(fixture.nativeElement.querySelector('form').classList).not.toContain('clr-form-horizontal');
    });

    it('shows a late error message', async () => {
      host.showError.set(false);
      await fixture.whenStable();
      host.control().markAsTouched();
      await fixture.whenStable();
      expect(text(fixture)).toBe('Name Helper');

      host.showError.set(true);
      await fixture.whenStable();

      expect(text(fixture)).toBe('Name Helper Required');
    });

    it('adds the grid placeholder label when the label is removed', async () => {
      expect(container(fixture).querySelectorAll('label').length).toBe(1);

      host.showLabel.set(false);
      await fixture.whenStable();

      const labels = container(fixture).querySelectorAll('label');
      expect(labels.length).toBe(1);
      expect(labels[0].textContent).toBe('');
    });

    it('follows a replaced control and ignores the previous one', async () => {
      const previous = host.control();
      const next = new FormControl('Ada', Validators.required);
      next.markAsTouched();

      host.control.set(next);
      await fixture.whenStable();
      expect(controlContainer(fixture).classList).toContain('clr-success');

      previous.markAsTouched();
      await fixture.whenStable();
      expect(controlContainer(fixture).classList).toContain('clr-success');

      next.setValue('');
      await fixture.whenStable();
      expect(controlContainer(fixture).classList).toContain('clr-error');
    });

    it('stops following the control when destroyed', () => {
      // `events` is backed by a private Subject; it has no observers once nothing follows the control.
      const events = (host.control() as unknown as { _events: Subject<unknown> })._events;
      expect(events.observed).toBe(true);

      fixture.destroy();

      expect(events.observed).toBe(false);
    });
  });

  describe('formControlName', () => {
    it('follows the control resolved by the form group', async () => {
      const fixture = TestBed.createComponent(FormControlNameHost);
      await fixture.whenStable();

      fixture.componentInstance.form.markAllAsTouched();
      await fixture.whenStable();

      expect(controlContainer(fixture).classList).toContain('clr-error');
      expect(text(fixture)).toBe('Name Required');
      fixture.destroy();
    });
  });

  describe('template-driven', () => {
    it('follows the disabled input and the model value', async () => {
      const fixture = TestBed.createComponent(TemplateDrivenHost);
      await fixture.whenStable();

      fixture.componentInstance.disabled.set(true);
      await fixture.whenStable();
      expect(container(fixture).classList).toContain('clr-form-control-disabled');

      fixture.componentInstance.disabled.set(false);
      await fixture.whenStable();
      fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      expect(text(fixture)).toBe('Name Required');
      fixture.destroy();
    });
  });
});
