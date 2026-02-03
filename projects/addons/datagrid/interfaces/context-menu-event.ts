/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Represents the context of a right-click event on a grid row.
 */
export interface ContextMenuEvent {
  event: MouseEvent;
  /**
   * An array of selected grid items.
   * This property represents the context in which the right-click event occurred.
   */
  context: any[];
}
