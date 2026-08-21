/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, Validators } from '@angular/forms';
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

import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

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
  standalone: false,
})
class NoLabelTest {
  model;
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
  standalone: false,
})
class NoInputTest {}

export default function (): void {
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
      let fixture, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule, ClrPopoverContent],
          declarations: [ClrNumberInputContainer, NoInputTest],
          providers: [NgControl, NgControlService, LayoutService, MarkControlService, ControlIdService],
        });
        fixture = TestBed.createComponent(NoInputTest);
        containerEl = fixture.debugElement.query(By.directive(ClrNumberInputContainer)).nativeElement;
      });

      it('should not throw when input ContentChild is undefined', () => {
        expect(() => fixture.detectChanges()).not.toThrow();
        expect(containerEl.classList.contains('clr-form-control-readonly')).toBeFalse();
      });
    });
  });
}
