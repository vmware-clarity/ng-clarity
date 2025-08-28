/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

class BasicReactiveDemo {
  model = new FormGroup({
    basic: new FormControl(''),
    container: new FormControl(''),
    required: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/asdfasdf/)]),
  });

  submit() {
    console.log(this);
  }
}

@Component({
  templateUrl: './reactive.html',
  standalone: false,
})
export class FormsReactiveDemo extends BasicReactiveDemo {}

@Component({
  templateUrl: './reactive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormsReactiveOnPushDemo extends BasicReactiveDemo {}
