/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed, Injectable, signal } from '@angular/core';

import { DetailService } from './detail.service';

@Injectable()
export class ExpandableRowsCount {
  private readonly expandableCount = signal(0);
  private readonly _hasExpandableRow = computed(() => !this.detailService.enabled && this.expandableCount() > 0);

  constructor(private detailService: DetailService) {}

  /**
   * false means no rows with action
   * check if details are on, and disable rows entirely
   */
  get hasExpandableRow(): boolean {
    return this._hasExpandableRow();
  }

  register() {
    this.expandableCount.update(count => count + 1);
  }

  unregister() {
    this.expandableCount.update(count => count - 1);
  }
}
