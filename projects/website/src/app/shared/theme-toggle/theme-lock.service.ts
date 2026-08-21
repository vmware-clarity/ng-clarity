/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeLockService {
  readonly lightThemeLocked = signal(false);

  lockLightTheme() {
    this.lightThemeLocked.set(true);
  }

  unlockTheme() {
    this.lightThemeLocked.set(false);
  }
}
