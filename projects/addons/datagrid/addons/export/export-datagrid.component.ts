/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ExportType } from './export-type';
import { ExportStatus } from './export.interface';

@Component({
  selector: 'appfx-dg-export',
  standalone: false,
  templateUrl: 'export-datagrid.component.html',
  styleUrls: ['export-datagrid.component.scss'],
})
export class ExportDatagridComponent {
  /**
   * All grid items count
   */
  @Input() allItemsCount: any = 0;

  /**
   * All filtered items count
   */
  @Input() filteredItemsCount: any = 0;

  /**
   * Selected items in the datagrid
   */
  @Input() selectedItemsCount: any = 0;

  /**
   * Event emitter to tell the hosting view that user has requested to export list data
   */
  @Output() exportEventEmitter: EventEmitter<ExportStatus> = new EventEmitter<ExportStatus>();

  allRowsCount: string;
  selectedRowsCount: string;
  matchedFilterRowsCount: string;
  exportType: any;
  exportStatus: ExportStatus = { inProgress: false, exportType: ExportType.ALL };

  constructor(public dgStrings: DatagridStrings) {
    this.exportType = ExportType;
  }

  /**
   * Export event is emitted on Export button click and no dropdown options are available
   * All Items are Exported.
   */
  exportAllIfOnlyOption(): void {
    if (this.selectedItemsCount === 0 && this.filteredItemsCount === 0) {
      this.exportStatus.exportType = this.exportType.ALL;
      this.exportEventEmitter.emit(this.exportStatus);
    } else {
      this.allRowsCount = '';
      this.selectedRowsCount = '';
      this.matchedFilterRowsCount = '';

      if (this.allItemsCount) {
        this.allRowsCount = `(${this.allItemsCount})`;
      } else {
        this.allRowsCount = `(0)`;
      }
      if (this.filteredItemsCount) {
        this.matchedFilterRowsCount = `(${this.filteredItemsCount})`;
      } else {
        this.matchedFilterRowsCount = `(0)`;
      }
      if (this.selectedItemsCount) {
        this.selectedRowsCount = `(${this.selectedItemsCount})`;
      } else {
        this.selectedRowsCount = `(0)`;
      }
    }
  }

  /**
   * Handler function called when one of the export options is clicked
   */
  onExportClick(exportType: ExportType) {
    this.exportStatus.exportType = exportType;
    this.exportEventEmitter.emit(this.exportStatus);
  }
}
