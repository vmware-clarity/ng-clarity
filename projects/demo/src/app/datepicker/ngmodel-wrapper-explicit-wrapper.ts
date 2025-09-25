/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const DATE1 = '01/02/2015';
const DATE2 = '05/05/2017';

@Component({
  selector: 'clr-ng-model-wrapped-present-datepicker-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './ngmodel-wrapper-explicit-wrapper.html',
  standalone: false,
})
export class NgModelExplicitWrapperDemo {
  model: string = DATE1;

  updateDate(): void {
    if (this.model === DATE1) {
      this.model = DATE2;
    } else {
      this.model = DATE1;
    }
  }
}
