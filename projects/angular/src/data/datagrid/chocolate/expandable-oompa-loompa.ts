/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Optional } from '@angular/core';

import { DatagridWillyWonka } from './datagrid-willy-wonka';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ExpandableRowsCount } from '../providers/global-expandable-rows';

@Directive({
  selector: 'clr-datagrid, clr-dg-row',
  standalone: false,
})
export class ExpandableOompaLoompa extends OompaLoompa {
  private expandableCount: ExpandableRowsCount;

  constructor(
    cdr: ChangeDetectorRef,
    @Optional() willyWonka: DatagridWillyWonka,
    expandableCount: ExpandableRowsCount
  ) {
    if (!willyWonka) {
      throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
    }
    super(cdr, willyWonka);
    this.expandableCount = expandableCount;
  }

  get flavor() {
    return this.expandableCount.hasExpandableRow;
  }
}
