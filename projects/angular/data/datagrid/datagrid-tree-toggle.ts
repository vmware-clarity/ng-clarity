/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { DatagridTreeNode } from './providers/tree-node.model';
import { DatagridTreeService } from './providers/tree.service';

/**
 * The expand toggle of a tree row, rendered by the cells of the toggle columns.
 */
@Component({
  selector: 'button[clrDgTreeToggleButton]',
  template: `
    <!-- Named "Expand <row>": the hidden word, then the cells that name the row. -->
    <span hidden [id]="actionId">
      {{ node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand }}
    </span>
    <!-- The button stays while the children load, so it keeps the focus. -->
    @if (node.loading && node.expanded) {
      <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>
    } @else {
      <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
    }
  `,
  host: {
    type: 'button',
    class: 'datagrid-tree-toggle',
    tabindex: '-1',
    '[attr.aria-labelledby]': 'actionId + " " + labelIds',
    '[attr.aria-expanded]': 'node.expanded',
    '(click)': 'toggle($event)',
    '(focus)': 'onFocus()',
    '(blur)': 'focusedCell = null',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ClrDatagridTreeToggle implements OnDestroy {
  @Input({ alias: 'clrDgTreeToggleButton', required: true }) node: DatagridTreeNode<unknown>;

  /**
   * The ids of the cells that name the row, separated by spaces.
   */
  @Input({ required: true }) labelIds: string;

  protected commonStrings = inject(ClrCommonStringsService);
  protected actionId = uniqueIdFactory();

  private tree = inject(DatagridTreeService);
  private el = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  /**
   * The cell of the toggle while the toggle has the focus.
   */
  private focusedCell: HTMLElement | null = null;

  /**
   * The toggle goes away when the children of its row come back empty. If it had the focus, the
   * cell takes it, so keyboard users don't land at the top of the page.
   */
  ngOnDestroy() {
    const cell = this.focusedCell;
    if (cell) {
      this.focusedCell = null;
      if (!cell.hasAttribute('tabindex')) {
        cell.setAttribute('tabindex', '-1');
      }
      cell.focus();
    }
  }

  protected onFocus() {
    this.focusedCell = this.el.nativeElement.closest<HTMLElement>('[role=gridcell]');
  }

  protected toggle(event: MouseEvent) {
    // Expanding is not selecting, even in row selection mode.
    event.stopPropagation();
    this.tree.setExpanded(this.node, !this.node.expanded);
  }
}
