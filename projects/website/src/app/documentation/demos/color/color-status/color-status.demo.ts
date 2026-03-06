/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlert, ClrAlertModule } from '@clr/angular';

import { COLOR_STATUS } from './color-status';
import { ColorExampleItemComponent } from '../../../../shared/color-example-item/color-example-item.component';

@Component({
  selector: 'clr-color-status',
  templateUrl: './color-status.demo.html',
  imports: [ColorExampleItemComponent, ClrAlertModule],
})
export class ColorStatusDemo {
  protected colorStatus = COLOR_STATUS;

  protected preventAlertClose(alert: ClrAlert) {
    alert.closed = false;
  }
}
