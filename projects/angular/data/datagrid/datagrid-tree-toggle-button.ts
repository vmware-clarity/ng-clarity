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
 * The button that expands and collapses a tree row, in the cells of its toggle columns.
 */
@Component({
  selector: 'button[clrDgTreeToggleButton]',
  template: `
    <!-- Named "Expand <row>": this word, then the cells that name the row. -->
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
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ClrDatagridTreeToggleButton implements OnDestroy {
  @Input({ alias: 'clrDgTreeToggleButton', required: true }) node: DatagridTreeNode<unknown>;

  /**
   * The ids of the cells that name the row, separated by spaces.
   */
  @Input({ required: true }) labelIds: string;

  protected commonStrings = inject(ClrCommonStringsService);
  protected actionId = uniqueIdFactory();

  /**
   * The cell of the button, from when the button first has the focus. By the time the button is
   * destroyed, it can be out of the cell already.
   */
  private cell: HTMLElement | null = null;

  private tree = inject(DatagridTreeService);
  private el = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  /**
   * The button goes away when the children of its row come back empty. If it took the focus with it,
   * the cell takes the focus, so keyboard users don't land at the top of the page. The browser can
   * take the button out of the page before it is destroyed, and then the focus has already gone to
   * the body: blur doesn't tell that apart from the user leaving the button.
   */
  ngOnDestroy() {
    const button = this.el.nativeElement;
    const active = button.ownerDocument.activeElement;
    const focusLost = !active || active === button || active === button.ownerDocument.body;
    if (this.cell && focusLost) {
      if (!this.cell.hasAttribute('tabindex')) {
        this.cell.setAttribute('tabindex', '-1');
      }
      this.cell.focus();
    }
  }

  protected onFocus() {
    this.cell ??= this.el.nativeElement.closest<HTMLElement>('[role=gridcell]');
  }

  protected toggle(event: MouseEvent) {
    // Expanding is not selecting, even in row selection mode.
    event.stopPropagation();
    this.tree.setExpanded(this.node, !this.node.expanded);
  }
}
