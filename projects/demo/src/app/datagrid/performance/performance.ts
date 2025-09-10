/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

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
  standalone: false,
})
export class DatagridPerformanceDemo {
  totalRows = 100;
  totalCols = 20;
  cols: Column[];
  rows: Row[];
  timeCD: ChangeDetectionPerfRecord;

  constructor(private dynamicData: DynamicData) {
    this.timeCD = new ChangeDetectionPerfRecord();

    this.calculateDatagrid();
  }

  changeDatagridDimensions() {
    this.calculateDatagrid();
    this.showChangeDetection();
  }

  calculateDatagrid() {
    this.cols = this.dynamicData.createColumns(this.totalCols);
    this.rows = this.dynamicData.createRows(this.cols, this.totalRows);
  }

  showChangeDetection() {
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
}
