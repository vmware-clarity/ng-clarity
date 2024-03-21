/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Column, DynamicData, Row } from '../inventory/dynamic-data';

class ChangeDetectionPerfRecord {
  msPerTick: 0;
  numTicks: 0;
}

@Component({
  selector: 'clr-datagrid-virtual-scroll-demo',
  providers: [DynamicData],
  templateUrl: './virtual-scroll.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridVirtualScrollDemo implements OnInit {
  totalRows = 10000;
  totalCols = 52;
  cols: Column[];
  rows: Observable<Row[]>;
  timeCD: ChangeDetectionPerfRecord;

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor(
    private dynamicData: DynamicData,
    private cdr: ChangeDetectorRef,
    private applicationRef: ApplicationRef
  ) {
    this.timeCD = new ChangeDetectionPerfRecord();

    this.rows = this.allRows;

    const originalTick = this.applicationRef.tick;
    this.applicationRef.tick = function () {
      const before = window.performance.now();
      const retValue = originalTick.apply(this);
      const after = window.performance.now();

      window.console.log('CHANGE DETECTION TIME', after - before);
      return retValue;
    };
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
  }

  showChangeDetection() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const profiler = ng.profiler;

    this.timeCD = profiler.timeChangeDetection({ record: true });
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
