/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { Selection } from './providers/selection';

@Component({
  selector: 'clr-dg-footer',
  template: `
    <ng-container *ngIf="selection.selectionType === SELECTION_TYPE.Multi && selection.current.length > 0">
      <div class="clr-form-control-disabled">
        <clr-checkbox-wrapper class="datagrid-footer-select">
          <input clrCheckbox type="checkbox" checked="checked" disabled />
          <label>{{ selection.current.length }}</label>
          <span class="clr-sr-only">{{ commonStrings.keys.selectedRows }}</span>
        </clr-checkbox-wrapper>
      </div>
    </ng-container>
    <ng-container *ngIf="!detailService.isOpen">
      <clr-dg-column-toggle *ngIf="hasHideableColumns"></clr-dg-column-toggle>
      <div class="datagrid-footer-description">
        <ng-content></ng-content>
      </div>
    </ng-container>
    <ng-content select="clr-dg-pagination"></ng-content>
  `,
  host: {
    '[class.datagrid-footer]': 'true',
  },
})
export class ClrDatagridFooter<T = any> {
  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  constructor(
    public selection: Selection<T>,
    public detailService: DetailService,
    private columnsService: ColumnsService,
    public commonStrings: ClrCommonStringsService
  ) {}

  get hasHideableColumns(): boolean {
    return this.columnsService.hasHideableColumns;
  }
}
