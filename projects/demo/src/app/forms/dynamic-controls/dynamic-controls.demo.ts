/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'dynamic-controls-demo',
  templateUrl: './dynamic-controls.demo.html',
})
export class DynamicControlsDemo {
  destroyed = new Subject();
  form = new FormGroup<any>({
    platform: new FormControl(),
    scenario: new FormControl('one'),
  });

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.form
      .get('platform')
      ?.valueChanges.pipe(
        filter(value => value === 'two'),
        tap(() => {
          this.form.addControl('control', new FormControl('test'));
          this.form.get('control')?.markAsTouched();
          this.form.get('control')?.updateValueAndValidity();
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
