/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridRow, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridRow`. Clarity aliases its inputs
 * (`@Input('clrDgExpanded') get expanded`), so the component class cannot be the args type. The two
 * methods are picked off it because they are named in `argTypes` only, to keep their docs rows hidden.
 */
type RowArgs = Pick<ClrDatagridRow, 'toggle' | 'toggleExpand'> & {
  clrDgItem: Element;
  clrDgSelected: boolean;
  clrDgSelectionType: SelectionType;
  clrDgDetailCloseLabel: string;
  clrDgDetailOpenLabel: string;
  clrDgExpanded: boolean;
  clrDgRowSelectionLabel: string;
  clrDgSelectable: boolean;
  clrDgExpandedChange: (expanded: boolean) => void;
  clrDgSelectedChange: (selected: boolean) => void;
  elements: Element[];
  highlight: boolean;
  rowSelectable: boolean;
  expandable: boolean;
  compact: boolean;
  hidableColumns: boolean;
  emptyRow: boolean;
  height: number;
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

const meta: Meta<RowArgs> = {
  title: 'Components/Data/Datagrid/Row',
  component: ClrDatagridRow,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES + ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // inputs
    clrDgItem: { control: { disable: true } },
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
    // outputs
    clrDgExpandedChange: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    // methods
    toggle: { control: { disable: true } },
    toggleExpand: { control: { disable: true } },
    // story helpers
    ...hideControls('elements'),
    ...highlightArgTypes,
  },
  args: {
    // inputs
    clrDgSelectionType: SelectionType.None,
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
    ...highlightArgs,
    rowSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    emptyRow: false,
    height: 0,
  },
  render: args => ({
    template: `
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        [clrDgSelected]="[]"
        [clrDgSelectionType]="clrDgSelectionType"
        ${args.rowSelectable ? '[clrDgRowSelection]="true"' : ''}
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
            @if (!emptyRow || index !== 0) {
              <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
            }
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

type Story = StoryObj<RowArgs>;

export const Row: Story = {};

export const SingleSelection: Story = {
  args: {
    clrDgSelectionType: SelectionType.Single,
  },
};

export const MultiSelection: Story = {
  args: {
    clrDgSelectionType: SelectionType.Multi,
  },
};

export const EmptyRow: Story = {
  args: {
    emptyRow: true,
  },
};

export const CompactEmptyRow: Story = {
  args: {
    emptyRow: true,
    compact: true,
  },
};
