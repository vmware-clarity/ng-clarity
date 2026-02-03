/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

/**
 * Service for managing groups of items that can be dragged and dropped with CdkDropList.
 */
@Injectable({
  providedIn: 'root',
})
export class DragAndDropGroupService {
  private groups: Map<string, CdkDropList[]> = new Map();

  /**
   * Retrieves the items (CdkDropList instances) belonging to a specific group.
   *
   * @param group The name of the group to retrieve items for.
   * @returns An array of CdkDropList instances belonging to the specified group.
   */
  getGroupItems(group: string): readonly CdkDropList[] {
    const items = this.groups.get(group);
    if (items) {
      return items;
    }
    const emptyItems: CdkDropList[] = [];
    this.groups.set(group, emptyItems);
    return emptyItems;
  }

  /**
   * Adds a CdkDropList item to the specified group.
   *
   * @param group The name of the group to add the item to.
   * @param item The CdkDropList instance to add to the group.
   */
  addGroupItem(group: string, item: CdkDropList): void {
    const items = this.groups.get(group) ?? [];
    if (!items.includes(item)) {
      items.push(item);
      this.groups.set(group, items);
    }
  }

  /**
   * Removes a CdkDropList item from the specified group.
   *
   * @param group The name of the group to remove the item from.
   * @param item The CdkDropList instance to remove from the group.
   */
  removeGroupItem(group: string, item: CdkDropList): void {
    const items = this.groups.get(group);
    if (!items) {
      return;
    }

    const index = items.indexOf(item);
    if (index < 0) {
      return;
    }

    items.splice(index, 1);
  }
}
