/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './input.demo.html',
})
export class InputDemo {
  disabled = true;
  vertical = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  horizontal = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  compact = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  override = '';
  noform = '';
}
