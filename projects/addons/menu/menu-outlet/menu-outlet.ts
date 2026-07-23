/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentRef } from '@angular/core';

export interface MenuOutlet {
  /**
   * Adds the menu component to the outlet.
   */
  attachMenu(menuComponentRef: ComponentRef<any>): void;

  /**
   * Removes to menu component from the outlet.
   */
  detachMenu(): void;
}
