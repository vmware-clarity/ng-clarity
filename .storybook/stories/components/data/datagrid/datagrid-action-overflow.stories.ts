/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagridActionOverflow,
  ClrDatagridModule,
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
 * The args drive a bare template, not an instance of `ClrDatagridActionOverflow`. Clarity aliases its
 * inputs (`@Input('clrDgActionOverflowOpen') get open`), so the component class cannot be the args type.
 */
type ActionOverflowArgs = {
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  clrDgActionOverflowOpen: boolean;
  clrDgActionOverflowButtonLabel: string;
  clrDgActionOverflowOpenChange: (open: boolean) => void;
  elements: Element[];
  highlight: boolean;
  expandable: boolean;
  compact: boolean;
  overflowEllipsis: boolean;
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

const meta: Meta<ActionOverflowArgs> = {
  title: 'Components/Data/Datagrid/Action Overflow',
  component: ClrDatagridActionOverflow,
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
    // outputs
    clrDgActionOverflowOpenChange: { control: { disable: true } },
    // methods
    ...hideControls('closeOverflowContent'),
    // story helpers
    ...hideControls('elements'),
    ...highlightArgTypes,
  },
  args: {
    // inputs
    clrDgSelectionType: SelectionType.None,
    clrDgActionOverflowOpen: false,
    clrDgActionOverflowButtonLabel: commonStringsDefault.rowActions,
    // outputs
    clrDgActionOverflowOpenChange: action('clrDgActionOverflowOpenChange'),
    // story helpers
    elements,
    ...highlightArgs,
    expandable: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    height: 0,
  },
  render: args => ({
    template: `
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        [clrDgSelected]="[]"
        [clrDgSelectionType]="clrDgSelectionType"
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
        @if (overflowEllipsis) {
          <clr-dg-column [style.width.px]="250">
            <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Long text width 250px</ng-container>
          </clr-dg-column>
        }
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
          @if (overflowEllipsis) {
            <clr-dg-cell>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
            </clr-dg-cell>
          }
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

type Story = StoryObj<ActionOverflowArgs>;

export const ActionOverflow: Story = {};

export const CompactOverflowEllipsisActionOverflow: Story = {
  args: {
    compact: true,
    overflowEllipsis: true,
    clrDgSelectionType: SelectionType.Multi,
  },
};

export const ActionOverflowOpenedInRelativeBody: Story = {
  play({ canvasElement }) {
    document.body.style.position = 'relative';
    (canvasElement.querySelector('button.datagrid-action-toggle') as HTMLElement).click();
  },
};
