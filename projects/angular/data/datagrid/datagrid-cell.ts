/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChildren, Injector, OnInit, Optional, QueryList, ViewContainerRef } from '@angular/core';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import { ClrCommonStringsService, HostWrapper } from '@clr/angular/utils';

import { DatagridTreeNode, DatagridTreeService } from './providers/tree.service';
import { WrappedCell } from './wrapped-cell';

@Component({
  selector: 'clr-dg-cell',
  template: `
    @if (treeRow?.treeNode; as node) {
      @if (node.loading) {
        <clr-spinner class="datagrid-tree-toggle" clrInline>{{ commonStrings.keys.loading }}</clr-spinner>
      } @else if (node.expandable) {
        <button
          type="button"
          class="datagrid-tree-toggle"
          tabindex="-1"
          [attr.aria-label]="node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand"
          (click)="toggle($event, node)"
        >
          <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
        </button>
      }
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class.datagrid-cell]': 'true',
    '[class.datagrid-tree-cell]': '!!treeRow?.treeNode',
    '[style.--clr-datagrid-tree-level]': 'treeRow?.treeNode ? treeRow.treeNode.level - 1 : null',
    '[class.datagrid-signpost-trigger]': 'signpost.length > 0',
    role: 'gridcell',
  },
  standalone: false,
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
  @ContentChildren(ClrSignpost) signpost: QueryList<ClrSignpost>;

  /**
   * Set by the row on its first cell when the datagrid renders a tree.
   */
  treeRow: { treeNode: DatagridTreeNode<any> | undefined } | null = null;

  private wrappedInjector: Injector;

  constructor(
    private vcr: ViewContainerRef,
    public commonStrings: ClrCommonStringsService,
    @Optional() private tree: DatagridTreeService
  ) {}

  get _view() {
    return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
  }

  toggle(event: MouseEvent, node: DatagridTreeNode<any>) {
    // Expanding is not selecting, even in row selection mode.
    event.stopPropagation();
    this.tree.setExpanded(node, !node.expanded);
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
  }
}
