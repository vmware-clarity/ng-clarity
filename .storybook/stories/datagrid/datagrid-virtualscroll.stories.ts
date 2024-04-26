/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagrid, ClrDatagridModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { behaviorElements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Virtual Scroll',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
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
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    behaviorElements: { control: { disable: true }, table: { disable: true } },
    setExpanded: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
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
    // story helpers
    behaviorElements,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 480,
    selectedRows: [],
    setExpanded,
  },
};

const DatagridTemplate: StoryFn = args => ({
  template: `
    <style>
      .electronegativity-container {
        background-color: #119cd4;
        display: inline-block;
      }
      .electronegativity-text {
        width: 3rem;
        display: inline-block;
      }
    </style>
    <clr-datagrid
      *ngIf="{ elements: behaviorElements | async }; let data"
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
      [clrLoadingMoreItems]="clrLoadingMoreItems"
    >
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
        customClrVirtualRows
        let-element
        let-index="index"
        [customClrVirtualRowsOf]="data.elements"
        [customClrVirtualRowsTemplateCacheSize]="400"
        (renderedRangeChange)="clrRenderRangeChange($event)"
      >
        <clr-dg-row
          [clrDgItem]="element"
          [clrDgSelected]="selectedRows.includes(index)"
        >
          <clr-dg-cell>{{ element.name }}</clr-dg-cell>
          <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
          <clr-dg-cell>{{ element.number }}</clr-dg-cell>
          <clr-dg-cell>
            <span class="electronegativity-text">{{ element.electronegativity }}</span>
            <span [style.width.%]="(element.electronegativity * 100) / 5"
             class="electronegativity-container"
             >&nbsp;</span>
          </clr-dg-cell>
          <ng-container *ngIf="expandable" ngProjectAs="clr-dg-row-detail">
            <clr-dg-row-detail
              [clrIfExpanded]="element.expanded"
              (clrIfExpandedChange)="setExpanded($event, element)"
            >{{ element | json }} {{element.expanded}}</clr-dg-row-detail>
          </ng-container>
        </clr-dg-row>
      </ng-template>


    <clr-dg-footer> {{data.elements?.length}} </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

function setExpanded($event, element) {
  console.log($event, element);
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
    selectedRows: [1],
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
    selectedRows: [1],
  },
};
