/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { DropdownFocusHandler } from '@clr/angular/popover/dropdown';
import { FocusableItem } from '@clr/angular/utils';

/**
 * The focus handler of the `clr-dg-column-actions` menu, with the items projected into the menu
 * appended to the ones it declares. ClrDropdownMenu only hands over its own content query, which
 * cannot see projected items, and it hands it over again whenever that query changes - so the
 * projected ones are added here, where every one of those hand-overs passes through.
 */
@Injectable()
export class ColumnActionsFocusHandler extends DropdownFocusHandler {
  private ownItems: FocusableItem[] = [];
  private projectedItems: FocusableItem[] = [];

  override addChildren(children: FocusableItem[]) {
    this.ownItems = children;
    super.addChildren([...children, ...this.projectedItems]);
  }

  // The menu resets its children when it closes, and the items it declared go with it.
  override resetChildren() {
    this.ownItems = [];
    super.resetChildren();
  }

  setProjectedItems(items: FocusableItem[]) {
    this.projectedItems = items;
    this.addChildren(this.ownItems);
  }
}
