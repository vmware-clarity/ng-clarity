/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrInputModule,
  ClrNumberInputModule,
  ClrSelectModule,
  SelectionType,
  selectionTypeAttribute,
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
    FormsModule,
  ],
  template: `
    <form clrForm>
      <clr-number-input-container cds-layout="m-t:xs">
        <label>Number of items</label>
        <input clrNumberInput type="number" name="total" [(ngModel)]="options.totalItems" />
      </clr-number-input-container>

      <clr-select-container cds-layout="m-t:xs">
        <label>Selection type</label>
        <select
          clrSelect
          name="selection-type"
          [ngModel]="options.selectionType"
          (ngModelChange)="onSelectionTypeChange($event)"
        >
          <option [value]="SelectionType.None">No selection</option>
          <option [value]="SelectionType.Single">Single selection</option>
          <option [value]="SelectionType.Multi">Multi selection</option>
        </select>
      </clr-select-container>

      <clr-select-container cds-layout="m-t:xs">
        <label>Page size</label>
        <select
          clrSelect
          name="page-size"
          [ngModel]="options.pageSize"
          (ngModelChange)="onPageSizeChange($event)"
        >
          <option [value]="0">No pagination</option>
          <option [value]="5">5</option>
          <option [value]="10">10</option>
          <option [value]="25">25</option>
          <option [value]="50">50</option>
          <option [value]="100">100</option>
        </select>
      </clr-select-container>

      <clr-input-container cds-layout="m-t:xs">
        <label>Page size options</label>
        <input
          clrInput
          type="text"
          name="paginationOptions"
          [ngModel]="options.pageSizeOptions"
          (ngModelChange)="onPageSizeOptionsChange($event)"
        />
      </clr-input-container>

      <clr-toggle-container clrInline cds-layout="m-t:xs">
        <label>Layout model</label>

        <clr-toggle-wrapper>
          <input
            type="checkbox"
            clrToggle
            [(ngModel)]="options.compactDatagrid"
            name="compactDatagrid"
          />
          <label>Compact grid</label>
        </clr-toggle-wrapper>

        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle [(ngModel)]="options.disabled" name="gridDisabled" />
          <label>Disabled</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>

      <clr-toggle-container clrInline cds-layout="m-t:xs">
        <label>Footer model</label>
        @if (options.enableExport !== undefined) {
          <clr-checkbox-wrapper>
            <input type="checkbox" clrToggle [(ngModel)]="options.enableExport" name="showExport" />
            <label>Enable export</label>
          </clr-checkbox-wrapper>
        }

        <clr-toggle-wrapper>
          <input
            type="checkbox"
            clrToggle
            [(ngModel)]="options.showColumnToggle"
            name="showColumnToggle"
          />
          <label>Show column toggle</label>
        </clr-toggle-wrapper>

        <clr-checkbox-wrapper>
          <input type="checkbox" clrToggle [(ngModel)]="options.showFooter" name="showFooter" />
          <label>Show footer</label>
        </clr-checkbox-wrapper>
      </clr-toggle-container>

      <clr-toggle-container clrInline cds-layout="m-t:xs">
        <clr-toggle-wrapper>
          <input
            type="checkbox"
            clrToggle
            [(ngModel)]="options.enableRowSelection"
            name="enableRowSelection"
          />
          <label>Row Selection</label>
        </clr-toggle-wrapper>

        <clr-toggle-wrapper>
          <input type="checkbox" clrToggle [(ngModel)]="options.loading" name="showLoading" />
          <label>Loading</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>
    </form>
  `,
})
export class GridConfigFormComponent {
  @Input() options!: GridConfigDemoOptions;

  protected readonly optionsChange = output<GridConfigDemoOptions>();

  protected SelectionType = SelectionType;

  protected onSelectionTypeChange(selectionType: SelectionType | string) {
    this.options.selectionType = selectionTypeAttribute(selectionType);
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
