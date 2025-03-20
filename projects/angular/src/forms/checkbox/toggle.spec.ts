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

import { ClrCommonFormsModule } from '../common';
import { NgControlService } from '../common/providers/ng-control.service';
import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrCheckbox } from './checkbox';
import { ClrCheckboxWrapper } from './checkbox-wrapper';

@Component({
  template: `<input type="checkbox" clrToggle />`,
})
class StandaloneUseTest {}

@Component({
  template: `<input type="checkbox" clrToggle name="model" class="test-class" [(ngModel)]="model" />`,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="example">
      <input type="checkbox" clrToggle name="model" class="test-class" formControlName="model" />
    </form>
  `,
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required),
  });
}

export default function (): void {
  describe('ClrToggle directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrCheckboxWrapper, ClrCheckbox, TemplateDrivenTest, 'clr-checkbox');
    ReactiveSpec(ClrCheckboxWrapper, ClrCheckbox, ReactiveTest, 'clr-checkbox');
  });

  describe('a11y', () => {
    let fixture, containerDE, containerEl;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrCommonFormsModule, FormsModule],
        declarations: [ClrCheckbox, TemplateDrivenTest],
        providers: [NgControl, NgControlService],
      });

      fixture = TestBed.createComponent(TemplateDrivenTest);
      containerDE = fixture.debugElement.query(By.directive(ClrCheckbox));
      containerEl = containerDE.nativeElement;
      fixture.detectChanges();
    });

    it('should have role="switch" attribute', () => {
      expect(containerEl.getAttribute('role')).toBe('switch');
    });
  });
}
