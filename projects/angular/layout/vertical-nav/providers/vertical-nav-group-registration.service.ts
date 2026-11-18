/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

@Injectable()
export class VerticalNavGroupRegistrationService {
  private readonly _navGroupCount = signal(0);

  get navGroupCount(): number {
    return this._navGroupCount();
  }

  registerNavGroup() {
    this._navGroupCount.update(count => count + 1);
  }

  unregisterNavGroup(): void {
    this._navGroupCount.update(count => count - 1);
  }
}
