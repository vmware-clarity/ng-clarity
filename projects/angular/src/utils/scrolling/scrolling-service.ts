/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ScrollingService {
  constructor(@Inject(DOCUMENT) private _document: any) {}

  stopScrolling(): void {
    this._document.body.classList.add('no-scrolling');
  }

  resumeScrolling(): void {
    if (this._document.body.classList.contains('no-scrolling')) {
      this._document.body.classList.remove('no-scrolling');
    }
  }
}
