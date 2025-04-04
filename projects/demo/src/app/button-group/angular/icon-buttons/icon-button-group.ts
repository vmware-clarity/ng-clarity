/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-icon-button-group-demo',
  templateUrl: './icon-button-group.html',
  styleUrls: ['../../button-group.demo.scss'],
})
export class IconButtonGroupDemo {
  flip = false;
  flip1 = false;
  flip2 = false;
  flip3 = false;

  toggleFlip() {
    this.flip = !this.flip;
  }

  toggleFlip1() {
    this.flip1 = !this.flip1;
  }

  toggleFlip2() {
    this.flip2 = !this.flip2;
  }

  toggleFlip3() {
    this.flip3 = !this.flip3;
  }
}
