/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectionType } from '@clr/addons/datagrid';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrInputModule,
  ClrNumberInputModule,
  ClrSelectModule,
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
  imports: [
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrInputModule,
    ClrNumberInputModule,
    ClrSelectModule,
    CommonModule,
    FormsModule,
  ],
  standalone: true,
  templateUrl: 'grid-config-form.component.html',
})
export class GridConfigFormComponent {
  @Input() protected options: GridConfigDemoOptions;

  @Output() protected optionsChange = new EventEmitter<GridConfigDemoOptions>();

  protected SelectionType = SelectionType;

  protected onSelectionTypeChange(selectionType: string) {
    this.options.selectionType = this.parseSelectionType(selectionType);
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

  private parseSelectionType(num: string): SelectionType {
    switch (num) {
      case '0':
        return SelectionType.None;
      case '1':
        return SelectionType.Single;
      case '2':
        return SelectionType.Multi;
      default:
        throw new Error(`Invalid selection for type: ${num}`);
    }
  }
}
