/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDatagridCell } from './datagrid-cell';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { SelectionType } from './enums/selection-type';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDestroyService } from '../../utils/destroy';

/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
@Component({
  selector: 'clr-dg-row-detail',
  // TODO: @deprecated - dategrid* keys are deprecated. Remove in v14.
  template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.dategridExpandableRowsHelperText || commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <ng-content></ng-content>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
  host: {
    '[class.datagrid-row-flex]': 'true',
    '[class.datagrid-row-detail]': 'true',
    '[class.datagrid-container]': 'cells.length === 0',
    '[attr.id]': 'expand.expandableId',
  },
  providers: [ClrDestroyService],
})
export class ClrDatagridRowDetail implements AfterContentInit {
  /* reference to the enum so that template can access it */
  public SELECTION_TYPE = SelectionType;

  constructor(
    public selection: Selection,
    public rowActionService: RowActionService,
    public expand: DatagridIfExpandService,
    public expandableRows: ExpandableRowsCount,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService
  ) {}

  @ContentChildren(ClrDatagridCell) cells: QueryList<ClrDatagridCell>;

  @Input('clrDgReplace')
  set replace(value: boolean) {
    this.expand.setReplace(!!value);
  }

  public replacedRow = false;

  ngAfterContentInit() {
    this.expand.replace.pipe(takeUntil(this.destroy$)).subscribe(replaceChange => {
      this.replacedRow = replaceChange;
    });
  }

  // TODO: @deprecated - dategrid* keys are deprecated. Remove in v14.
  @Input('clrRowDetailBeginningAriaText') _beginningOfExpandableContentAriaText: string;
  public get beginningOfExpandableContentAriaText() {
    return (
      this._beginningOfExpandableContentAriaText ||
      `${
        this.commonStrings.keys.dategridExpandableBeginningOf || this.commonStrings.keys.datagridExpandableBeginningOf
      } 
      ${this.commonStrings.keys.dategridExpandableRowContent || this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }

  // TODO: @deprecated - dategrid* keys are deprecated. Remove in v14.
  @Input('clrRowDetailEndAriaText') _endOfExpandableContentAriaText: string;
  public get endOfExpandableContentAriaText() {
    return (
      this._endOfExpandableContentAriaText ||
      `${this.commonStrings.keys.dategridExpandableEndOf || this.commonStrings.keys.datagridExpandableEndOf} 
      ${this.commonStrings.keys.dategridExpandableRowContent || this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }
}
