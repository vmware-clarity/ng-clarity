/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagrid, ClrDatagridModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

interface Column {
  index: number;
  name: string;
}

const createColumns = (count = 10) => {
  const columns: Column[] = [];
  for (let i = 0; i < count; i++) {
    columns.push({
      index: i,
      name: `col${i + 1}`,
    });
  }

  return columns;
};
const columns: Column[] = createColumns(50);

interface Row {
  index: number;
  cells: any[];
}
const createRows = (columns: Column[], rowCount = 10) => {
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
};
const dynamicRows = createRows(columns, 500);

const defaultStory: Story = args => ({
  template: `
    <clr-datagrid
      ${args.height ? '[style.height.px]="height"' : ''}
      ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
      [ngClass]="{ 'datagrid-compact': compact }"
      [clrDetailExpandableAriaLabel]="clrDetailExpandableAriaLabel"
      [clrDgDisablePageFocus]="clrDgDisablePageFocus"
      [clrDgLoading]="clrDgLoading"
      [clrDgPreserveSelection]="clrDgPreserveSelection"
      [clrDgRowSelection]="clrDgRowSelection"
      [clrDgSingleActionableAriaLabel]="clrDgSingleActionableAriaLabel"
      [clrDgSingleSelectionAriaLabel]="clrDgSingleSelectionAriaLabel"
      (clrDgRefresh)="clrDgRefresh($event)"
      (clrDgSingleSelectedChange)="clrDgSingleSelectedChange($event)"
      (clrDgRefresh)="clrDgRefresh($event)"
    >
      <clr-dg-column *ngFor="let col of columns trackBy: colByIndex">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>{{col.name}}</ng-container>
      </clr-dg-column>

      <clr-dg-row *clrDgItems="let row of dynamicRows trackBy: rowByIndex" [clrDgItem]="row">
        <clr-dg-cell *ngFor="let col of columns trackBy: colByIndex" >{{row.cells[col.name]}}</clr-dg-cell>
        <ng-container *ngIf="expandable" ngProjectAs="clr-dg-row-detail">
          <clr-dg-row-detail *clrIfExpanded>{{row|json}}</clr-dg-row-detail>
        </ng-container>
      </clr-dg-row>

      <clr-dg-footer>
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Elements per page</clr-dg-page-size>
          {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} rows
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Datagrid/Performance',
  component: ClrDatagrid,
  argTypes: {
    // inputs
    clrDetailExpandableAriaLabel: { defaultValue: commonStringsDefault.detailExpandableAriaLabel },
    clrDgLoading: { defaultValue: false },
    clrDgPreserveSelection: { defaultValue: false },
    clrDgRowSelection: { defaultValue: false },
    clrDgSelected: { control: { disable: true } },
    clrDgSingleActionableAriaLabel: { defaultValue: commonStringsDefault.singleActionableAriaLabel },
    clrDgSingleSelected: { control: { disable: true } },
    clrDgSingleSelectionAriaLabel: { defaultValue: commonStringsDefault.singleSelectionAriaLabel },
    // outputs
    clrDgRefresh: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    clrDgSingleSelectedChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    columns: { control: { disable: true }, table: { disable: true } },
    dynamicRows: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    // story helpers
    columns,
    dynamicRows,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 0,
  },
};

const variants: Parameters[] = [
  {
    hidableColumns: false,
  },
  {
    hidableColumns: true,
  },
];

setupStorybook([ClrDatagridModule, ClrConditionalModule], defaultStory, defaultParameters, variants);
