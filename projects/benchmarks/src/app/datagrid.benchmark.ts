/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

import { generateItems, Item, sizeParam } from './data';

@Component({
  selector: 'app-datagrid-benchmark',
  imports: [ClrDatagridModule, DatePipe],
  template: `
    <button type="button" data-bench="render" (click)="items.set(all)">Render {{ all.length }} rows</button>
    <button type="button" data-bench="clear" (click)="items.set([])">Clear</button>

    <clr-datagrid clrDgSelectionType="multi" [(clrDgSelected)]="selected">
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-column [clrDgField]="'status'">Status</clr-dg-column>
      <clr-dg-column [clrDgField]="'owner'">Owner</clr-dg-column>
      <clr-dg-column [clrDgField]="'cpu'" [clrDgColType]="'number'">CPU %</clr-dg-column>
      <clr-dg-column [clrDgField]="'memory'" [clrDgColType]="'number'">Memory (GB)</clr-dg-column>
      <clr-dg-column [clrDgField]="'created'">Created</clr-dg-column>

      <clr-dg-row *clrDgItems="let item of items(); trackBy: trackById" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
        <clr-dg-cell>{{ item.owner }}</clr-dg-cell>
        <clr-dg-cell>{{ item.cpu }}</clr-dg-cell>
        <clr-dg-cell>{{ item.memory }}</clr-dg-cell>
        <clr-dg-cell>{{ item.created | date: 'short' : 'UTC' }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>{{ items().length }} rows</clr-dg-footer>
    </clr-datagrid>
  `,
})
export class DatagridBenchmark {
  readonly all = generateItems(sizeParam(200));
  readonly items = signal<Item[]>([]);
  selected: Item[] = [];

  trackById(_: number, item: Item) {
    return item.id;
  }
}
