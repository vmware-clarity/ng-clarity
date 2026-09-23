/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridPagination, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { ELECTRONEGATIVITY_STYLES, selectionTypeArgType } from '@storybook-helpers/datagrid.helpers';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridPagination`. Clarity aliases its inputs
 * (`@Input('clrDgPageSize') get pageSize`), so the component class cannot be the args type. The two
 * methods are picked off it because they are named in `argTypes` only, to keep their docs rows hidden.
 */
type PaginationArgs = Pick<ClrDatagridPagination, 'next' | 'previous'> & {
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  clrDgPageInputDisabled: boolean;
  clrDgPageSize: number;
  clrDgPage: number;
  clrDgLastPage: number;
  clrDgTotalItems: number;
  clrDgPageChange: (page: number) => void;
  elements: Element[];
  highlight: boolean;
  expandable: boolean;
  compact: boolean;
  hidableColumns: boolean;
  height: number;
};

const meta: Meta<PaginationArgs> = {
  title: 'Components/Data/Datagrid/Pagination',
  component: ClrDatagridPagination,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES + ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // inputs
    clrDgSelected: { control: { disable: true } },
    clrDgSelectionType: selectionTypeArgType,
    clrDgPageSize: { control: { type: 'number', min: 1, max: 100 } },
    clrDgPage: { control: { type: 'number', min: 1 } },
    clrDgLastPage: { control: { type: 'number', min: 1 } },
    clrDgTotalItems: { control: { type: 'number', min: 1 } },
    // outputs
    clrDgPageChange: { control: { disable: true } },
    // methods
    ...hideControls('updateCurrentPage'),
    next: { control: { disable: true } },
    previous: { control: { disable: true } },
    // story helpers
    ...hideControls('elements'),
    ...highlightArgTypes,
  },
  args: {
    // inputs
    clrDgSelectionType: SelectionType.None,
    clrDgPageInputDisabled: false,
    clrDgPageSize: 10,
    clrDgPage: null,
    clrDgLastPage: null,
    clrDgTotalItems: null,
    // outputs
    clrDgPageChange: action('clrDgPageChange'),
    // story helpers
    elements,
    ...highlightArgs,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 0,
  },
  render: args => ({
    template: `
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        [clrDgSelected]="[]"
        [clrDgSelectionType]="clrDgSelectionType"
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

        <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
          <clr-dg-cell>{{ element.name }}</clr-dg-cell>
          <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
          <clr-dg-cell>{{ element.number }}</clr-dg-cell>
          <clr-dg-cell class="electronegativity-container">
            {{ element.electronegativity }}
            <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
          </clr-dg-cell>
          @if (expandable) {
            <ng-container ngProjectAs="clr-dg-row-detail">
              <clr-dg-row-detail *clrIfExpanded>{{ element | json }}</clr-dg-row-detail>
            </ng-container>
          }
        </clr-dg-row>

        <clr-dg-footer>
          <clr-dg-pagination
            #pagination
            [ngClass]="{ highlight }"
            [clrDgPageInputDisabled]="clrDgPageInputDisabled"
            [clrDgPageSize]="clrDgPageSize"
            [clrDgPage]="clrDgPage"
            [clrDgLastPage]="clrDgLastPage"
            [clrDgTotalItems]="clrDgTotalItems"
            (clrDgPageChange)="clrDgPageChange($event)"
          >
            <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<PaginationArgs>;

export const Pagination: Story = {};
