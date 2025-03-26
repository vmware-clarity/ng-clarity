/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridRow } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

const RowTemplate: StoryFn = args => ({
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

      <clr-dg-row
        *clrDgItems="let element of elements; let index = index"
        [clrDgExpanded]="clrDgExpanded && index === 0"
        [clrDgSelectable]="index !== 0 || clrDgSelectable"
        [clrDgSelected]="clrDgSelected && index === 0"
        [clrDgDetailOpenLabel]="clrDgDetailOpenLabel"
        [clrDgDetailCloseLabel]="clrDgDetailCloseLabel"
        [clrDgItem]="element"
        [clrDgRowSelectionLabel]="clrDgRowSelectionLabel ? clrDgRowSelectionLabel + ' ' + element.name : undefined"
        [ngClass]="{ highlight: highlight && index === 0 }"
        (clrDgExpandedChange)="index === 0 && clrDgExpandedChange($event)"
        (clrDgSelectedChange)="index === 0 && clrDgSelectedChange($event)"
      >
        <clr-dg-cell>{{ emptyRow && index === 0 ? '' : element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ emptyRow && index === 0 ? '' : element.symbol }}</clr-dg-cell>
        <clr-dg-cell>{{ emptyRow && index === 0 ? '' : element.number }}</clr-dg-cell>
        <clr-dg-cell class="electronegativity-container">
          {{ emptyRow && index === 0 ? '' : element.electronegativity }}
          <div
            *ngIf="!emptyRow || index !== 0"
            [style.width.%]="(element.electronegativity * 100) / 5"
            class="electronegativity-bar"
          >
            &nbsp;
          </div>
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
export default {
  title: 'Datagrid/Row',
  component: ClrDatagridRow,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDgItem: { control: { disable: true } },
    // outputs
    clrDgExpandedChange: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    // methods
    toggle: { control: { disable: true } },
    toggleExpand: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDgDetailCloseLabel: '',
    clrDgDetailOpenLabel: '',
    clrDgExpanded: false,
    clrDgRowSelectionLabel: 'Select row for',
    clrDgSelectable: true,
    clrDgSelected: false,
    // outputs
    clrDgExpandedChange: action('clrDgExpandedChange'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    emptyRow: false,
    height: 0,
  },
};

export const Row: StoryObj = {
  render: RowTemplate,
};

export const singleSelection: StoryObj = {
  render: RowTemplate,
  args: {
    singleSelectable: true,
  },
};

export const multiSelection: StoryObj = {
  render: RowTemplate,
  args: {
    multiSelectable: true,
  },
};

export const emptyRow: StoryObj = {
  render: RowTemplate,
  args: {
    emptyRow: true,
  },
};

export const compactEmptyRow: StoryObj = {
  render: RowTemplate,
  args: {
    emptyRow: true,
    compact: true,
  },
};
