/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, OnDestroy, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { SelectionType } from './enums/selection-type';
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
    <ng-content></ng-content>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
  host: {
    '[class.datagrid-row-flex]': 'true',
    '[class.datagrid-row-detail]': 'true',
    '[class.datagrid-container]': 'cells.length === 0',
    '[attr.id]': 'expand.expandableId',
    role: 'gridcell',
  },
})
export class ClrDatagridRowDetail implements AfterContentInit, OnDestroy {
  /* reference to the enum so that template can access it */
  SELECTION_TYPE = SelectionType;

  constructor(
    public selection: Selection,
    public rowActionService: RowActionService,
    public expand: DatagridIfExpandService,
    public expandableRows: ExpandableRowsCount,
    public commonStrings: ClrCommonStringsService
  ) {}

  @ContentChildren(ClrDatagridCell) cells: QueryList<ClrDatagridCell>;

  @Input('clrDgReplace')
  set replace(value: boolean) {
    this.expand.setReplace(!!value);
  }
  private subscriptions: Subscription[] = [];
  replacedRow = false;

  ngAfterContentInit() {
    this.subscriptions.push(
      this.expand.replace.subscribe(replaceChange => {
        this.replacedRow = replaceChange;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @Input('clrRowDetailBeginningAriaText') _beginningOfExpandableContentAriaText: string;
  get beginningOfExpandableContentAriaText() {
    return (
      this._beginningOfExpandableContentAriaText ||
      `${this.commonStrings.keys.datagridExpandableBeginningOf} 
      ${this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }

  @Input('clrRowDetailEndAriaText') _endOfExpandableContentAriaText: string;
  get endOfExpandableContentAriaText() {
    return (
      this._endOfExpandableContentAriaText ||
      `${this.commonStrings.keys.datagridExpandableEndOf} 
      ${this.commonStrings.keys.datagridExpandableRowContent}`
    );
  }
}
