/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagrid, ClrDatagridModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { behaviorElements, type Element, elements } from '@storybook-helpers/elements.data';
import type { BehaviorSubject } from 'rxjs';

/**
 * The args drive a bare template, not an instance of `ClrDatagrid`, and every arg here is a story knob
 * rather than a Clarity input, so the args type is a standalone declaration.
 */
type PinnedColumnsArgs = {
  pinName: boolean;
  pinSymbol: boolean;
  pinNumber: boolean;
  pinElectronegativity: boolean;
  pinAtomicMass: boolean;
  elements: Element[];
  behaviorElements: BehaviorSubject<Element[]>;
  setExpanded: (expanded: boolean, element: Element) => void;
};

/** Was an inline `<style>` at the head of both story templates; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

const meta: Meta<PinnedColumnsArgs> = {
  title: 'Datagrid/Pinned Columns',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(ELECTRONEGATIVITY_STYLES),
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
    ...hideControls('elements', 'behaviorElements', 'setExpanded'),
  },
  args: {
    pinName: true,
    pinSymbol: false,
    pinNumber: false,
    pinElectronegativity: false,
    // story helpers
    elements,
    behaviorElements,
    setExpanded,
  },
  render: args => ({
    template: `
      <clr-datagrid [clrDgSelectionType]="'multi'" [style.height.px]="400">
        <clr-dg-column [clrDgPinned]="pinName" [style.width.px]="500">Name</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinSymbol" [style.width.px]="500">Symbol</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinNumber" [style.width.px]="500">Number</clr-dg-column>
        <clr-dg-column [clrDgPinned]="pinElectronegativity" [style.width.px]="500">Electronegativity</clr-dg-column>
        <clr-dg-column [style.width.px]="400">Mass</clr-dg-column>

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
            <pre>{{ element | json }}</pre>
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
  }),
};

export default meta;

type Story = StoryObj<PinnedColumnsArgs>;

export const PinnedColumns: Story = {};

// The first four columns pinned at once. They ask for more than the datagrid width, so they are
// capped at 85% of it and shrink to fit - there is always something left of the scrollable region.
export const MostColumnsPinned: Story = {
  args: {
    pinSymbol: true,
    pinNumber: true,
    pinElectronegativity: true,
  },
};

function setExpanded($event, element) {
  element.expanded = $event;
}

// Virtual scroll keeps the header and the rows in two scroll containers that are kept in sync, so
// the pinned columns have to stay aligned across both while scrolling in either direction.
export const VirtualScroll: Story = {
  // render-override: this story renders its rows inside a virtual-scroll viewport
  render: args => ({
    template: `
      @if ({ elements: behaviorElements | async }; as data) {
        <clr-datagrid [clrDgSelectionType]="'multi'" [style.height.px]="500">
          <clr-dg-column [clrDgPinned]="pinName" [style.width.px]="500">Name</clr-dg-column>
          <clr-dg-column [clrDgPinned]="pinSymbol" [style.width.px]="500">Symbol</clr-dg-column>
          <clr-dg-column [clrDgPinned]="pinNumber" [style.width.px]="500">Number</clr-dg-column>
          <clr-dg-column [clrDgPinned]="pinElectronegativity" [style.width.px]="500">Electronegativity</clr-dg-column>
          <clr-dg-column [style.width.px]="400">Mass</clr-dg-column>

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

                <clr-dg-row-detail
                  [clrIfExpanded]="!!element.expanded"
                  (clrIfExpandedChange)="setExpanded($event, element)"
                >
                  {{ element | json }}
                </clr-dg-row-detail>
              </clr-dg-row>
            </ng-template>
          }

          <clr-dg-footer>{{ data.elements?.length }} elements</clr-dg-footer>
        </clr-datagrid>
      }
    `,
    props: { ...args },
  }),
};
