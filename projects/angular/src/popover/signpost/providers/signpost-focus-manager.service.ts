/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class SignpostFocusManager {
  private _triggerEl: HTMLElement;

  set triggerEl(value: HTMLElement) {
    this._triggerEl = value;
  }

  focusTrigger() {
    if (this._triggerEl) {
      this._triggerEl.focus();
    }
  }
}
