/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CDK_DROP_LIST, CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, DatagridDragConfig, SelectionType } from '@clr/addons/datagrid';
import { DragAndDropGroupService } from '@clr/addons/drag-and-drop';

import { Inventory, VmItem } from '../inventory/inventory';

@Component({
  selector: 'drag-drop-grid-demo',
  imports: [AppfxDatagridModule, CommonModule, DragDropModule],
  standalone: true,
  templateUrl: 'drag-drop-grid-demo.component.html',
  styles: [
    `
      .dropzone {
        width: 50%;
        min-height: 120px;
        border: 2px dashed;
        margin: 10px;
        text-align: center;
      }

      .draggable-item {
        padding: 10px;
        margin: 10px;
        border: 1px solid;
        cursor: grab;
      }
    `,
  ],
  providers: [Inventory],
})
export class DragDropGridDemoComponent {
  #droppables: QueryList<CdkDropList>;

  protected readonly columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
    },
    {
      displayName: 'State',
      field: 'state',
    },
    {
      displayName: 'Status',
      field: 'status',
    },
  ];

  protected allItems: VmItem[];
  protected selectionType: SelectionType = SelectionType.Multi;

  protected receivedItems: string[] = [];

  protected dragConfig: DatagridDragConfig = {
    fieldName: 'name',
    dragGroup: 'vm-group',
  };

  constructor(private groupService: DragAndDropGroupService, private inventory: Inventory) {
    inventory.reset();
    this.allItems = inventory.allItems;
  }

  @ViewChildren(CDK_DROP_LIST)
  set droppables(dropLists: QueryList<CdkDropList>) {
    this.#droppables?.forEach(droppable => {
      this.groupService.removeGroupItem(this.dragConfig.dragGroup, droppable);
    });
    dropLists.forEach(droppable => {
      this.groupService.addGroupItem(this.dragConfig.dragGroup, droppable);
    });
    this.#droppables = dropLists;
  }

  protected dropGroup(group: string): CdkDropList[] {
    return (this.groupService?.getGroupItems(group) || []) as CdkDropList[];
  }

  protected drop(event: CdkDragDrop<unknown[]>) {
    event.item.data?.forEach((item: VmItem) => {
      if (this.receivedItems.includes(item.name)) {
        return;
      }
      this.receivedItems.push(item.name);
    });
  }
}
