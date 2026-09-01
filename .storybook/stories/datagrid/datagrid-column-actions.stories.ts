/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagrid, ClrDatagridModule, ClrDatagridSortOrder } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Column Actions',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule],
    }),
  ],
  argTypes: {
    pinnable: { control: { type: 'boolean' }, name: 'Pinnable columns' },
    disableUnsort: { control: { type: 'boolean' }, name: 'Disable unsort' },
    sortOrder: {
      control: { type: 'radio' },
      options: [ClrDatagridSortOrder.UNSORTED, ClrDatagridSortOrder.ASC, ClrDatagridSortOrder.DESC],
      name: 'Initial sort of Name',
    },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    pinnable: true,
    disableUnsort: false,
    sortOrder: ClrDatagridSortOrder.UNSORTED,
    // story helpers
    elements,
  },
};

// The title still sorts, so the menu is an additional path to it. The filter is not: a column with a
// filter gets a filter action and gives up its own toggle, so the header keeps one control.
const ColumnActionsTemplate: StoryFn = args => ({
  template: `
    <clr-datagrid [style.height.px]="400">
      <clr-dg-column
        clrDgField="name"
        [clrDgSortOrder]="sortOrder"
        [clrDgDisableUnsort]="disableUnsort"
        [clrDgPinnable]="pinnable"
      >
        Name
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="symbol" [clrDgPinnable]="pinnable">
        Symbol
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="number" clrDgColType="number" [clrDgPinnable]="pinnable">
        Number
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <!-- No menu here, to show that the control is opt-in per column. -->
      <clr-dg-column clrDgField="electronegativity" clrDgColType="number">Electronegativity</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
        <clr-dg-cell>{{ element.number }}</clr-dg-cell>
        <clr-dg-cell>{{ element.electronegativity }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        {{ elements.length }} elements
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const ColumnActions: StoryObj = {
  render: ColumnActionsTemplate,
};

// A column that cannot be sorted offers only the actions it can perform, so the menu never shows a
// dead option.
const UnsortableTemplate: StoryFn = args => ({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgField="name" [clrDgPinnable]="pinnable">
        Name
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column [clrDgPinnable]="pinnable">
        Symbol (not sortable)
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        {{ elements.length }} elements
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const UnsortableColumn: StoryObj = {
  render: UnsortableTemplate,
};

// Projected items are appended after the built-in ones and marked with clrDgColumnAction, which
// joins them to the menu's arrow key order and closes the menu when one is picked. `clrDropdownItem`
// cannot be used here: it resolves its dropdown from where it is declared, which is outside the menu
// in the component's template.
const ProjectedActionTemplate: StoryFn = args => ({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgField="name" [clrDgPinnable]="pinnable">
        Name
        <clr-dg-column-actions>
          <div class="dropdown-divider" role="separator"></div>
          <button type="button" clrDgColumnAction (click)="exported = 'Name'">Export column</button>
          <button type="button" clrDgColumnAction clrDisabled>Unavailable action</button>
        </clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="symbol">Symbol</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        {{ elements.length }} elements
        Last exported column: {{ exported || 'none' }}
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args, exported: '' },
});

export const ProjectedAction: StoryObj = {
  render: ProjectedActionTemplate,
};

// A column with an actions menu has no filter funnel - the filter is reached through the menu, and
// the trigger takes over showing that the column is filtered. The last column has no menu, so it
// keeps its funnel for comparison.
const FilterInMenuTemplate: StoryFn = args => ({
  template: `
    <clr-datagrid>
      <clr-dg-column clrDgField="name" [clrDgPinnable]="pinnable">
        Name
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="number" clrDgColType="number">
        Number
        <clr-dg-column-actions></clr-dg-column-actions>
      </clr-dg-column>
      <clr-dg-column clrDgField="symbol">Symbol (no menu)</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{ element.name }}</clr-dg-cell>
        <clr-dg-cell>{{ element.number }}</clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
      </clr-dg-row>

      <clr-dg-footer>
        {{ elements.length }} elements
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const FilterInMenu: StoryObj = {
  render: FilterInMenuTemplate,
};
