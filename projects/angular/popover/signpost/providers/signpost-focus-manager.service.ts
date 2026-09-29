/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
      // The signpost also closes when its trigger is scrolled out of view - scrolling it back
      // into view to focus it would undo the user's scroll.
      this._triggerEl.focus({ preventScroll: true });
    }
  }
}
