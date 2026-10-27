/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LowerCasePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ClrModal, ClrModalModule } from '@clr/angular';

@Component({
  selector: 'clr-modal-sizes-example',
  templateUrl: './sizes.example.html',
  imports: [LowerCasePipe, ClrModalModule],
})
export class ModalSizesExample {
  @ViewChild('modal', { static: true }) modal: ClrModal | undefined;

  opened = false;
  size = 'md';

  get sizeText(): string {
    switch (this.size) {
      case 'sm':
        return 'Small';
      case 'xl':
        return 'X-Large';
      case 'full-screen':
        return 'Full-Screen';
      case 'lg':
        return 'Large';
      case 'md':
      default:
        return 'Medium (Default)';
    }
  }

  openModal(size: string) {
    this.size = size;

    this.modal?.open();
  }
}
