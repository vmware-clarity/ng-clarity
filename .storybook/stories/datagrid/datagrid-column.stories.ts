/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagridColumn,
  ClrDatagridModule,
  ClrDatagridSortOrder,
  commonStringsDefault,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Column Filter',
  component: ClrDatagridColumn,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDgField: { control: { disable: true } },
    clrDgSortBy: { type: 'string' },
    clrDgSortOrder: {
      control: { type: 'radio' },
      options: Object.values(ClrDatagridSortOrder).filter(value => typeof value === 'string'),
    },
    // outputs
    clrDgColumnResize: { control: { disable: true } },
    clrDgSortOrderChange: { control: { disable: true } },
    clrFilterValueChange: { control: { disable: true } },
    // methods
    sort: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    ClrDatagridSortOrder: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDgColType: 'string',
    clrFilterNumberMaxPlaceholder: commonStringsDefault.maxValue,
    clrFilterNumberMinPlaceholder: commonStringsDefault.minValue,
    clrFilterStringPlaceholder: commonStringsDefault.filterItems,
    clrFilterValue: '',
    clrDgSortOrder: ClrDatagridSortOrder[ClrDatagridSortOrder.UNSORTED],
    // outputs
    clrDgColumnResize: action('clrDgColumnResize'),
    clrDgSortOrderChange: action('clrDgSortOrderChange'),
    clrFilterValueChange: action('clrFilterValueChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    clrDgDisableUnsort: false,
    height: 0,
    ClrDatagridSortOrder: ClrDatagridSortOrder,
  },
};

const ColumnFilterTemplate: StoryFn = args => ({
  template: `
    <style>
      .highlight {
        border: 1px solid var(--cds-alias-status-danger) !important;
      }
      .electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          background-color: var(--cds-alias-status-info);
        }
      }
    </style>
    <clr-datagrid
      ${args.height ? '[style.height.px]="height"' : ''}
      ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
      [ngClass]="{ 'datagrid-compact': compact }"
    >
      <clr-dg-column
        [style.width.px]="250"
        [ngClass]="{ highlight }"
        [clrDgColType]="clrDgColType"
        clrDgField="name"
        [clrDgSortBy]="clrDgSortBy"
        [clrDgSortOrder]="ClrDatagridSortOrder[clrDgSortOrder]"
        [clrFilterNumberMaxPlaceholder]="clrFilterNumberMaxPlaceholder"
        [clrFilterNumberMinPlaceholder]="clrFilterNumberMinPlaceholder"
        [clrFilterStringPlaceholder]="clrFilterStringPlaceholder"
        [clrFilterValue]="clrFilterValue"
        [clrDgDisableUnsort]="clrDgDisableUnsort"
        (clrDgColumnResize)="clrDgColumnResize($event)"
        (clrDgSortOrderChange)="clrDgSortOrderChange($event)"
        (clrFilterValueChange)="clrFilterValueChange($event)"
      >
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Name</ng-container>
      </clr-dg-column>
      <clr-dg-column [style.width.px]="250">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Symbol</ng-container>
      </clr-dg-column>
      <clr-dg-column [clrDgField]="'number'" [clrDgColType]="'number'" [style.width.px]="250">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Number</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
      </clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
        <clr-dg-cell>{{ element.number }}</clr-dg-cell>
        <clr-dg-cell class="electronegativity-container">
          {{ element.electronegativity }}
          <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
        </clr-dg-cell>
        <ng-container *ngIf="expandable" ngProjectAs="clr-dg-row-detail">
          <clr-dg-row-detail *clrIfExpanded>{{ element | json }}</clr-dg-row-detail>
        </ng-container>
      </clr-dg-row>

      <clr-dg-footer>
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const ColumnFilter: StoryObj = {
  render: ColumnFilterTemplate,
};

export const ColumnNameFilterOpened = {
  render: ColumnFilterTemplate,
  play({ canvasElement }) {
    canvasElement.querySelector('clr-dg-string-filter .datagrid-filter-toggle').click();
  },
};

export const ColumnNumberFilterOpened = {
  render: ColumnFilterTemplate,
  play({ canvasElement }) {
    canvasElement.querySelector('clr-dg-numeric-filter .datagrid-filter-toggle').click();
  },
};
