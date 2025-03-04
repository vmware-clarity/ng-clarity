/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrCheckboxModule,
  ClrConditionalModule,
  ClrDatagrid,
  ClrDatagridModule,
  commonStringsDefault,
} from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Datagrid',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule, ClrCheckboxModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDgSelected: { control: { disable: true } },
    clrDgSingleSelected: { control: { disable: true } },
    // outputs
    clrDgRefresh: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    clrDgSingleSelectedChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    toggleSelectAll: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDetailExpandableAriaLabel: commonStringsDefault.detailExpandableAriaLabel,
    clrDgLoading: false,
    clrDgPreserveSelection: false,
    clrDgRowSelection: false,
    clrDgSingleActionableAriaLabel: commonStringsDefault.singleActionableAriaLabel,
    clrDgSingleSelectionAriaLabel: commonStringsDefault.singleSelectionAriaLabel,
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    // story helpers
    elements,
    customSelectAll: false,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    height: 0,
    selectedRowIndexes: [],
    selectedRows: [],
    toggleSelectAll,
  },
};

const DatagridTemplate: StoryFn = args => ({
  template: `
    <style>
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
      ${args.multiSelectable ? '[clrDgSelected]="selectedRows"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
      [ngClass]="{ 'datagrid-compact': compact, 'datagrid-overflow-ellipsis': overflowEllipsis }"
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
      <clr-checkbox-wrapper *ngIf="customSelectAll" class="clr-dg-custom-select-all">
        <input clrCheckbox type="checkbox" (click)="selectedRows = toggleSelectAll($event, elements)" />
      </clr-checkbox-wrapper>

      <clr-dg-column [style.width.px]="250">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Name</ng-container>
      </clr-dg-column>
      <clr-dg-column [style.width.px]="250">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Symbol</ng-container>
      </clr-dg-column>
      <clr-dg-column [style.width.px]="250">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Number</ng-container>
      </clr-dg-column>
      <clr-dg-column [style.width.px]="250" *ngIf="overflowEllipsis">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Long text width 250px</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
      </clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements; let index = index" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
        <clr-dg-cell>{{ element.number }}</clr-dg-cell>
        <clr-dg-cell *ngIf="overflowEllipsis">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
          Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque sed
          arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh lacus, in
          eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
        </clr-dg-cell>
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

// toggles selection of every even element
function toggleSelectAll($event: any, data: Element[]) {
  return $event.target.checked ? data.filter((el, i) => i % 2) : [];
}

export const Datagrid: StoryObj = {
  render: DatagridTemplate,
};

export const SingleSelect: StoryObj = {
  render: DatagridTemplate,
  args: {
    singleSelectable: true,
  },
};
export const MultiSelect: StoryObj = {
  render: DatagridTemplate,
  args: {
    multiSelectable: true,
  },
};
export const MultiSelectWithSelection: StoryObj = {
  render: DatagridTemplate,
  args: {
    multiSelectable: true,
    selectedRows: [elements[1]],
  },
};

export const ManageColumns: StoryObj = {
  render: DatagridTemplate,
  args: {
    hidableColumns: true,
  },
};

export const Compact: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
  },
};
export const CompactSingleSelect: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    singleSelectable: true,
  },
};
export const CompactMultiSelect: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    multiSelectable: true,
  },
};
export const CompactMultiSelectWithSelection: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    multiSelectable: true,
    selectedRows: [elements[1]],
  },
};

export const CompactOverflowEllipsis: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    overflowEllipsis: true,
  },
};
