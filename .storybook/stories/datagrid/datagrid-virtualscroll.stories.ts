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

import { behaviorElements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Virtual Scroll',
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
    clrRenderRangeChange: { control: { disable: true } },
    clrDgActionOverflowOpenChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    behaviorElements: { control: { disable: true }, table: { disable: true } },
    toggleSelectAll: { control: { disable: true }, table: { disable: true } },
    setExpanded: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDgActionOverflowOpen: false,
    clrDgActionOverflowButtonLabel: commonStringsDefault.rowActions,
    clrDetailExpandableAriaLabel: commonStringsDefault.detailExpandableAriaLabel,
    clrDgLoading: false,
    clrLoadingMoreItems: false,
    clrDgPreserveSelection: false,
    clrDgRowSelection: false,
    clrDgSingleActionableAriaLabel: commonStringsDefault.singleActionableAriaLabel,
    clrDgSingleSelectionAriaLabel: commonStringsDefault.singleSelectionAriaLabel,
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    clrRenderRangeChange: action('clrRenderRangeChange'),
    clrDgActionOverflowOpenChange: action('clrDgActionOverflowOpenChange'),
    // story helpers
    behaviorElements,
    customSelectAll: false,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    actionOverflow: false,
    compact: false,
    hidableColumns: false,
    height: 480,
    selectedRows: [],
    toggleSelectAll,
    setExpanded,
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
      *ngIf="{ elements: behaviorElements | async }; let data"
      ${args.height ? '[style.height.px]="height"' : ''}
      ${args.multiSelectable ? '[clrDgSelected]="selectedRows"' : ''}
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
      [clrLoadingMoreItems]="clrLoadingMoreItems"
    >
      <clr-checkbox-wrapper *ngIf="customSelectAll && data.elements" class="clr-dg-custom-select-all">
        <input
          clrCheckbox
          type="checkbox"
          (click)="selectedRows = toggleSelectAll($event, data.elements, selectedRowIndexes)"
        />
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
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
      </clr-dg-column>

      <ng-template
        *ngIf="data.elements"
        clrVirtualScroll
        let-element
        let-index="index"
        [clrVirtualRowsOf]="data.elements"
        [clrVirtualRowsTemplateCacheSize]="400"
        (renderedRangeChange)="clrRenderRangeChange($event)"
      >
        <clr-dg-row [clrDgItem]="element">
          <clr-dg-action-overflow
            *ngIf="actionOverflow"
            [clrDgActionOverflowOpen]="clrDgActionOverflowOpen && index === 0"
            [clrDgActionOverflowButtonLabel]="clrDgActionOverflowButtonLabel"
            (clrDgActionOverflowOpenChange)="index === 0 && clrDgActionOverflowOpenChange($event)"
          >
            <button class="action-item">Edit</button>
            <button class="action-item">Delete</button>
          </clr-dg-action-overflow>
          <clr-dg-cell>{{ element.name }}</clr-dg-cell>
          <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
          <clr-dg-cell>{{ element.number }}</clr-dg-cell>
          <clr-dg-cell class="electronegativity-container">
            {{ element.electronegativity }}
            <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
          </clr-dg-cell>
          <ng-container *ngIf="expandable" ngProjectAs="clr-dg-row-detail">
            <clr-dg-row-detail [clrIfExpanded]="!!element.expanded" (clrIfExpandedChange)="setExpanded($event, element)">
              {{ element | json }} {{ element.expanded }}
            </clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-template>

      <clr-dg-footer>{{ data.elements?.length }}</clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

// toggles selection of every even element
function toggleSelectAll($event: any, data: Element[]) {
  return $event.target.checked ? data.filter((el, i) => i % 2) : [];
}

function setExpanded($event, element) {
  element.expanded = $event;
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
    selectedRows: [behaviorElements.value[1]],
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
    selectedRows: [behaviorElements.value[1]],
  },
};

export const Full: StoryObj = {
  render: DatagridTemplate,
  args: {
    actionOverflow: true,
    expandable: true,
    hidableColumns: true,
    multiSelectable: true,
  },
};

export const FullCompact: StoryObj = {
  render: DatagridTemplate,
  args: {
    actionOverflow: true,
    compact: true,
    expandable: true,
    hidableColumns: true,
    multiSelectable: true,
  },
};
