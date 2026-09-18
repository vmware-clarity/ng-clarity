/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagridColumn,
  ClrDatagridModule,
  ClrDatagridSortOrder,
  commonStringsDefault,
  SelectionType,
} from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridColumn`. Clarity aliases its inputs
 * (`@Input('clrDgSortBy') get sortBy`), so the component class cannot be the args type. `sort` is picked
 * off it because it is named in `argTypes` only, to keep its docs row hidden.
 */
type ColumnArgs = Pick<ClrDatagridColumn, 'sort'> & {
  clrDgField: string;
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  clrDgColType: 'string' | 'number';
  clrDgSortBy: string;
  clrDgSortOrder: string;
  clrDgDisableUnsort: boolean;
  clrFilterNumberMaxPlaceholder: string;
  clrFilterNumberMinPlaceholder: string;
  clrFilterStringPlaceholder: string;
  clrFilterValue: string;
  clrDgColumnResize: (width: number) => void;
  clrDgSortOrderChange: (sortOrder: ClrDatagridSortOrder) => void;
  clrFilterValueChange: (value: unknown) => void;
  elements: Element[];
  highlight: boolean;
  expandable: boolean;
  compact: boolean;
  hidableColumns: boolean;
  height: number;
  ClrDatagridSortOrder: typeof ClrDatagridSortOrder;
};

/** Was an inline `<style>` at the head of the story template; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

const meta: Meta<ColumnArgs> = {
  title: 'Datagrid/Column Filter',
  component: ClrDatagridColumn,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES + ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // inputs
    clrDgField: { control: { disable: true } },
    clrDgSelected: { control: { disable: true } },
    clrDgSelectionType: {
      control: { type: 'select' },
      // Legacy label -> value object; `InputType` types `options` as an array, hence the cast.
      options: {
        None: SelectionType.None,
        Single: SelectionType.Single,
        Multi: SelectionType.Multi,
      } as unknown as SelectionType[],
    },
    clrDgSortBy: { type: 'string' },
    clrDgSortOrder: {
      control: { type: 'radio' },
      options: Object.values(ClrDatagridSortOrder).filter(value => typeof value === 'string'),
    },
    // outputs
    clrDgColumnResize: { control: { disable: true } },
    clrDgSortOrderChange: { control: { disable: true } },
    clrFilterValueChange: { control: { disable: true } },
    // methods
    sort: { control: { disable: true } },
    // story helpers
    ...hideControls('elements', 'ClrDatagridSortOrder'),
    ...highlightArgTypes,
  },
  args: {
    // inputs
    clrDgSelectionType: SelectionType.None,
    clrDgColType: 'string',
    clrFilterNumberMaxPlaceholder: commonStringsDefault.maxValue,
    clrFilterNumberMinPlaceholder: commonStringsDefault.minValue,
    clrFilterStringPlaceholder: commonStringsDefault.filterItems,
    clrFilterValue: '',
    clrDgSortOrder: ClrDatagridSortOrder[ClrDatagridSortOrder.UNSORTED],
    // outputs
    clrDgColumnResize: action('clrDgColumnResize'),
    clrDgSortOrderChange: action('clrDgSortOrderChange'),
    clrFilterValueChange: action('clrFilterValueChange'),
    // story helpers
    elements,
    ...highlightArgs,
    expandable: false,
    compact: false,
    hidableColumns: false,
    clrDgDisableUnsort: false,
    height: 0,
    ClrDatagridSortOrder: ClrDatagridSortOrder,
  },
  render: args => ({
    template: `
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        [clrDgSelected]="[]"
        [clrDgSelectionType]="clrDgSelectionType"
        [ngClass]="{ 'datagrid-compact': compact }"
      >
        <clr-dg-column
          [style.width.px]="250"
          [ngClass]="{ highlight }"
          [clrDgColType]="clrDgColType"
          clrDgField="name"
          [clrDgSortBy]="clrDgSortBy"
          [clrDgSortOrder]="ClrDatagridSortOrder[clrDgSortOrder]"
          [clrFilterNumberMaxPlaceholder]="clrFilterNumberMaxPlaceholder"
          [clrFilterNumberMinPlaceholder]="clrFilterNumberMinPlaceholder"
          [clrFilterStringPlaceholder]="clrFilterStringPlaceholder"
          [clrFilterValue]="clrFilterValue"
          [clrDgDisableUnsort]="clrDgDisableUnsort"
          (clrDgColumnResize)="clrDgColumnResize($event)"
          (clrDgSortOrderChange)="clrDgSortOrderChange($event)"
          (clrFilterValueChange)="clrFilterValueChange($event)"
        >
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Name</ng-container>
        </clr-dg-column>
        <clr-dg-column [style.width.px]="250">
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Symbol</ng-container>
        </clr-dg-column>
        <clr-dg-column [clrDgField]="'number'" [clrDgColType]="'number'" [style.width.px]="250">
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
          <clr-dg-pagination #pagination>
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

type Story = StoryObj<ColumnArgs>;

export const ColumnFilter: Story = {};

export const ColumnNameFilterOpened: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const stringFilterToggle = await canvasElement.querySelector('clr-dg-string-filter .datagrid-filter-toggle');
    await userEvent.click(stringFilterToggle);
  },
};

export const ColumnNumberFilterOpened: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const numericFilterToggle = await canvasElement.querySelector('clr-dg-numeric-filter .datagrid-filter-toggle');
    await userEvent.click(numericFilterToggle);
  },
};
