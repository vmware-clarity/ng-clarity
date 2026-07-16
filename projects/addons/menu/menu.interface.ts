/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

/**
 * A menu component that can be shown within a menu-outlet.
 */
export interface Menu {
  /**
   * Emits once when the menu is opened.
   */
  opened: Observable<void>;

  /**
   * Emits once when the menu is closed.
   */
  closed: Observable<void>;

  /**
   * Shows the menu with left top corner at the specified coordinates.
   *
   * When closed the focus is moved back to the trigger.
   */
  show(e: Event, x: number, y: number, trigger?: HTMLElement): void;
}
