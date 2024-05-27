/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagrid, ClrDatagridModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { behaviorElements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Virtual Scroll Details',
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
    clrDgActionOverflowOpenChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    behaviorElements: { control: { disable: true }, table: { disable: true } },
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
    singleSelectable: false,
    multiSelectable: false,
    actionOverflow: false,
    compact: false,
    hidableColumns: false,
    height: 480,
    selectedRows: [],
    setExpanded,
  },
};

const DatagridDetailsTemplate: StoryFn = args => ({
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
        ClrVirtualScroll
        let-element
        let-index="index"
        [clrVirtualRowsOf]="data.elements"
        [clrVirtualRowsTemplateCacheSize]="400"
        (renderedRangeChange)="clrRenderRangeChange($event)"
      >
        <clr-dg-row [clrDgItem]="element" [clrDgSelected]="selectedRows.includes(index)">
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
          <clr-dg-cell>
            <span class="electronegativity-text">{{ element.electronegativity }}</span>
            <span [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-container">
              &nbsp;
            </span>
          </clr-dg-cell>
        </clr-dg-row>
      </ng-template>
      <clr-dg-detail [ngClass]="{ highlight }" *clrIfDetail="let detail">
        <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
        <clr-dg-detail-body [ngSwitch]="detailContentType">
          <pre>{{ detail | json }}</pre>
        </clr-dg-detail-body>
      </clr-dg-detail>
      <clr-dg-footer>{{ data.elements?.length }}</clr-dg-footer>
    </clr-datagrid>
    {{ details }}
  `,
  props: { ...args },
});

function setExpanded($event, element) {
  element.expanded = $event;
}

export const Datagrid: StoryObj = {
  render: DatagridDetailsTemplate,
};

export const Full: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    actionOverflow: true,
    hidableColumns: true,
    singleSelectable: true,
  },
};

export const FullCompact: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    actionOverflow: true,
    compact: true,
    hidableColumns: true,
    multiSelectable: true,
  },
};
