/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxDatagridModule, ColumnDefinition, ColumnOrderChanged, ColumnPinnedState } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

interface VmItem {
  [key: string]: any;
  id: number;
  name: string;
  state: string;
  status: string;
  cpus: string;
}

const vms: VmItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  name: `vm-${i}`,
  state: i % 2 === 0 ? 'Powered On' : 'Powered Off',
  status: i % 3 === 0 ? 'unknown' : 'ok',
  cpus: `${(i % 4) + 1}`,
}));

// The menu is opt-in through enableColumnActions on appfx-datagrid, and off by default. Sort and
// Filter join it automatically once the column is sortable/filterable; pinnable adds Pin Column.
// Move Left and Move Right step the column within its own group - pinned columns reorder among the
// pinned ones, loose columns among the loose ones.
export default {
  title: 'Addons/Datagrid Column Actions',
  decorators: [
    moduleMetadata({
      imports: [AppfxDatagridModule],
    }),
  ],
  argTypes: {
    enableColumnActions: { control: { type: 'boolean' }, name: 'Enable column actions' },
    pinnable: { control: { type: 'boolean' }, name: 'Pinnable columns' },
    // story helpers
    vms: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    enableColumnActions: true,
    pinnable: true,
    vms,
  },
};

const ColumnActionsTemplate: StoryFn = args => ({
  template: `
    <appfx-datagrid
      [gridItems]="vms"
      [columns]="columns"
      [selectionType]="selectionType"
      [footerModel]="{ showFooter: true }"
      [enableColumnActions]="enableColumnActions"
      (columnPinnedChange)="onColumnPinnedChange($event)"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></appfx-datagrid>
    <p>Last pin change: {{ lastPinnedChange || 'none yet' }}</p>
    <p>Last order change: {{ lastOrderChange || 'none yet' }}</p>
  `,
  props: {
    ...args,
    selectionType: SelectionType.None,
    columns: [
      { displayName: 'Name', field: 'name', pinnable: args.pinnable, width: '200px' },
      { displayName: 'State', field: 'state', pinnable: args.pinnable, width: '200px' },
      { displayName: 'Status', field: 'status', width: '160px' },
      { displayName: 'CPUs', field: 'cpus', width: '160px' },
    ] as ColumnDefinition<VmItem>[],
    lastPinnedChange: '',
    lastOrderChange: '',
    onColumnPinnedChange(event: ColumnPinnedState) {
      this['lastPinnedChange'] = `${event.column.displayName} was ${event.pinned ? 'pinned' : 'unpinned'}`;
    },
    onColumnOrderChange(event: ColumnOrderChanged) {
      this['lastOrderChange'] = `New order: ${event.columns.map(column => column.displayName).join(', ')}`;
    },
  },
});

export const ColumnActions: StoryObj = {
  render: ColumnActionsTemplate,
};

// Status is pinned programmatically, so it renders in the sticky container ahead of the rest even
// though it is defined third - the order on screen is not the order of the definitions. Move Left /
// Move Right follow the screen and move each column within its own group: Status has no pinned
// neighbour yet, so both of its directions are disabled, while the loose columns step among
// themselves. Pin Name or State through the menu and the two pinned columns can then be reordered
// with each other.
const WithAPinnedColumnTemplate: StoryFn = args => ({
  template: `
    <appfx-datagrid
      [gridItems]="vms"
      [columns]="columns"
      [selectionType]="selectionType"
      [footerModel]="{ showFooter: true }"
      [enableColumnActions]="true"
    ></appfx-datagrid>
  `,
  props: {
    ...args,
    selectionType: SelectionType.None,
    columns: [
      { displayName: 'Name', field: 'name', pinnable: true, width: '200px' },
      { displayName: 'State', field: 'state', pinnable: true, width: '200px' },
      { displayName: 'Status', field: 'status', pinned: true, width: '160px' },
      { displayName: 'CPUs', field: 'cpus', width: '160px' },
    ] as ColumnDefinition<VmItem>[],
  },
});

export const WithAPinnedColumn: StoryObj = {
  render: WithAPinnedColumnTemplate,
};
