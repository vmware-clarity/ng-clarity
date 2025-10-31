/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagrid,
  ClrDatagridModule,
  ClrDropdownModule,
  commonStringsDefault,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Datagrid',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule, ClrDropdownModule],
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
  },
  args: {
    // inputs
    clrDetailExpandableAriaLabel: commonStringsDefault.detailExpandableAriaLabel,
    clrDgLoading: false,
    clrDgPreserveSelection: false,
    clrDgRowSelection: false,
    clrDgCustomSelectAllEnabled: false,
    clrDgSingleActionableAriaLabel: commonStringsDefault.singleActionableAriaLabel,
    clrDgSingleSelectionAriaLabel: commonStringsDefault.singleSelectionAriaLabel,
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgCustomSelectAll(this: { selectedRows: number[] }, selectAllChecked: boolean) {
      action('clrDgCustomSelectAll').apply(this, [selectAllChecked]);
      this.selectedRows = selectAllChecked ? elements.map((element, i) => i).filter(i => i % 2) : [];
    },
    clrDgItemsIdentityFn: item => item.id,
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    // story helpers
    elements,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    showActions: false,
    height: 0,
    selectedRows: [],
    selectedRow: null,
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
      ${args.multiSelectable ? '[(clrDgSelected)]="selectedRows"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="selectedRow"' : ''}
      [ngClass]="{ 'datagrid-compact': compact, 'datagrid-overflow-ellipsis': overflowEllipsis }"
      [clrDgItemsIdentityFn]="clrDgItemsIdentityFn"
      [clrDetailExpandableAriaLabel]="clrDetailExpandableAriaLabel"
      [clrDgDisablePageFocus]="clrDgDisablePageFocus"
      [clrDgLoading]="clrDgLoading"
      [clrDgPreserveSelection]="clrDgPreserveSelection"
      [clrDgRowSelection]="clrDgRowSelection"
      [clrDgCustomSelectAllEnabled]="clrDgCustomSelectAllEnabled"
      [clrDgSingleActionableAriaLabel]="clrDgSingleActionableAriaLabel"
      [clrDgSingleSelectionAriaLabel]="clrDgSingleSelectionAriaLabel"
      (clrDgRefresh)="clrDgRefresh($event)"
      (clrDgSelectedChange)="clrDgSelectedChange($event)"
      (clrDgSingleSelectedChange)="clrDgSingleSelectedChange($event)"
      (clrDgCustomSelectAll)="clrDgCustomSelectAll($event)"
    >
      <clr-dg-action-bar *ngIf="showActions">
        <div class="btn-group" role="group" aria-label="Available Actions">
          <clr-dropdown>
            <button type="button" class="btn btn-sm btn-secondary" clrDropdownTrigger>
              Per Page
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen>
              <button type="button" clrDropdownItem>10</button>
              <button type="button" clrDropdownItem>20</button>
              <button type="button" clrDropdownItem>50</button>
              <button type="button" clrDropdownItem>100</button>
            </clr-dropdown-menu>
          </clr-dropdown>
          <button type="button" class="btn btn-sm btn-secondary">Delete</button>
          <button type="button" class="btn btn-sm btn-secondary">Edit</button>
        </div>
        <div class="btn-group" role="group" aria-label="Available Actions">
          <button type="button" class="btn btn-sm btn-secondary">Add to group</button>
          <clr-dropdown>
            <button type="button" class="btn btn-sm btn-secondary" clrDropdownTrigger>
              Per Page
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen>
              <button type="button" clrDropdownItem>10</button>
              <button type="button" clrDropdownItem>20</button>
              <button type="button" clrDropdownItem>50</button>
              <button type="button" clrDropdownItem>100</button>
            </clr-dropdown-menu>
          </clr-dropdown>
          <button type="button" class="btn btn-sm btn-secondary">Delete</button>
        </div>
        <div class="btn-group" role="group" aria-label="Available Actions">
          <clr-dropdown>
            <button type="button" class="btn btn-sm btn-secondary" clrDropdownTrigger>
              Per Page
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen>
              <button type="button" clrDropdownItem>10</button>
              <button type="button" clrDropdownItem>20</button>
              <button type="button" clrDropdownItem>50</button>
              <button type="button" clrDropdownItem>100</button>
            </clr-dropdown-menu>
          </clr-dropdown>
        </div>
      </clr-dg-action-bar>
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

export const Datagrid: StoryObj = {
  render: DatagridTemplate,
};

export const SingleSelect: StoryObj = {
  render: DatagridTemplate,
  args: {
    singleSelectable: true,
  },
};

export const SingleSelectWithSelection: StoryObj = {
  render: DatagridTemplate,
  args: {
    singleSelectable: true,
    selectedRow: { ...elements[1] },
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
    selectedRows: [{ ...elements[1] }, { ...elements[2] }],
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

export const CompactSingleSelectWithSelection: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    singleSelectable: true,
    selectedRow: { ...elements[1] },
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
    selectedRows: [{ ...elements[1] }, { ...elements[2] }],
  },
};

export const CompactOverflowEllipsis: StoryObj = {
  render: DatagridTemplate,
  args: {
    compact: true,
    overflowEllipsis: true,
  },
};
export const ActionsBar: StoryObj = {
  render: DatagridTemplate,
  args: {
    showActions: true,
  },
};
export const CompactActionsBar: StoryObj = {
  render: DatagridTemplate,
  args: {
    showActions: true,
    compact: true,
  },
};

export const Loading: StoryObj = {
  render: DatagridTemplate,
  args: {
    clrDgLoading: true,
  },
};
export const CompactLoading: StoryObj = {
  render: DatagridTemplate,
  args: {
    clrDgLoading: true,
    compact: true,
  },
};
export const LoadingWithActionsBar: StoryObj = {
  render: DatagridTemplate,
  args: {
    clrDgLoading: true,
    showActions: true,
  },
};
export const CompactLoadingWithActionsBar: StoryObj = {
  render: DatagridTemplate,
  args: {
    clrDgLoading: true,
    showActions: true,
    compact: true,
  },
};
