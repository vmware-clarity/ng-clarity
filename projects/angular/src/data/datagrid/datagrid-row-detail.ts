/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, OnDestroy, QueryList } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/src/utils';
import { Subscription } from 'rxjs';

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
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
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
export class ClrDatagridRowDetail implements AfterContentInit, OnDestroy {
  @Input('clrRowDetailBeginningAriaText') _beginningOfExpandableContentAriaText: string;
  @Input('clrRowDetailEndAriaText') _endOfExpandableContentAriaText: string;

  replacedRow = false;

  /* reference to the enum so that template can access it */
  SELECTION_TYPE = SelectionType;

  @ContentChildren(ClrDatagridCell) cells: QueryList<ClrDatagridCell>;

  private subscriptions: Subscription[] = [];

  constructor(
    public selection: Selection,
    public rowActionService: RowActionService,
    public expand: DatagridIfExpandService,
    public expandableRows: ExpandableRowsCount,
    public commonStrings: ClrCommonStringsService
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
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
