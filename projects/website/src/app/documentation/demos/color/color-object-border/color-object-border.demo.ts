/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { COLOR_OBJECT_BORDER } from './color-object-border';
import { ColorExampleItemComponent } from '../../../../shared/color-example-item/color-example-item.component';

@Component({
  selector: 'clr-color-object-border',
  templateUrl: './color-object-border.demo.html',
  imports: [ColorExampleItemComponent],
})
export class ColorObjectBorderDemo {
  protected colorObjectBorder = COLOR_OBJECT_BORDER;
}
