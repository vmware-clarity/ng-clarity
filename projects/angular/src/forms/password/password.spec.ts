/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  IfControlStateService,
  LayoutService,
  NgControlService,
} from '@clr/angular/src/forms/common';
import { ClrIcon } from '@clr/angular/src/icon';

import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';
import { ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';

@Component({
  template: `<input type="password" clrPassword />`,
  standalone: false,
})
class InvalidUseTest {}

@Component({
  template: `
    <clr-password-container>
      <input type="text" clrPassword class="test-class" name="model" [(ngModel)]="model" />
      <clr-control-success>Valid</clr-control-success>
    </clr-password-container>
  `,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <clr-password-container>
        <input clrPassword class="test-class" formControlName="model" />
        <clr-control-success>Valid</clr-control-success>
      </clr-password-container>
    </div>
  `,
  standalone: false,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('ClrPassword', () => {
    describe('invalid use', () => {
      it('should throw an error when used without a password container', () => {
        TestBed.configureTestingModule({
          imports: [ClrPassword],
          declarations: [InvalidUseTest],
        });
        expect(() => {
          const fixture = TestBed.createComponent(InvalidUseTest);
          fixture.detectChanges();
        }).toThrow();
      });
    });
    TemplateDrivenSpec(ClrPasswordContainer, ClrPassword, TemplateDrivenTest, 'clr-input');
    ReactiveSpec(ClrPasswordContainer, ClrPassword, ReactiveTest, 'clr-input');

    describe('set password type', () => {
      let fixture, containerDE, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
          declarations: [ClrPasswordContainer, ClrPassword, TemplateDrivenTest],
          providers: [IfControlStateService, NgControl, NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);
        containerDE = fixture.debugElement.query(By.directive(ClrPasswordContainer));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('should set the password type attribute', () => {
        expect(containerEl.querySelector('input').type).toEqual('password');
      });
    });
  });
}
