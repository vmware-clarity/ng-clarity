/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridDetail, ClrDatagridModule, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryContext, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';

/**
 * The args drive a bare template, not an instance of `ClrDatagridDetail`. Clarity aliases its inputs
 * (`@Input('clrDetailWidth') get detailWidth`), so the component class cannot be the args type. `close`
 * is picked off it because it is named in `argTypes` only, to keep its docs row hidden.
 */
type DetailArgs = Pick<ClrDatagridDetail, 'close'> & {
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  clrDetailAriaLabel: string;
  clrDetailAriaLabelledBy: string;
  clrDetailWidth: number;
  elements: Element[];
  detailContentType: 'json' | 'datagrid';
  showLongContent: boolean;
  showLongUninterruptedContent: boolean;
  highlight: boolean;
  expandable: boolean;
  compact: boolean;
  removeMargin: boolean;
  hidableColumns: boolean;
  height: number;
  disabledDetailIndex: number;
  hiddenDetailIndex: number;
};

/** Was part of an inline `<style>` at the head of the story template; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

/** Was part of an inline `<style>` at the head of the story template; copied verbatim. */
const REMOVED_MARGIN_STYLES = `
  .removed-margin {
    --clr-datagrid-margin-top: 0px;
    --clr-datagrid-compact-margin-top: 0px;
  }
`;

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

const meta: Meta<DetailArgs> = {
  title: 'Datagrid/Detail',
  component: ClrDatagridDetail,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES + ELECTRONEGATIVITY_STYLES + REMOVED_MARGIN_STYLES),
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
    clrDetailWidth: {
      description:
        'Sets the width of the detail pane as a percentage of the datagrid width. ' +
        'Accepts values between 0 and 100 (inclusive). Values outside this range are clamped: ' +
        'negative values become 0 and values above 100 become 100. ' +
        'Setting null or undefined restores the default of 66.',
      control: { type: 'number', min: 0, max: 100 },
      table: {
        defaultValue: { summary: '66' },
        type: { summary: 'number' },
      },
    },
    // methods
    close: { control: { disable: true } },
    // story helpers
    ...hideControls('elements'),
    detailContentType: { control: { type: 'inline-radio' }, options: ['json', 'datagrid'] },
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
    ...highlightArgTypes,
  },
  args: {
    //inputs
    clrDgSelectionType: SelectionType.None,
    clrDetailAriaLabel: '',
    clrDetailAriaLabelledBy: '',
    clrDetailWidth: 66,
    // story helpers
    elements,
    detailContentType: 'json',
    showLongContent: false,
    showLongUninterruptedContent: false,
    ...highlightArgs,
    expandable: false,
    compact: false,
    removeMargin: false,
    hidableColumns: false,
    height: 0,
    disabledDetailIndex: -1,
    hiddenDetailIndex: -1,
  },
  render: args => {
    args.elements = args.showLongContent ? [longContentElement, ...args.elements] : args.elements;
    args.elements = args.showLongUninterruptedContent
      ? [longUninterruptedContentElement, ...args.elements]
      : args.elements;

    return {
      template: `
        <clr-datagrid
          ${args.height ? '[style.height.px]="height"' : ''}
          [clrDgSelected]="[]"
          [clrDgSelectionType]="clrDgSelectionType"
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
            @if (expandable) {
              <ng-container ngProjectAs="clr-dg-row-detail">
                <clr-dg-row-detail *clrIfExpanded>{{ element | json }}</clr-dg-row-detail>
              </ng-container>
            }
          </clr-dg-row>

          <clr-dg-detail
            [ngClass]="{ highlight }"
            *clrIfDetail="let element"
            [clrDetailWidth]="clrDetailWidth"
            ${args.clrDetailAriaLabel ? '[clrDetailAriaLabel]="clrDetailAriaLabel"' : ''}
            ${args.clrDetailAriaLabelledBy ? '[clrDetailAriaLabelledBy]="clrDetailAriaLabelledBy"' : ''}
          >
            <clr-dg-detail-header>{{ element.name }}</clr-dg-detail-header>
            <clr-dg-detail-body>
              @switch (detailContentType) {
                @case ('json') {
                  {{ element | json }}
                }
                @case ('datagrid') {
                  <clr-datagrid>
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
                }
              }
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
  },
};

export default meta;

type Story = StoryObj<DetailArgs>;

export const Detail: Story = {};

export const OpenDetail: Story = {
  play: openDetail,
  args: {
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};

export const OpenDetailWithCustomWidth: Story = {
  play: openDetail,
  args: {
    detailContentType: 'json',
    height: 500,
    clrDetailWidth: 90,
  },
};
export const OpenDetailWithRemovedMargin: Story = {
  play: openDetail,
  args: {
    removeMargin: true,
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};
export const CompactOpenDetailWithRemovedMargin: Story = {
  play: openDetail,
  args: {
    removeMargin: true,
    compact: true,
    detailContentType: 'datagrid',
    // The height is set larger than the height of the rows to regression test the detail pane border. (CDE-2188)
    height: 500,
  },
};

export const OpenLongContentDetail: Story = {
  play: openDetail,
  args: {
    detailContentType: 'datagrid',
    showLongContent: true,
  },
};

// Open uninterrupted content cell regression test for nested datagrid CDE-2208.
export const OpenLongUninterruptedContentDetail: Story = {
  play: openDetail,
  args: {
    detailContentType: 'datagrid',
    showLongUninterruptedContent: true,
  },
};

export const DisabledDetailButton: Story = {
  play: openDetail,
  args: {
    detailContentType: 'datagrid',
    disabledDetailIndex: 1,
  },
};

export const HiddenDetailButton: Story = {
  play: openDetail,
  args: {
    detailContentType: 'datagrid',
    hiddenDetailIndex: 1,
  },
};

async function openDetail({ canvasElement, userEvent }: StoryContext) {
  const detailCaretButton = await canvasElement.querySelector<HTMLButtonElement>('button.datagrid-detail-caret-button');
  await userEvent.click(detailCaretButton);
}
