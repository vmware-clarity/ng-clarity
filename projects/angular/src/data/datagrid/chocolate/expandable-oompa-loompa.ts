/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Optional } from '@angular/core';

import { ClrDestroyService } from '../../../utils/destroy';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ExpandableRowsCount } from '../providers/global-expandable-rows';
import { DatagridWillyWonka } from './datagrid-willy-wonka';

@Directive({ selector: 'clr-datagrid, clr-dg-row', providers: [ClrDestroyService] })
export class ExpandableOompaLoompa extends OompaLoompa {
  private expandableCount: ExpandableRowsCount;

  constructor(
    cdr: ChangeDetectorRef,
    @Optional() willyWonka: DatagridWillyWonka,
    expandableCount: ExpandableRowsCount,
    destroy$: ClrDestroyService
  ) {
    if (!willyWonka) {
      throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
    }
    super(cdr, willyWonka, destroy$);
    this.expandableCount = expandableCount;
  }

  get flavor() {
    return this.expandableCount.hasExpandableRow;
  }
}
