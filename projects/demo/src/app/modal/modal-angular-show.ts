/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-modal-angular-show-demo',
  templateUrl: './modal-angular-show.demo.html',
  standalone: false,
})
export class ModalAngularShowDemo {
  // Booleans to open each example modal
  basic = false;
  fullScreen = false;

  onModalClose() {
    console.log('modal change event');
  }
}
