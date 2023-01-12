/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { ClrDatagridColumnToggle } from './datagrid-column-toggle';
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
      <ng-content select="clr-dg-column-toggle"></ng-content>
      <clr-dg-column-toggle *ngIf="hasHideableColumns && !toggle"></clr-dg-column-toggle>
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
  constructor(
    public selection: Selection<T>,
    public detailService: DetailService,
    private columnsService: ColumnsService,
    public commonStrings: ClrCommonStringsService
  ) {}

  /* reference to the enum so that template can access */
  SELECTION_TYPE = SelectionType;

  @ContentChild(ClrDatagridColumnToggle) toggle: ClrDatagridColumnToggle;

  get hasHideableColumns(): boolean {
    return this.columnsService.hasHideableColumns;
  }
}
