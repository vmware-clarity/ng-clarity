/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: './radios.demo.html',
})
export class RadiosDemo {
  disabled = true;
  vertical = {
    one: '',
    two: '',
    three: 'three',
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
}
