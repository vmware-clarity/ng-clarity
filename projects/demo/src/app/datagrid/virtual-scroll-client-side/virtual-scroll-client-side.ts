/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { AfterViewChecked, ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Column, DynamicData, Row } from '../inventory/dynamic-data';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonComparator } from '../utils/pokemon-comparator';

class ChangeDetectionPerfRecord {
  msPerTick: 0;
  numTicks: 0;
}

@Component({
  selector: 'clr-datagrid-virtual-scroll-client-side-demo',
  providers: [DynamicData, Inventory],
  templateUrl: './virtual-scroll-client-side.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridVirtualScrollClientSideDemo implements OnInit, AfterViewChecked {
  totalRows = 10000;
  totalCols = 5;
  cols: Column[];
  rows: Observable<Row[]>;
  users: Observable<User[]>;

  selectedRows: Row[] = [];
  selectedUsers: User[] = [];
  timeCD: ChangeDetectionPerfRecord;
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;

  pokemonComparator = new PokemonComparator();

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor(
    public inventory: Inventory,
    private dynamicData: DynamicData,
    private cdr: ChangeDetectorRef,
    applicationRef: ApplicationRef
  ) {
    this.timeCD = new ChangeDetectionPerfRecord();

    this.rows = this.allRows;

    const originalTick = applicationRef.tick;
    applicationRef.tick = function () {
      const before = window.performance.now();
      const retValue = originalTick.apply(this);
      const after = window.performance.now();

      window.console.log('CHANGE DETECTION TIME', after - before);
      return retValue;
    };
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.calculateDatagrid();

    this.rows.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  changeDatagridDimensions() {
    this.calculateDatagrid();
    this.showChangeDetection();
  }

  calculateDatagrid() {
    this.cols = this.dynamicData.createColumns(this.totalCols);

    this.allRows.next(this.dynamicData.createRows(this.cols, this.totalRows));

    this.loadUsers();
  }

  loadUsers() {
    this.inventory.size = this.totalRows;
    this.inventory.all = [];
    this.inventory.lazyLoadUsers(this.inventory.size);

    this.users = this.inventory.getAllUsersSubject();
  }

  showChangeDetection() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const profiler = ng.profiler;

    this.timeCD = profiler.timeChangeDetection({ record: true });
  }

  setExpanded($event: boolean, user: User | Row) {
    user.expanded = $event;
  }

  colByIndex(index: number, col: Column) {
    return col.index;
  }

  rowByIndex(index: number, row: Row) {
    return row.index;
  }

  renderRangeChange($event: ListRange) {
    console.log($event);
    // this.loadMore($event);
  }
}
