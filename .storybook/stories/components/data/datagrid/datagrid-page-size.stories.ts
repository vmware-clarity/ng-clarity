/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridPageSize, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';

/**
 * The args drive a bare template, not an instance of `ClrDatagridPageSize`. Clarity aliases its inputs
 * (`@Input('clrPageSizeOptions') pageSizeOptions`), so the component class cannot be the args type --
 * the args carry the template's own binding names.
 */
type PageSizeArgs = {
  clrPageSizeOptions: number[];
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  elements: Element[];
  highlight: boolean;
  expandable: boolean;
  compact: boolean;
  hidableColumns: boolean;
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

const meta: Meta<PageSizeArgs> = {
  title: 'Components/Data/Datagrid/Page Size',
  component: ClrDatagridPageSize,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES + ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // inputs
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
    // story helpers
    ...hideControls('elements'),
    ...highlightArgTypes,
  },
  args: {
    // inputs
    clrPageSizeOptions: [5, 10, 20],
    clrDgSelectionType: SelectionType.None,
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
          <clr-dg-pagination #pagination>
            <clr-dg-page-size [ngClass]="{ highlight }" [clrPageSizeOptions]="clrPageSizeOptions">
              Elements per page
            </clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<PageSizeArgs>;

export const PageSize: Story = {};
