/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkConnectedOverlay, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ColumnHiddenState } from '../../interfaces/column-state';
import { ColumnDefinition } from '../../shared/column/column-definitions';

@Component({
  selector: 'appfx-dg-column-toggle',
  standalone: false,
  templateUrl: 'datagrid-column-toggle.component.html',
  styleUrls: ['datagrid-column-toggle.component.scss'],
})
export class DatagridColumnToggleComponent implements OnDestroy {
  @HostBinding('class') layoutClass = 'column-switch-wrapper';

  @ViewChild('closeColumnButton', { read: ElementRef }) closeColumnButtonElement: ElementRef;

  @Input() columns: ColumnDefinition<any>[];
  @Output() columnsChange = new EventEmitter<ColumnDefinition<any>[]>();

  @Output() columnHiddenStateChange = new EventEmitter<ColumnHiddenState>();

  positions = [
    new ConnectionPositionPair(
      {
        originX: 'start',
        originY: 'top',
      },
      {
        overlayX: 'start',
        overlayY: 'bottom',
      }
    ),
  ];

  openState = false;
  viewId: string | undefined;
  overlay: CdkConnectedOverlay;

  constructor(public dgStrings: DatagridStrings) {}

  get hasOnlyOneVisibleColumn(): boolean {
    const hideableColumns = this.hideableColumns();
    const nonHideableColumns = this.columns.length - hideableColumns.length;
    return nonHideableColumns === 0 && hideableColumns.filter(column => !column.hidden).length === 1;
  }

  ngOnDestroy() {
    this.openState = false;
  }

  onAttach(overlay: CdkConnectedOverlay) {
    this.overlay = overlay;
    this.viewId = overlay?.overlayRef?.overlayElement.id;
  }

  onDetach(): void {
    this.openState = false;
    this.viewId = undefined;
  }

  showColumn(colUid: string) {
    this.showHideColumn(colUid, false);
  }

  hideColumn(colUid: string) {
    this.showHideColumn(colUid, true);
  }

  toggleColumnState(columnToToggle: ColumnDefinition<any>, event?: Event) {
    const shouldHide = !!event?.target && !(event.target as HTMLInputElement).checked;
    columnToToggle.hidden = shouldHide;
    this.columnsChange.emit([...this.columns]);
    this.columnHiddenStateChange.emit({
      hidden: shouldHide,
      column: columnToToggle,
    });
  }

  onSelectAll() {
    this.hideableColumns()
      .filter(column => column.hidden)
      .forEach(column => this.toggleColumnState(column));
  }

  allColumnsSelected(): boolean {
    return this.hideableColumns().filter(column => column.hidden).length === 0;
  }

  hideableColumns(): ColumnDefinition<any>[] {
    // If column.hideable is not set to false explicitly then column is considered visible
    return this.columns.filter(column => column.hideable !== false);
  }

  private showHideColumn(colUid: string, hide: boolean) {
    const columnToToggle: ColumnDefinition<any> | undefined = this.columns.find(col => col.uid === colUid);
    if (!columnToToggle) {
      return;
    }

    columnToToggle.hidden = hide;
    this.columnsChange.emit([...this.columns]);
    this.columnHiddenStateChange.emit({
      hidden: hide,
      column: columnToToggle,
    });
  }
}
