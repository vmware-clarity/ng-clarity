/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridActionOverflow, ClrDatagridModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Action Overflow',
  component: ClrDatagridActionOverflow,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
  ],
  argTypes: {
    // outputs
    clrDgActionOverflowOpenChange: { control: { disable: true } },
    // methods
    closeOverflowContent: { control: { disable: true }, table: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrDgActionOverflowOpen: false,
    clrDgActionOverflowButtonLabel: commonStringsDefault.rowActions,
    // outputs
    clrDgActionOverflowOpenChange: action('clrDgActionOverflowOpenChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    height: 0,
  },
};

const ActionOverflowTemplate: StoryFn = args => ({
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
      [ngClass]="{ 'datagrid-compact': compact, 'datagrid-overflow-ellipsis': overflowEllipsis }"
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
      <clr-dg-column [style.width.px]="250" *ngIf="overflowEllipsis">
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Long text width 250px</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
      </clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements; let index = index" [clrDgItem]="element">
        <clr-dg-action-overflow
          [ngClass]="{ highlight: highlight && index === 0 }"
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

export const ActionOverflow: StoryObj = {
  render: ActionOverflowTemplate,
};

export const CompactOverflowEllipsisActionOverflow: StoryObj = {
  render: ActionOverflowTemplate,
  args: {
    compact: true,
    overflowEllipsis: true,
    multiSelectable: true,
  },
};

export const ActionOverflowOpenedInRelativeBody: StoryObj = {
  render: ActionOverflowTemplate,
  play({ canvasElement }) {
    document.body.style.position = 'relative';
    (canvasElement.querySelector('button.datagrid-action-toggle') as HTMLElement).click();
  },
};
