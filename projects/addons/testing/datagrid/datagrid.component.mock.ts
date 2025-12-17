/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ClrDatagridVirtualScrollRangeInterface } from '@clr/angular';

@Component({
  selector: 'appfx-datagrid',
  standalone: false,
  template: ``,
})
export class MockAppfxDatagridComponent {
  @Input() gridItems: any;
  @Input() columns: any;
  @Input() layoutModel: any;
  @Input() footerModel: any;
  @Input() pageSize: number;
  @Input() pageSizeOptions: number[];
  @Input() totalItems: number;
  @Input() selectionType: any;
  @Input() selectedItems: any;
  @Input() datagridLabels: any;
  @Input() preSelectFirstItem: boolean;
  @Input() rowSelectionMode: boolean;
  @Input() actionBarActions: any[];
  @Input() showFooter: boolean;
  @Input() singleRowActions: any[];
  @Input() noItemsFoundPlaceholder: string;
  @Input() loading: boolean;
  @Input() serverDrivenDatagrid: boolean;
  @Input() filterMode: any;
  @Input() listItemsCount: number;
  @Input() trackByGridItemProperty: string;
  @Input() isRowLocked: (rowItem: any) => boolean;
  @Input() detailHeader: any;
  @Input() detailBody: any;
  @Input() rowDetailContent: TemplateRef<any>;
  @Input() rowsExpandedByDefault: boolean;
  @Input() vscPersistDatagridSettings: boolean;
  @Input() detailState: any = null;
  @Input() trackByFunction: any;
  @Input() virtualScrolling: boolean;
  @Input() dataRange: ClrDatagridVirtualScrollRangeInterface<any>;

  @Output() selectedItemsChange = new EventEmitter<any>();
  @Output() gridItemsChange = new EventEmitter<any[]>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() refreshGridData = new EventEmitter<any>();
  @Output() refreshVirtualGridData = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<any>();
  @Output() rowActionMenuOpenChange = new EventEmitter<any>();
  @Output() exportDataEvent = new EventEmitter<any>();
  @Output() detailStateChange = new EventEmitter<any>(true);

  clrDatagridPagination: any;

  onModelChange(): void {}
  setSelectedItems(): void {}
}

@Component({
  selector: 'appfx-datagrid',
  standalone: true,
  template: ``,
})
export class MockStandaloneDatagridComponent extends MockAppfxDatagridComponent {}
