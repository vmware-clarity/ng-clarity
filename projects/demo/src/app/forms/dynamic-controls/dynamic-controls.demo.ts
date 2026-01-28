/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm } from '@clr/angular';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'dynamic-controls-demo',
  templateUrl: './dynamic-controls.demo.html',
  standalone: false,
})
export class DynamicControlsDemo {
  destroyed = new Subject<void>();
  form = new FormGroup<any>({
    platform: new FormControl(),
    changeControl: new FormControl(),
    scenario: new FormControl('one'),
  });

  @ViewChild(ClrForm, { static: true }) clrForm!: ClrForm;

  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  constructor(private cd: ChangeDetectorRef) {}

  angularMarkAsTouched() {
    // It seems this starts working after the first time you call
    // clarityMarkAsTouched then reset;
    // this.exampleForm.reset();
    this.exampleForm.markAllAsTouched();
    this.exampleForm.updateValueAndValidity();
  }

  clarityMarkAsTouched() {
    this.clrForm.markAsTouched();
  }

  reset() {
    this.exampleForm.reset();
  }

  ngOnInit() {
    this.form
      .get('platform')
      ?.valueChanges.pipe(
        filter(value => value === 'two'),
        tap(() => {
          this.form.addControl('textarea', new FormControl('test'));
          this.form.get('textarea')?.markAsTouched();
          this.form.get('textarea')?.updateValueAndValidity();

          this.form.addControl('radios', new FormControl('', [Validators.required, Validators.pattern(/two/)]));
          this.form.get('radios')?.markAsTouched();
          this.form.get('radios')?.updateValueAndValidity();
        }),
        takeUntil(this.destroyed)
      )
      .subscribe();

    this.form
      .get('changeControl')
      ?.valueChanges.pipe(
        filter(value => value === 'two'),
        tap(() => {
          this.form.addControl('textarea1', new FormControl(''));
          this.form.get('textarea1')?.markAsTouched();
          this.form.get('textarea1')?.updateValueAndValidity();
        }),
        takeUntil(this.destroyed)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
