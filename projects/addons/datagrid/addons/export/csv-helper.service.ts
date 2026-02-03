/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ExportColumnDefinition } from './export.interface';

/**
 * Helper functions to convert data into CSV format
 */
@Injectable()
export class CsvHelperService {
  getData(rows: any[], columns: ExportColumnDefinition[]): string {
    let columnCsvData = '',
      rowsCsvData = '';
    if (columns) {
      columnCsvData = this.getColumnDataFromColumnDef(columns);
      rowsCsvData = this.getRowDataFromColumnDef(rows, columns);
    }

    const csvData: string = columnCsvData + rowsCsvData;
    return csvData;
  }

  getColumnDataFromColumnDef(columnDefinitions: ExportColumnDefinition[]): string {
    const columnNames: string[] = [];
    for (const columnDef of columnDefinitions) {
      const columnName = this.toCsvFormat(columnDef.displayName.toString());
      columnNames.push(columnName);
    }
    const columnCsvData: string = columnNames.join(',') + '\n';
    return columnCsvData;
  }

  getRowDataFromColumnDef(exportItems: any[], columnDefinitions: ExportColumnDefinition[]): string {
    let rowsCsvData = '';
    for (const item of exportItems) {
      const rowValues: string[] = [];
      for (const columnDef of columnDefinitions) {
        let exportValue = '';
        const itemValue = this.getItemValueFromColumnField(item, columnDef.field);

        if (!itemValue) {
          exportValue = '';
        } else {
          exportValue = itemValue.toString();
        }
        exportValue = this.toCsvFormat(exportValue);
        rowValues.push(exportValue);
      }
      rowsCsvData += rowValues.join(',') + '\n';
    }
    return rowsCsvData;
  }

  toCsvFormat(itemValue: string): string {
    if (itemValue.indexOf('"') > -1) {
      itemValue = itemValue.replace(/"/g, '""');
    }
    itemValue = '"' + itemValue.toString() + '"';
    return itemValue;
  }

  /** To extract value from nested JSON objects."
   * Example =>
   * JSON object to extract value from => { product: {cost: {limit: 100, lowestValue: 0 }}}
   * Field format => "product.cost.limit'
   * Value returned => 100
   */
  private getItemValueFromColumnField(item: any, field: string): any {
    if (field.indexOf('.') > 0) {
      const fieldNames = field.split('.');
      let itemValue = item;
      for (const str of fieldNames) {
        itemValue = itemValue[str];
        if (!itemValue) {
          itemValue = item[field];
          break;
        }
      }
      return itemValue;
    }
    return item[field];
  }
}
