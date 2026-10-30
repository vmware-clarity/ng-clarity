/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class RowActionService {
  private readonly actionableCount = signal(0);
  private readonly _hasActionableRow = computed(() => this.actionableCount() > 0);

  /**
   * false means no rows with action
   */
  get hasActionableRow(): boolean {
    return this._hasActionableRow();
  }

  register() {
    this.actionableCount.update(count => count + 1);
  }

  unregister() {
    this.actionableCount.update(count => count - 1);
  }
}
