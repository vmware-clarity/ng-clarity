/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Base class for all items that can be shown as children of a menu.
 * Used as type injection token used to query heterogeneous list of menu items.
 */
export abstract class MenuItem {
  /**
   * Optional ID of the menu item.
   */
  id?: string;
  hidden: boolean = false;
  type: MenuItemType;
}

export enum MenuItemType {
  action,
  separator,
  header,
  menu,
}
