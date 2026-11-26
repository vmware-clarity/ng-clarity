/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

@Injectable()
export class VerticalNavIconService {
  private readonly _icons = signal(0);

  get hasIcons(): boolean {
    return this._icons() > 0;
  }

  registerIcon(): void {
    this._icons.update(count => count + 1);
  }

  unregisterIcon(): void {
    this._icons.update(count => count - 1);
  }
}
