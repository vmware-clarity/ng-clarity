/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';

/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
@Component({
  selector: 'clr-dg-row-detail',
  template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <!--
      These two containers mirror the ones in the row above and are only used while the detail is
      column aligned - see columnAligned. They are always rendered so the cells always have
      somewhere to be moved into, and the pinned one takes itself out of the layout while empty.
    -->
    <div class="datagrid-pinned-cells">
      <ng-container #pinnedCells></ng-container>
    </div>
    <ng-container #scrollableCells></ng-container>
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      <!--
        Where the cells go back to when the detail stops being column aligned, because a column was
        unpinned. A view that has been moved into a container cannot be handed back to the content
        projection it came from, so it needs a container of its own in the same place.
      -->
      <ng-container #plainCells></ng-container>
    }
    @if (this.cells?.length === 0) {
      <clr-dg-cell class="datagrid-container">
        <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      </clr-dg-cell>
    }

    <ng-template #noCells>
      <ng-content></ng-content>
    </ng-template>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
  host: {
    '[class.datagrid-row-flex]': 'true',
    '[class.datagrid-row-detail]': 'true',
    '[attr.id]': 'expand.expandableId',
    role: 'row',
  },
  standalone: false,
})
export class ClrDatagridRowDetail implements AfterContentInit, AfterViewInit, OnDestroy {
  @Input('clrRowDetailBeginningAriaText') _beginningOfExpandableContentAriaText: string;
  @Input('clrRowDetailEndAriaText') _endOfExpandableContentAriaText: string;

  replacedRow = false;

  /**
   * Whether the detail lays its cells out in the same columns as the row, which it does when it
   * holds one cell per column and at least one of those columns is pinned. The cells of the pinned
   * columns are then static alongside the ones in the row above.
   */
  columnAligned = false;

  /* reference to the enum so that template can access it */
  SELECTION_TYPE = SelectionType;

  @ContentChildren(ClrDatagridCell) cells: QueryList<ClrDatagridCell>;

  @ViewChild('pinnedCells', { read: ViewContainerRef }) private _pinnedCells: ViewContainerRef;
  @ViewChild('scrollableCells', { read: ViewContainerRef }) private _scrollableCells: ViewContainerRef;
  @ViewChild('plainCells', { read: ViewContainerRef }) private _plainCells: ViewContainerRef;

  private subscriptions: Subscription[] = [];
  private cellsMoved = false;
  private lastLayout: string;

  constructor(
    public selection: Selection,
    public rowActionService: RowActionService,
    public expand: DatagridIfExpandService,
    public expandableRows: ExpandableRowsCount,
    public commonStrings: ClrCommonStringsService,
    private columnsService: ColumnsService,
    private displayMode: DisplayModeService
  ) {}

  @Input('clrDgReplace')
  set replace(value: boolean) {
    this.expand.setReplace(!!value);
  }

  get beginningOfExpandableContentAriaText() {
    return (
      this._beginningOfExpandableContentAriaText ||
      `${this.commonStrings.keys.datagridExpandableBeginningOf} ${this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }

  get endOfExpandableContentAriaText() {
    return (
      this._endOfExpandableContentAriaText ||
      `${this.commonStrings.keys.datagridExpandableEndOf} ${this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }

  ngAfterContentInit() {
    this.subscriptions.push(
      this.expand.replace.subscribe(replaceChange => {
        this.replacedRow = replaceChange;
      }),
      // New cells have to be moved even when the columns did not change.
      this.cells.changes.subscribe(() => this.syncColumnAlignment(true))
    );
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      // The columns are set up after the detail's content, and pinning one happens later still.
      // Both land as a new render cycle, which is where the cells are moved.
      this.displayMode.view.subscribe(() => this.syncColumnAlignment())
    );
    this.syncColumnAlignment(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Moves the cells into the containers that lay them out in the same columns as the row, or back
   * out of them once that stops making sense.
   */
  private syncColumnAlignment(force = false) {
    if (!this._pinnedCells || !this._scrollableCells) {
      return;
    }
    const columns = this.columnsService.columnStates;
    const cells = this.cells ? this.cells.toArray() : [];
    // One cell per column is what makes the two comparable. Pinning is what makes the split worth
    // doing at all: with nothing pinned there is nothing to line up with, and the detail is left
    // exactly as it was authored.
    const columnAligned = cells.length > 0 && cells.length === columns.length && columns.some(column => column.pinned);
    const layout = columnAligned ? columns.map(column => (column.pinned ? '1' : '0')).join('') : '';

    if (!force && layout === this.lastLayout) {
      return;
    }
    this.lastLayout = layout;
    this.columnAligned = columnAligned;

    if (!columnAligned) {
      // Only worth doing if the cells were moved in the first place. Leaving an untouched detail
      // alone keeps whatever the author wrote between the cells where they wrote it.
      if (this.cellsMoved) {
        cells.forEach(cell => this.moveCell(this._plainCells, cell));
        this.cellsMoved = false;
      }
      return;
    }
    cells.forEach((cell, index) =>
      this.moveCell(this.columnsService.isPinned(index) ? this._pinnedCells : this._scrollableCells, cell)
    );
    this.cellsMoved = true;
  }

  private moveCell(container: ViewContainerRef, cell: ClrDatagridCell) {
    if (container && !cell._view.destroyed) {
      container.insert(cell._view);
    }
  }
}
