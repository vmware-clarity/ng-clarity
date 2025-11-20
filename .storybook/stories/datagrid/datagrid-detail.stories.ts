/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridDetail, ClrDatagridModule } from '@clr/angular';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { removeFocusOutline } from '../../helpers/common';
import { Element, elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Detail',
  component: ClrDatagridDetail,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
  ],
  argTypes: {
    // methods
    close: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    detailContentType: { control: 'inline-radio', options: ['json', 'datagrid'] },
    clrDetailAriaLabel: {
      description: 'Title of the modal',
    },
    clrDetailAriaLabelledBy: {
      description: "Id or multiple space separated Id's referencing existing text on the page",
    },
    disabledDetailIndex: {
      description: 'Disabled detail button index.',
      control: { type: 'number', min: -1, max: 50 },
    },
    hiddenDetailIndex: {
      description: 'Hidden detail button index.',
      control: { type: 'number', min: -1, max: 50 },
    },
  },
  args: {
    //inputs
    clrDetailAriaLabel: '',
    clrDetailAriaLabelledBy: '',
    // story helpers
    elements,
    detailContentType: 'json',
    showLongContent: false,
    showLongUninterruptedContent: false,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    removeMargin: false,
    hidableColumns: false,
    height: 0,
    disabledDetailIndex: -1,
    hiddenDetailIndex: -1,
  },
};

const longContentElement: Element = {
  id: 223,
  name: 'A really really really really really really really really really long content in the cell',
  symbol: 'Ac',
  number: 89,
  electronegativity: 1.1,
};

const longUninterruptedContentElement: Element = {
  id: 224,
  name: 'aReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyReallyLongUninterruptedContent',
  symbol: 'Ac',
  number: 89,
  electronegativity: 1.1,
};

const DetailTemplate: StoryFn = args => {
  args.elements = args.showLongContent ? [longContentElement, ...args.elements] : args.elements;
  args.elements = args.showLongUninterruptedContent
    ? [longUninterruptedContentElement, ...args.elements]
    : args.elements;

  return {
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
        .removed-margin {
          --clr-datagrid-margin-top: 0px;
          --clr-datagrid-compact-margin-top: 0px;
        }
      </style>
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
        ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
        [ngClass]="{ 'datagrid-compact': compact, 'removed-margin': removeMargin }"
      >
        <clr-dg-column ${args.showLongUninterruptedContent ? '' : '[style.width.px]="250"'}>
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
          [clrDgItem]="element"
          [clrDgDetailDisabled]="disabledDetailIndex === index"
          [clrDgDetailHidden]="hiddenDetailIndex === index"
        >
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

        <clr-dg-detail
          [ngClass]="{ highlight }"
          *clrIfDetail="let element"
          ${args.clrDetailAriaLabel ? '[clrDetailAriaLabel]="clrDetailAriaLabel"' : ''}
          ${args.clrDetailAriaLabelledBy ? '[clrDetailAriaLabelledBy]="clrDetailAriaLabelledBy"' : ''}
        >
          <clr-dg-detail-header>{{ element.name }}</clr-dg-detail-header>
          <clr-dg-detail-body [ngSwitch]="detailContentType">
            <ng-container *ngSwitchCase="'json'">{{ element | json }}</ng-container>

            <clr-datagrid *ngSwitchCase="'datagrid'">
              <clr-dg-column>Key</clr-dg-column>
              <clr-dg-column>Value</clr-dg-column>

              <clr-dg-row>
                <clr-dg-cell>Name</clr-dg-cell>
                <clr-dg-cell>{{ element.name }}</clr-dg-cell>
              </clr-dg-row>

              <clr-dg-row>
                <clr-dg-cell>Symbol</clr-dg-cell>
                <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
              </clr-dg-row>

              <clr-dg-row>
                <clr-dg-cell>Number</clr-dg-cell>
                <clr-dg-cell>{{ element.number }}</clr-dg-cell>
              </clr-dg-row>

              <clr-dg-row>
                <clr-dg-cell>Electronegativity</clr-dg-cell>
                <clr-dg-cell>{{ element.electronegativity }}</clr-dg-cell>
              </clr-dg-row>
            </clr-datagrid>
          </clr-dg-detail-body>
        </clr-dg-detail>

        <clr-dg-footer>
          <clr-dg-pagination #pagination>
            <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  };
};

export const Detail: StoryObj = {
  render: DetailTemplate,
};

export const OpenDetail: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};
export const OpenDetailWithRemovedMargin: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    removeMargin: true,
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};
export const CompactOpenDetailWithRemovedMargin: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    removeMargin: true,
    compact: true,
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};

export const OpenLongContentDetail: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    detailContentType: 'datagrid',
    showLongContent: true,
  },
};

// Open uninterrupted content cell regression test for nested datagrid CDE-2208.
export const OpenLongUninterruptedContentDetail: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    detailContentType: 'datagrid',
    showLongUninterruptedContent: true,
  },
};

export const DisabledDetailButton: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    detailContentType: 'datagrid',
    disabledDetailIndex: 1,
  },
};

export const HiddenDetailButton: StoryObj = {
  render: DetailTemplate,
  play({ canvasElement }: StoryContext) {
    canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button').click();

    removeFocusOutline({ canvasElement });
  },
  args: {
    detailContentType: 'datagrid',
    hiddenDetailIndex: 1,
  },
};
