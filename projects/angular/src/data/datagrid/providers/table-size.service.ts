/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
@Injectable()
export class TableSizeService {
  private _tableRef: HTMLElement;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  get tableRef(): HTMLElement {
    return this._tableRef;
  }
  set tableRef(element: HTMLElement) {
    this._tableRef = element;
  }

  set table(table: ElementRef<HTMLElement>) {
    if (isPlatformBrowser(this.platformId) && table.nativeElement) {
      this.tableRef = table.nativeElement.querySelector('.datagrid-table');
    }
  }

  // Used when resizing columns to show the column border being dragged.
  getColumnDragHeight(): string {
    if (!this.tableRef) {
      return null;
    }
    return `${this.tableRef.clientHeight}px`;
  }
}
