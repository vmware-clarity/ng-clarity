/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, inject, Inject, Injectable } from '@angular/core';

/** One owner per overlay, shared by the instance-scoped scrolling services. */
@Injectable({ providedIn: 'root' })
class ScrollLockOwners {
  readonly owners = new Set<ScrollingService>();
}

@Injectable()
export class ScrollingService {
  private readonly locks = inject(ScrollLockOwners);
  constructor(@Inject(DOCUMENT) private _document: any) {}

  stopScrolling(): void {
    this.locks.owners.add(this);
    this._document.body.classList.add('no-scrolling');
  }

  resumeScrolling(): void {
    if (this.locks.owners.delete(this) && this.locks.owners.size === 0) {
      this._document.body.classList.remove('no-scrolling');
    }
  }
}
