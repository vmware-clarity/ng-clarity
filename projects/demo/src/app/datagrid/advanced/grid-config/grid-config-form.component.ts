/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrInputModule,
  ClrNumberInputModule,
  ClrSelectModule,
  SelectionType,
} from '@clr/angular';

export interface GridConfigDemoOptions {
  totalItems: number;
  selectionType: SelectionType;
  pageSize?: number; // not required for virtual scrolling
  pageSizeOptions?: number[]; // not required for virtual scrolling
  showColumnToggle: boolean;
  showFooter: boolean;
  enableRowSelection: boolean;
  compactDatagrid: boolean;
  disabled: boolean;
  loading: boolean;
  enableExport?: boolean;
  showFilter?: boolean;
}

@Component({
  selector: 'grid-confirm-form',
  imports: [ClrCheckboxModule, ClrDatagridModule, ClrInputModule, ClrNumberInputModule, ClrSelectModule, FormsModule],
  standalone: true,
  templateUrl: 'grid-config-form.component.html',
})
export class GridConfigFormComponent {
  @Input() protected options: GridConfigDemoOptions;

  @Output() protected optionsChange = new EventEmitter<GridConfigDemoOptions>();

  protected SelectionType = SelectionType;

  protected onSelectionTypeChange(selectionType: SelectionType) {
    this.options.selectionType = selectionType;
    this.optionsChange.emit(this.options);
  }

  protected onPageSizeChange(pageSize: string): void {
    this.options.pageSize = Number(pageSize);
    this.optionsChange.emit(this.options);
  }

  protected onPageSizeOptionsChange(pageSizeOptions: string) {
    this.options.pageSizeOptions = pageSizeOptions.split(',').map(Number);
    this.optionsChange.emit(this.options);
  }
}
