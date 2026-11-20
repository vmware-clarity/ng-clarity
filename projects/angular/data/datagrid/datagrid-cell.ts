/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Injector,
  OnInit,
  QueryList,
  ViewContainerRef,
} from '@angular/core';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import { HostWrapper, uniqueIdFactory } from '@clr/angular/utils';

import { DATAGRID_TREE_ROW } from './interfaces/tree-row.interface';
import { DatagridTreeNode } from './providers/tree-node.model';
import { WrappedCell } from './wrapped-cell';

@Component({
  selector: 'clr-dg-cell',
  template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (treeNode; as node) {
      <!-- The content is indented by the depth of the row, and the toggle sits in the indentation. -->
      <div class="datagrid-tree-cell-content">
        @if (node.expandable) {
          <button [clrDgTreeToggleButton]="node" [labelIds]="treeToggleLabelIds"></button>
        }
        <div class="datagrid-tree-cell-text"><ng-container [ngTemplateOutlet]="content"></ng-container></div>
      </div>
    } @else {
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    }
  `,
  host: {
    '[class.datagrid-cell]': 'true',
    '[class.datagrid-tree-cell]': '!!treeNode',
    '[style.--clr-datagrid-tree-level]': 'treeNode ? treeNode.level - 1 : null',
    '[class.datagrid-signpost-trigger]': 'signpost.length > 0',
    role: 'gridcell',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ClrDatagridCell implements OnInit {
  /*********
   * @property signpost
   *
   * @description
   * @ContentChild is used to detect the presence of a Signpost in the projected content.
   * On the host, we set the .datagrid-signpost-trigger class on the cell when signpost.length is greater than 0.
   *
   */
  @ContentChildren(ClrSignpost) signpost!: QueryList<ClrSignpost>;

  private wrappedInjector!: Injector;
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  // Found by injection rather than set by the row, so the cell knows its row when it is first checked:
  // cells rendered in a loop inside the row are checked before the row's content hooks run.
  private row = inject(DATAGRID_TREE_ROW, { optional: true });

  constructor(private vcr: ViewContainerRef) {}

  /**
   * The id of the cell, by which the toggles of a tree row are named. Given only to the cells that
   * need one, and an id the app set is kept.
   */
  get _treeId(): string {
    const cell = this.el.nativeElement;
    if (!cell.id) {
      cell.id = uniqueIdFactory();
    }
    return cell.id;
  }

  get _view() {
    return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
  }

  /**
   * The tree node of the row, on the cells that carry the indentation and the toggle.
   */
  protected get treeNode(): DatagridTreeNode<unknown> | undefined {
    const tree = this.row?._tree;
    return tree?.toggleCells.has(this) ? tree.node : undefined;
  }

  /**
   * The ids of the cells that name the row on its toggle: the leading cell of the row, then this
   * cell. The cell with the toggle still names the row when the leading cell has no text, like a
   * drag handle.
   */
  protected get treeToggleLabelIds(): string {
    const leading = this.row?._tree?.labelCell;
    return leading && leading !== this ? `${leading._treeId} ${this._treeId}` : this._treeId;
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
  }
}
