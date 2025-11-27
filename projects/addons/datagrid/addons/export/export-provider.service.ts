/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Inject, Injectable, Optional, Renderer2 } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';

import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ColumnSortOrder } from '../../interfaces/column-state';
import { appfxDatagridErrorNotifiableToken, ErrorNotifiable } from '../../interfaces/tokens';
import { CsvHelperService } from './csv-helper.service';
import { ExportType } from './export-type';
import {
  ClientSideExportConfig,
  DatagridItemSet,
  defaultFileExtension,
  defaultFileName,
  ExportStatus,
} from './export.interface';

@Injectable()
export class ExportProviderService {
  constructor(
    private csvHelperService: CsvHelperService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private dgStrings: DatagridStrings,
    @Optional()
    @Inject(appfxDatagridErrorNotifiableToken)
    private errorNotifiableService: ErrorNotifiable
  ) {}

  exportUIOnlyData(
    datagridProperties: ClientSideExportConfig,
    exportStatus: ExportStatus,
    datagridItemSet: DatagridItemSet
  ): void {
    try {
      exportStatus.inProgress = true;

      let exportItems = datagridItemSet.totalDatagridItems;
      if (exportStatus.exportType === ExportType.SELECTED_ONLY) {
        exportItems = datagridItemSet.selectedItems;
      } else if (exportStatus.exportType === ExportType.MATCHING_FILTERS) {
        exportItems = datagridItemSet.filteredDatagridItems;
      }

      if (exportItems.length > 1 && datagridProperties.sort) {
        const sortFunction = datagridProperties.sortFunction || this.sortExportedItems;
        exportItems = sortFunction(exportItems, datagridProperties.sortOrder as ColumnSortOrder);
      }

      const csvData = this.csvHelperService.getData(exportItems, datagridProperties?.columnDefinitions || []);

      exportStatus.inProgress = false;
      this.downloadFile(csvData, datagridProperties.exportedFileName);
    } catch (exception) {
      exportStatus.inProgress = false;
      this.showExportError();
    }
  }

  /**
   * Function to create a CSV file from CsvData and download it
   */
  downloadFile(csvData: string, exportedFileName?: string) {
    try {
      const blob = new Blob([csvData], { type: 'text/plain' });
      let fileName = defaultFileName + defaultFileExtension;
      if (exportedFileName) {
        fileName = exportedFileName + defaultFileExtension;
      }

      const csvDataUrl = URL.createObjectURL(blob);
      const downloadLink = this.renderer.createElement('a');
      downloadLink.setAttribute('href', csvDataUrl);
      downloadLink.setAttribute('download', fileName);
      this.renderer.appendChild(this.elementRef.nativeElement, downloadLink);
      downloadLink.click();

      setTimeout(() => {
        this.renderer.removeChild(this.elementRef.nativeElement, downloadLink);
        URL.revokeObjectURL(csvDataUrl);
        downloadLink.remove();
      }, 100);
    } catch (exception) {
      this.showExportError();
    }
  }

  private showExportError(): void {
    if (this.errorNotifiableService) {
      this.errorNotifiableService.notifyError(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
    } else {
      console.error(this.dgStrings.exportErrorTitle, this.dgStrings.exportErrorMessage);
    }
  }

  /**
   * Sort function used internally from ExportProviderService to sort exported items.
   */
  private sortExportedItems(gridItems: any[], sortOrder: ColumnSortOrder) {
    if (!sortOrder) {
      return gridItems;
    }
    const forField = sortOrder.column.field;
    const sortedItems = gridItems.sort((a: any, b: any): number => {
      if (!Object.prototype.hasOwnProperty.call(a, forField) || !Object.prototype.hasOwnProperty.call(b, forField)) {
        return 0;
      }
      const valA = (a as any)[forField];
      const valB = (b as any)[forField];
      if (valA === null || valA === undefined) {
        if (valB === null || valB === undefined) {
          return 0;
        } else {
          return 1;
        }
      }

      if (valB === null || valB === undefined) {
        return -1;
      }

      return valA.localeCompare(valB);
    });

    return sortOrder.sortOrder === ClrDatagridSortOrder.DESC ? sortedItems.reverse() : sortedItems;
  }
}
