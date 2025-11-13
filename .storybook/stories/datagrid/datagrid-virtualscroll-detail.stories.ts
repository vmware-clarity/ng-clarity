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

import { behaviorElements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Virtual Scroll Details',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule, ClrDropdownModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDgSelected: { control: { disable: true } },
    detailsOpened: { control: { disable: true }, table: { disable: true } },
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
    scrollToIndexBehavior: { control: { type: 'radio' }, options: ['auto', 'smooth'] },
    // story helpers
    behaviorElements: { control: { disable: true }, table: { disable: true } },
    setExpanded: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDgActionOverflowOpen: false,
    detailsOpened: false,
    clrDgActionOverflowButtonLabel: commonStringsDefault.rowActions,
    clrDetailExpandableAriaLabel: commonStringsDefault.detailExpandableAriaLabel,
    clrDgLoading: false,
    clrLoadingMoreItems: false,
    clrDgPreserveSelection: false,
    clrDgRowSelection: false,
    clrDgCustomSelectAllEnabled: false,
    clrDgSkeletonLoading: false,
    clrDgSingleActionableAriaLabel: commonStringsDefault.singleActionableAriaLabel,
    clrDgSingleSelectionAriaLabel: commonStringsDefault.singleSelectionAriaLabel,
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    clrRenderRangeChange: action('clrRenderRangeChange'),
    clrDgActionOverflowOpenChange: action('clrDgActionOverflowOpenChange'),
    clrDgCustomSelectAll(this: { selectedRows: number[] }, selectAllChecked: boolean) {
      action('clrDgCustomSelectAll').apply(this, [selectAllChecked]);
      this.selectedRows = selectAllChecked ? behaviorElements.value.map((element, i) => i).filter(i => i % 2) : [];
    },
    // story helpers
    behaviorElements,
    scrollToIndexBehavior: 'smooth',
    singleSelectable: false,
    multiSelectable: false,
    actionOverflow: false,
    compact: false,
    hidableColumns: false,
    scrollOffset: 16,
    showFooterNavButtons: false,
    height: 480,
    selectedRows: [],
    setExpanded,
  },
};

const DatagridDetailsTemplate: StoryFn = args => ({
  template: `
    <style>
      .electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          background-color: var(--cds-alias-status-info);
        }
      }
      .footer-nav-buttons {
        display: inline-block;
        margin-left: var(--cds-global-space-5);
      }
      .footer-button {
        min-width: var(--cds-global-space-9);
        margin: 0 0 0 var(--cds-global-space-5);
        padding: 0;
      }
    </style>
    <clr-datagrid
      #datagrid
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
      [clrDgCustomSelectAllEnabled]="clrDgCustomSelectAllEnabled"
      [clrDgSingleActionableAriaLabel]="clrDgSingleActionableAriaLabel"
      [clrDgSingleSelectionAriaLabel]="clrDgSingleSelectionAriaLabel"
      (clrDgRefresh)="clrDgRefresh($event)"
      (clrDgSelectedChange)="clrDgSelectedChange($event)"
      (clrDgSingleSelectedChange)="clrDgSingleSelectedChange($event)"
      (clrDgCustomSelectAll)="clrDgCustomSelectAll($event)"
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
        clrVirtualScroll
        let-element
        let-index="index"
        [clrVirtualRowsOf]="detailsOpened ? data.elements.slice(0, 10) : data.elements"
        [clrVirtualRowsTemplateCacheSize]="400"
        (renderedRangeChange)="clrRenderRangeChange($event)"
      >
        <clr-dg-row
          [clrDgItem]="element"
          [clrDgSelected]="selectedRows.includes(index)"
          [clrDgSkeletonLoading]="clrDgSkeletonLoading && index === 0"
        >
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
        </clr-dg-row>
      </ng-template>
      <clr-dg-detail [ngClass]="{ highlight }" *clrIfDetail="let detail">
        <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
        <clr-dg-detail-body [ngSwitch]="detailContentType">
          <pre>{{ detail | json }}</pre>
        </clr-dg-detail-body>
      </clr-dg-detail>

      <clr-dg-footer>
        {{ data.elements?.length }}
        <div *ngIf="showFooterNavButtons" class="footer-nav-buttons">
          <clr-dropdown>
            <button class="btn btn-sm btn-outline-neutral" clrDropdownTrigger aria-label="Dropdown demo button">
              Jump to
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen [clrPosition]="'top-right'">
              <div (click)="datagrid.virtualScroll.scrollToIndex(20, scrollToIndexBehavior)" clrDropdownItem>20</div>
              <div (click)="datagrid.virtualScroll.scrollToIndex(60, scrollToIndexBehavior)" clrDropdownItem>60</div>
              <div (click)="datagrid.virtualScroll.scrollToIndex(80, scrollToIndexBehavior)" clrDropdownItem>80</div>
              <div (click)="datagrid.virtualScroll.scrollToIndex(100, scrollToIndexBehavior)" clrDropdownItem>100</div>
            </clr-dropdown-menu>
          </clr-dropdown>

          <button
            class="btn btn-sm btn-link-neutral footer-button"
            (click)="datagrid.virtualScroll.scrollToIndex(0, scrollToIndexBehavior)"
          >
            <cds-icon shape="step-forward-2" direction="left"></cds-icon>
          </button>
          <button
            class="btn btn-sm btn-link-neutral footer-button"
            (click)="datagrid.virtualScroll.scrollUp(scrollOffset, scrollToIndexBehavior)"
          >
            <cds-icon shape="angle" direction="up"></cds-icon>
          </button>
          <button
            class="btn btn-sm btn-link-neutral footer-button"
            (click)="datagrid.virtualScroll.scrollDown(scrollOffset, scrollToIndexBehavior)"
          >
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <button
            class="btn btn-sm btn-link-neutral footer-button"
            (click)="datagrid.virtualScroll.scrollToIndex(data.elements?.length, scrollToIndexBehavior)"
          >
            <cds-icon shape="step-forward-2" direction="right"></cds-icon>
          </button>
        </div>
      </clr-dg-footer>
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

export const DetailsOpened: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    detailsOpened: true,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('button.datagrid-detail-caret-button') as HTMLButtonElement)?.click();
  },
};

export const SkeletonLoading: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    clrDgSkeletonLoading: true,
  },
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

export const CompactSkeletonLoading: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    clrDgSkeletonLoading: true,
    compact: true,
  },
};

export const FullCompactWithButtonNavigationPattern: StoryObj = {
  render: DatagridDetailsTemplate,
  args: {
    actionOverflow: true,
    compact: true,
    hidableColumns: true,
    multiSelectable: true,
    showFooterNavButtons: true,
  },
};
