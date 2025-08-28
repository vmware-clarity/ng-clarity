/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

export enum ModalSize {
  small = 'sm',
  medium = 'md',
  large = 'lg',
  extraLarge = 'xl',
}

@Component({
  selector: 'clr-modal-angular-size-demo',
  templateUrl: './modal-angular-size.demo.html',
  standalone: false,
})
export class ModalAngularSizeDemo {
  modalSize = ModalSize;
  selectedSize: ModalSize;
  open = false;
}
