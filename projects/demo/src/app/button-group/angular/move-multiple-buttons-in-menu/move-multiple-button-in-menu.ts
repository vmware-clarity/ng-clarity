/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-move-mulitple-button-in-menu-demo',
  templateUrl: './move-multiple-button-in-menu.html',
  styleUrls: ['../../button-group.demo.scss'],
  standalone: false,
})
export class MoveMultipleButtonInMenuDemo {
  flip = false;

  toggleFlip() {
    this.flip = !this.flip;
  }
}
