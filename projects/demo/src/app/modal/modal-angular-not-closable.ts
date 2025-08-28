/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-modal-angular-not-closable-demo',
  templateUrl: './modal-angular-not-closable.demo.html',
  standalone: false,
})
export class ModalAngularNotClosableDemo {
  // Booleans to open each example modal
  closable = false;
}
