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
  readonly _treeCells: ClrDatagridCell[];
  readonly _treeLabelCell: ClrDatagridCell | undefined;
}

@Component({
  selector: 'clr-dg-cell',
  template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (treeNode; as node) {
      <!-- The content is indented by the depth of the row, and the toggle sits in the indentation. -->
      <div class="datagrid-tree-cell-content">
        @if (node.expandable) {
          <!-- Named "Expand <row>": the hidden word, then the leading cell of the row. -->
          <span hidden [id]="_treeId + '-action'">
            {{ node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand }}
          </span>
          <button
            #treeToggle
            type="button"
            class="datagrid-tree-toggle"
            tabindex="-1"
            [attr.aria-labelledby]="_treeId + '-action ' + (_treeRow?._treeLabelCell?._treeId ?? _treeId)"
            [attr.aria-expanded]="node.expanded"
            (click)="toggle($event, node)"
            (keydown)="onToggleKeydown($event, node)"
            (focus)="toggleFocused = true"
            (blur)="toggleFocused = false"
          >
            <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
          </button>
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
    '[attr.id]': '_treeRow ? _treeId : null',
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

  /**
   * The id of the cell in a tree row, by which the toggles of the row are named.
   */
  readonly _treeId = uniqueIdFactory();

  protected commonStrings = inject(ClrCommonStringsService);
  protected toggleFocused = false;

  private wrappedInjector: Injector;
  private tree = inject(DatagridTreeService, { optional: true });
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor(private vcr: ViewContainerRef) {}

  get _view() {
    return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
  }

  /**
   * The tree node of the row, on the cells that carry the indentation and the toggle.
   */
  protected get treeNode(): DatagridTreeNode<unknown> | undefined {
    const row = this._treeRow;
    return row?._treeCells.includes(this) ? row._treeNode : undefined;
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
   * The treegrid keys: Right expands a collapsed row and Left collapses an expanded one. Otherwise the
   * arrows move between cells as usual. Like that cell navigation, the keys are not mirrored in
   * right-to-left, so a key does the same thing whichever cell it is pressed in.
   */
  protected onToggleKeydown(event: KeyboardEvent, node: DatagridTreeNode<unknown>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    const expand = event.key === 'ArrowRight';
    if (node.expanded === expand) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.tree.setExpanded(node, expand);
  }
}
