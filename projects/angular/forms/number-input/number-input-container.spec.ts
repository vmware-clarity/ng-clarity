/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ClrCommonFormsModule,
  ControlIdService,
  LayoutService,
  MarkControlService,
  NgControlService,
} from '@clr/angular/forms/common';
import { ClrIcon } from '@clr/angular/icon';
import { ClrPopoverContent } from '@clr/angular/popover';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';
import { ClrNumberInputModule } from './number-input.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container';
import {
  ContainerChangeDetectionSpec,
  ContainerTestHostOptions,
  containerTestHosts,
  eachContainerHost,
} from '../tests/onpush-container';

@Component({
  template: `
    <clr-number-input-container>
      <input name="model" clrNumberInput type="number" required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Invalid</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-number-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-number-input-container>
      <input clrNumberInput type="number" name="model" [(ngModel)]="model" />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-number-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoLabelTest {
  model: number;
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-number-input-container>
        <input clrNumberInput type="number" formControlName="model" />
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Invalid</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-number-input-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

@Component({
  template: `
    <clr-number-input-container>
      <label>Test</label>
    </clr-number-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoInputTest {}

const hostOptions: ContainerTestHostOptions = {
  imports: [ClrNumberInputModule],
  container: 'clr-number-input-container',
  controlMarkup: '<input type="number" clrNumberInput [formControl]="control" />',
  initialValue: null,
  validValue: 5,
  validator: Validators.required,
};

describe('Number Input component', () => {
  describe('ClrNumberInput', () => {
    ContainerNoLabelSpec(ClrNumberInputContainer, ClrNumberInput, NoLabelTest);
    TemplateDrivenSpec(
      ClrNumberInputContainer,
      ClrNumberInput,
      SimpleTest,
      '.clr-number-input-wrapper [clrNumberInput]'
    );
    ReactiveSpec(ClrNumberInputContainer, ClrNumberInput, ReactiveTest, '.clr-number-input-wrapper  [clrNumberInput]');

    describe('host binding with missing input', () => {
      let fixture: ComponentFixture<NoInputTest>;
      let containerEl: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule, ClrPopoverContent],
          declarations: [ClrNumberInputContainer, NoInputTest],
          providers: [NgControlService, LayoutService, MarkControlService, ControlIdService],
        });
        fixture = TestBed.createComponent(NoInputTest);
        containerEl = fixture.debugElement.query(By.directive(ClrNumberInputContainer)).nativeElement;
      });

      it('should not throw when input ContentChild is undefined', () => {
        expect(() => renderFixture(fixture)).not.toThrow();
        expect(containerEl.classList.contains('clr-form-control-readonly')).toBe(false);
      });
    });
  });

  ContainerChangeDetectionSpec(hostOptions);

  describe('ClrNumberInputContainer change detection', () => {
    eachContainerHost('clr-number-input-container', containerTestHosts(hostOptions), context => {
      function stepButtons() {
        return Array.from(context().containerEl.querySelectorAll('button'));
      }

      it('shows the focus state while the input has focus', async () => {
        const { containerEl, settle } = context();
        const input = containerEl.querySelector('input');
        const group = containerEl.querySelector('.clr-input-group');

        input.dispatchEvent(new Event('focus'));
        await settle();
        expect(group.classList).toContain('clr-focus');

        input.dispatchEvent(new Event('blur'));
        await settle();
        expect(group.classList).not.toContain('clr-focus');
      });

      it('disables the step buttons when consumer code disables the control', async () => {
        const { host, settle } = context();

        host.control.disable();
        await settle();
        expect(stepButtons().map(button => button.disabled)).toEqual([true, true]);

        host.control.enable();
        await settle();
        expect(stepButtons().map(button => button.disabled)).toEqual([false, false]);
      });

      it('updates the control from the step buttons', async () => {
        const { host, settle } = context();
        host.control.setValue(5);
        await settle();

        stepButtons()[1].click();
        await settle();
        expect(host.control.value).toBe(6);
      });
    });
  });
});
