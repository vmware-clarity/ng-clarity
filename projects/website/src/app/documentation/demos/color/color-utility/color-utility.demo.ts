/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { COLOR_UTILITY } from './color-utility';
import { ColorExampleItemComponent } from '../../../../shared/color-example-item/color-example-item.component';

@Component({
  selector: 'clr-color-utility',
  templateUrl: './color-utility.demo.html',
  imports: [ColorExampleItemComponent],
})
export class ColorUtilityDemo {
  protected colorUtility = COLOR_UTILITY;
}
