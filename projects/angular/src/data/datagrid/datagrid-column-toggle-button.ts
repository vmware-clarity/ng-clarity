/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DatagridColumnChanges } from './enums/column-changes.enum';
import { ColumnState } from './interfaces/column-state.interface';
import { ColumnsService } from './providers/columns.service';

@Component({
  selector: 'clr-dg-column-toggle-button',
  template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `,
})
export class ClrDatagridColumnToggleButton {
  private allSelected: Subject<boolean> = new EventEmitter();

  constructor(public commonStrings: ClrCommonStringsService, private columnsService: ColumnsService) {}

  @Output('clrAllSelected')
  get clrAllSelected(): Observable<boolean> {
    return this.allSelected.asObservable();
  }

  get allHideablesVisible() {
    return this.hideableColumns().filter(column => column.value.hidden).length === 0;
  }

  selectAll() {
    this.hideableColumns().forEach(hideableColumn =>
      this.columnsService.emitStateChange(hideableColumn, {
        hidden: false,
        changes: [DatagridColumnChanges.HIDDEN],
      })
    );
    this.allSelected.next(true);
  }

  private hideableColumns(): BehaviorSubject<ColumnState>[] {
    return this.columnsService.columns.filter(column => column.value.hideable);
  }
}
