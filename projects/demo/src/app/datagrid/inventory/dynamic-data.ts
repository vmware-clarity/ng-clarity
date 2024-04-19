/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetection } from '@angular/cli/lib/config/workspace-schema';
import { Injectable } from '@angular/core';

export interface Column {
  index: number;
  name: string;
}
export interface Row {
  index: number;
  cells: ChangeDetection[];
}
@Injectable()
export class DynamicData {
  createColumns(count = 10) {
    const columns: Column[] = [];
    for (let i = 0; i < count; i++) {
      columns.push({
        index: i,
        name: `col${i + 1}`,
      });
    }

    return columns;
  }

  createRows(columns: Column[], rowCount = 10) {
    const rows: Row[] = [];
    for (let i = 0; i < rowCount; i++) {
      const newRow: Row = {
        index: i,
        cells: [],
      };
      for (let j = 0; j < columns.length; j++) {
        newRow.cells[columns[j].name] = `${columns[j].name} row-${i + 1}`;
      }
      rows.push(newRow);
    }

    return rows;
  }
}
