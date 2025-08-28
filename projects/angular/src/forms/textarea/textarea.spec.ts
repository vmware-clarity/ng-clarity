/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { ClrTextarea } from './textarea';
import { ClrTextareaContainer } from './textarea-container';

@Component({
  template: `<textarea clrTextarea></textarea>`,
  standalone: false,
})
class StandaloneUseTest {}

@Component({
  template: `<textarea clrTextarea name="model" class="test-class" [(ngModel)]="model"></textarea>`,
  standalone: false,
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <textarea clrTextarea name="model" class="test-class" formControlName="model"></textarea>
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
  describe('Textarea directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(ClrTextareaContainer, ClrTextarea, TemplateDrivenTest, 'clr-textarea');
    ReactiveSpec(ClrTextareaContainer, ClrTextarea, ReactiveTest, 'clr-textarea');
  });
}
