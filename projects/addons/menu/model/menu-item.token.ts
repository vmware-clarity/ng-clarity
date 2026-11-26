/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

/**
 * Base class for all items that can be shown as children of a menu.
 * Used as type injection token used to query heterogeneous list of menu items.
 */
export abstract class MenuItem {
  /**
   * Optional ID of the menu item.
   */
  id?: string;
  type!: MenuItemType;

  readonly #hidden = signal(false);

  /**
   * Hides the item. Signal-backed, so that an OnPush menu renders a change made while it is open.
   */
  get hidden(): boolean {
    return this.#hidden();
  }

  set hidden(hidden: boolean) {
    this.#hidden.set(hidden);
  }
}

export enum MenuItemType {
  action,
  separator,
  header,
  menu,
}
