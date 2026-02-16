/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { COLOR_TYPE } from './color-type';

@Component({
  selector: 'clr-color-type',
  templateUrl: './color-type.demo.html',
  standalone: false,
})
export class ColorTypeDemo {
  protected colorType = COLOR_TYPE;
}
