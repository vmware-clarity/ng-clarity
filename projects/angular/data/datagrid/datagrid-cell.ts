/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import { ClrCommonStringsService, HostWrapper, uniqueIdFactory } from '@clr/angular/utils';

import { DatagridTreeNode, DatagridTreeService } from './providers/tree.service';
import { WrappedCell } from './wrapped-cell';

/**
 * What a cell needs from its row to render the tree toggle.
 */
export interface DatagridTreeRow {
  readonly _treeNode: DatagridTreeNode<unknown> | undefined;
  readonly _treeCell: ClrDatagridCell | undefined;
}

@Component({
  selector: 'clr-dg-cell',
  template: `
    @if (treeNode; as node) {
      @if (node.expandable) {
        <!-- Named "Expand <cell text>": the hidden word, then the cell itself. -->
        <span hidden [id]="treeId + '-action'">
          {{ node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand }}
        </span>
        <button
          #treeToggle
          type="button"
          class="datagrid-tree-toggle"
          tabindex="-1"
          [attr.aria-labelledby]="treeId + '-action ' + treeId"
          [attr.aria-expanded]="node.expanded"
          (click)="toggle($event, node)"
          (keydown)="onToggleKeydown($event, node)"
          (focus)="toggleFocused = true"
          (blur)="toggleFocused = false"
        >
          <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
        </button>
      }
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class.datagrid-cell]': 'true',
    '[class.datagrid-tree-cell]': '!!treeNode',
    '[style.--clr-datagrid-tree-level]': 'treeNode ? treeNode.level - 1 : null',
    '[attr.id]': 'treeNode ? treeId : null',
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
   * Set by the row on its cells when the datagrid renders a tree; `null` otherwise.
   */
  _treeRow: DatagridTreeRow | null = null;

  protected commonStrings = inject(ClrCommonStringsService);
  protected treeId = uniqueIdFactory();
  protected toggleFocused = false;

  private wrappedInjector: Injector;
  private tree = inject(DatagridTreeService, { optional: true });
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor(private vcr: ViewContainerRef) {}

  get _view() {
    return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
  }

  /**
   * The tree node of the row, on the one cell that carries the indentation and the toggle.
   */
  protected get treeNode(): DatagridTreeNode<unknown> | undefined {
    const row = this._treeRow;
    return row && row._treeCell === this ? row._treeNode : undefined;
  }

  /**
   * The toggle goes away when the children of its row come back empty. If it had the focus, the
   * cell takes it, so keyboard users don't land at the top of the page.
   */
  @ViewChild('treeToggle')
  protected set treeToggle(toggle: ElementRef<HTMLButtonElement> | undefined) {
    if (!toggle && this.toggleFocused) {
      this.toggleFocused = false;
      const cell = this.el.nativeElement;
      if (!cell.hasAttribute('tabindex')) {
        cell.setAttribute('tabindex', '-1');
      }
      cell.focus();
    }
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
  }

  protected toggle(event: MouseEvent, node: DatagridTreeNode<unknown>) {
    // Expanding is not selecting, even in row selection mode.
    event.stopPropagation();
    this.tree.setExpanded(node, !node.expanded);
  }

  /**
   * The treegrid keys: Right expands a collapsed row and Left collapses an expanded one (mirrored in
   * right-to-left). Otherwise the arrows move between cells as usual.
   */
  protected onToggleKeydown(event: KeyboardEvent, node: DatagridTreeNode<unknown>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    const rtl = getComputedStyle(this.el.nativeElement).direction === 'rtl';
    const expand = (event.key === 'ArrowRight') !== rtl;
    if (node.expanded === expand) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.tree.setExpanded(node, expand);
  }
}
