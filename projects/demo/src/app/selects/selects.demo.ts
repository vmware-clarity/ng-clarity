/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './selects.demo.html',
  standalone: false,
})
export class SelectsDemo {
  disabled = true;
  vertical = {
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
  };
  horizontal = {
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
  };
  compact = {
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: '',
  };
}
