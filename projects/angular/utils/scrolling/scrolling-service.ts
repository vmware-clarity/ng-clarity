/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, Inject, Injectable } from '@angular/core';

// Each overlay owns one lock, even when both its imperative API and input update request it.
// Closing or destroying a different overlay must not unlock the remaining ones.
const scrollLocks = new WeakMap<object, number>();

@Injectable()
export class ScrollingService {
  private locked = false;
  constructor(@Inject(DOCUMENT) private _document: any) {}

  stopScrolling(): void {
    if (this.locked) {
      return;
    }
    this.locked = true;
    scrollLocks.set(this._document, (scrollLocks.get(this._document) ?? 0) + 1);
    this._document.body.classList.add('no-scrolling');
  }

  resumeScrolling(): void {
    if (!this.locked) {
      return;
    }
    this.locked = false;
    const remaining = (scrollLocks.get(this._document) ?? 1) - 1;
    if (remaining === 0) {
      scrollLocks.delete(this._document);
      this._document.body.classList.remove('no-scrolling');
    } else {
      scrollLocks.set(this._document, remaining);
    }
  }
}
