/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Column, DynamicData, Row } from '../inventory/dynamic-data';

class ChangeDetectionPerfRecord {
  msPerTick: 0;
  numTicks: 0;
}

@Component({
  selector: 'clr-datagrid-performance-demo',
  providers: [DynamicData],
  templateUrl: 'performance.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridPerformanceDemo implements OnInit {
  totalRows = 10000;
  totalCols = 52;
  cols: Column[];
  rows: Observable<Row[]>;
  timeCD: ChangeDetectionPerfRecord;

  private allRows = new BehaviorSubject<Row[]>([]);

  constructor(private dynamicData: DynamicData, private cdr: ChangeDetectorRef) {
    this.timeCD = new ChangeDetectionPerfRecord();

    this.rows = this.allRows;
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
    // this.rows = this.dynamicData.createRows(this.cols, this.totalRows);
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
