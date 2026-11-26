/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { MenuItem, MenuItemType } from './menu-item.token';

/**
 * A MenuItem where multiple menuItems can be nested.
 */
export class NestedMenu extends MenuItem {
  override type = MenuItemType.menu;

  text?: string;

  iconClass?: string;

  menuItems!: Iterable<MenuItem>;

  /**
   * Called when an input of one of the nested items changes, so that the menu renders the change.
   */
  itemChanged(): void {
    // Implemented by MenuComponent.
  }
}
