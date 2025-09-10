/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './file.html',
  standalone: false,
})
export class FormsFileDemo {
  readonly form = new FormGroup({
    file: new FormControl(),
  });

  readonly advancedForm = new FormGroup({
    files: new FormControl(),
  });
}
