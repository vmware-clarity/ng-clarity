/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagrid, ClrDatagridModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { behaviorElements, elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Pinned Columns',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
  ],
  argTypes: {
    // Every column has its own control, so any combination can be pinned - including all of them,
    // which is what puts the pinned columns over their maximum total width.
    pinName: { control: { type: 'boolean' }, name: 'Pin Name' },
    pinSymbol: { control: { type: 'boolean' }, name: 'Pin Symbol' },
    pinNumber: { control: { type: 'boolean' }, name: 'Pin Number' },
    pinElectronegativity: { control: { type: 'boolean' }, name: 'Pin Electronegativity' },
    pinAtomicMass: { control: { type: 'boolean' }, name: 'Pin Atomic mass' },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    behaviorElements: { control: { disable: true }, table: { disable: true } },
    setExpanded: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    pinName: true,
    pinSymbol: false,
    pinNumber: false,
    pinElectronegativity: false,
    pinAtomicMass: false,
    // story helpers
    elements,
    behaviorElements,
    setExpanded,
  },
};

const PinnedColumnsTemplate: StoryFn = args => ({
  template: `
    <style>
      .electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          background-color: var(--cds-alias-status-info);
        }
      }
    </style>
    <clr-datagrid [clrDgSelectionType]="'multi'" [style.height.px]="400">
      <clr-dg-column [clrDgPinned]="pinName" [style.width.px]="500">Name</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinSymbol" [style.width.px]="500">Symbol</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinNumber" [style.width.px]="500">Number</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinElectronegativity" [style.width.px]="500">Electronegativity</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinAtomicMass" [style.width.px]="400">Mass</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
        <clr-dg-cell>{{ element.number }}</clr-dg-cell>
        <clr-dg-cell class="electronegativity-container">
          {{ element.electronegativity }}
          <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
        </clr-dg-cell>
        <clr-dg-cell>{{ element.number * 2 }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-detail *clrIfDetail="let element">
        <clr-dg-detail-header>{{ element.name }}</clr-dg-detail-header>
        <clr-dg-detail-body>
          <clr-datagrid>
            <clr-dg-column>Key</clr-dg-column>
            <clr-dg-column>Value</clr-dg-column>

            <clr-dg-row clrDgItem="name">
              <clr-dg-cell>Name</clr-dg-cell>
              <clr-dg-cell>{{ element.name }}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="symbol">
              <clr-dg-cell>Symbol</clr-dg-cell>
              <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="number">
              <clr-dg-cell>Number</clr-dg-cell>
              <clr-dg-cell>{{ element.number }}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="electronegativity">
              <clr-dg-cell>Electronegativity</clr-dg-cell>
              <clr-dg-cell>{{ element.electronegativity }}</clr-dg-cell>
            </clr-dg-row>
          </clr-datagrid>
        </clr-dg-detail-body>
      </clr-dg-detail>

      <clr-dg-footer>{{ elements.length }} elements</clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const PinnedColumns: StoryObj = {
  render: PinnedColumnsTemplate,
};

// Every column pinned at once. The five columns ask for more than the datagrid width, so they are
// capped at 85% of it and shrink to fit - there is always something left of the scrollable region.
export const AllColumnsPinned: StoryObj = {
  render: PinnedColumnsTemplate,
  args: {
    pinName: true,
    pinSymbol: true,
    pinNumber: true,
    pinElectronegativity: true,
    pinAtomicMass: true,
  },
};

const VirtualScrollTemplate: StoryFn = args => ({
  template: `
    <style>
      .electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          background-color: var(--cds-alias-status-info);
        }
      }
    </style>
    @if ({ elements: behaviorElements | async }; as data) {
      <clr-datagrid [clrDgSelectionType]="'multi'" [style.height.px]="500">
        <clr-dg-column [clrDgPinned]="pinName" [style.width.px]="500">Name</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinSymbol" [style.width.px]="500">Symbol</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinNumber" [style.width.px]="500">Number</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinElectronegativity" [style.width.px]="500">Electronegativity</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinAtomicMass" [style.width.px]="400">Mass</clr-dg-column>

        @if (data.elements) {
          <ng-template clrVirtualScroll let-element [clrVirtualRowsOf]="data.elements">
            <clr-dg-row [clrDgItem]="element">
              <clr-dg-cell>{{ element.name }}</clr-dg-cell>
              <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
              <clr-dg-cell>{{ element.number }}</clr-dg-cell>
              <clr-dg-cell class="electronegativity-container">
                {{ element.electronegativity }}
                <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
              </clr-dg-cell>
              <clr-dg-cell>{{ element.number * 2 }}</clr-dg-cell>

              <ng-container ngProjectAs="clr-dg-row-detail">
                <clr-dg-row-detail
                  [clrIfExpanded]="!!element.expanded"
                  (clrIfExpandedChange)="setExpanded($event, element)"
                >
                  {{ element | json }} {{ element.expanded }}
                </clr-dg-row-detail>
              </ng-container>
            </clr-dg-row>
          </ng-template>
        }

        <clr-dg-footer>{{ data.elements?.length }} elements</clr-dg-footer>
      </clr-datagrid>
    }
  `,
  props: { ...args },
});

function setExpanded($event, element) {
  element.expanded = $event;
}

// Virtual scroll keeps the header and the rows in two scroll containers that are kept in sync, so
// the pinned columns have to stay aligned across both while scrolling in either direction.
export const VirtualScroll: StoryObj = {
  render: VirtualScrollTemplate,
};
