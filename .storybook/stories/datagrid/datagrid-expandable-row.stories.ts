/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridRow, ClrTooltipModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryContext, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Expandable Rows',
  component: ClrDatagridRow,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrTooltipModule, ClrConditionalModule],
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
    clrDgReplace: false,
    clrDgSelectable: true,
    clrDgSelected: false,
    clrDgRowSelectionLabel: '',
    // outputs
    clrDgExpandedChange: action('clrDgExpandedChange'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    detailColumns: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    height: 0,
  },
};

const ExpandableRowsTemplate: StoryFn = args => ({
  template: `
    <style>
      clr-dg-cell.datagrid-cell.electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          max-height: var(--cds-global-space-8);
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

      <clr-dg-row
        *clrDgItems="let element of elements; let index = index"
        [clrDgExpanded]="clrDgExpanded && index === 0"
        [clrDgSelectable]="index !== 0 || clrDgSelectable"
        [clrDgSelected]="clrDgSelected && index === 0"
        [clrDgDetailOpenLabel]="clrDgDetailOpenLabel"
        [clrDgDetailCloseLabel]="clrDgDetailCloseLabel"
        [clrDgItem]="element"
        [ngClass]="{ highlight: highlight && index === 0 }"
        (clrDgExpandedChange)="index === 0 && clrDgExpandedChange($event)"
        (clrDgSelectedChange)="index === 0 && clrDgSelectedChange($event)"
      >
        <clr-dg-cell>
          <clr-tooltip>
            <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
            <clr-tooltip-content clrPosition="bottom-right" clrSize="lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in
              ante placerat mattis id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque
              aliquet suscipit eget, pellentesque sed arcu. Vivamus in dui lectus.
            </clr-tooltip-content>
          </clr-tooltip>
          {{ element.name }}
        </clr-dg-cell>
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

        <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="clrDgReplace">
          <ng-template [ngIf]="!detailColumns">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
              vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum tincidunt
              velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet metus
              finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit diam.
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
              vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum tincidunt
              velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet metus
              finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit diam.
            </div>
          </ng-template>

          <ng-template [ngIf]="detailColumns">
            <clr-dg-cell>
              <clr-tooltip>
                <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
                <clr-tooltip-content clrPosition="bottom-right" clrSize="lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                  quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                  pellentesque sed arcu. Vivamus in dui lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Proin in neque in ante placerat mattis id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem
                  quam, pellentesque aliquet suscipit eget, pellentesque sed arcu. Vivamus in dui lectus.
                </clr-tooltip-content>
              </clr-tooltip>
              {{ element.name }}
            </clr-dg-cell>
            <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
            <clr-dg-cell>{{ element.number }}</clr-dg-cell>
            <clr-dg-cell *ngIf="overflowEllipsis">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
            </clr-dg-cell>
            <clr-dg-cell class="electronegativity-container">
              {{ element.electronegativity }}
              <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
            </clr-dg-cell>
          </ng-template>
        </clr-dg-row-detail>
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

export const ExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
};

export const ExpandedExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
  args: {
    clrDgExpanded: true,
  },
};

export const CompactExpandedExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
  args: {
    compact: true,
    clrDgExpanded: true,
  },
};

export const ExpandedColumnReplaceExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
  args: {
    clrDgExpanded: true,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const CompactExpandedColumnReplaceExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
  args: {
    compact: true,
    clrDgExpanded: true,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const CompactOverflowEllipsisExpandableRows: StoryObj = {
  render: ExpandableRowsTemplate,
  args: {
    compact: true,
    overflowEllipsis: true,
    multiSelectable: true,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const ExpandableRowsTooltipOpened: StoryObj = {
  render: ExpandableRowsTemplate,
  play: focusTooltip,
};

export const ExpandedExpandableRowsTooltipOpened: StoryObj = {
  render: ExpandableRowsTemplate,
  play: focusTooltip,
  args: {
    clrDgExpanded: true,
  },
};

export const ExpandedColumnExpandableRowsTooltipOpened: StoryObj = {
  render: ExpandableRowsTemplate,
  play: focusTooltip,
  args: {
    clrDgExpanded: true,
    detailColumns: true,
  },
};

function focusTooltip({ canvasElement }: StoryContext) {
  canvasElement.querySelector<HTMLButtonElement>('cds-icon[clrTooltipTrigger]')?.focus();
}
