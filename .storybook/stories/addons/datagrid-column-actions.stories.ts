/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ActionClickEvent,
  ActionDefinition,
  AppfxDatagridModule,
  ColumnDefinition,
  ColumnOrderChanged,
  ColumnPinnedState,
} from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { ClarityIcons, copyIcon, infoStandardIcon } from '@clr/angular/icon';
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

// An action names an icon shape, so whoever configures it registers the shape, the same as for a
// cds-icon of its own.
ClarityIcons.addIcons(copyIcon, infoStandardIcon);

// Offered in every column's menu, after the built-in items. The disabled one is here to show that a
// disabled action is announced as such and cannot be invoked.
const gridColumnActions: ActionDefinition[] = [
  { id: 'copy-values', label: 'Copy column values', enabled: true, icon: 'copy' },
  {
    id: 'column-details',
    label: 'Column details',
    enabled: false,
    tooltip: 'Nothing to show for this column yet',
    icon: 'info-standard',
  },
];

// The menu is opt-in through enableColumnActions on appfx-datagrid, and off by default. Sort and
// Filter join it automatically once the column is sortable/filterable; pinnable adds Pin Column.
// Move Left and Move Right step the column within its own group - pinned columns reorder among the
// pinned ones, loose columns among the loose ones.
//
// An application adds items of its own after those, from either level of the configuration:
// columnActions on the grid for every column, and actions on a column definition for just that one.
// Both report through the grid's actionClick output, with the column definition as the context.
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
      [columnActions]="columnActions"
      (columnPinnedChange)="onColumnPinnedChange($event)"
      (columnOrderChange)="onColumnOrderChange($event)"
      (actionClick)="onActionClick($event)"
    ></appfx-datagrid>
    <p>Last pin change: {{ lastPinnedChange || 'none yet' }}</p>
    <p>Last order change: {{ lastOrderChange || 'none yet' }}</p>
    <p>Last action: {{ lastActionClick || 'none yet' }}</p>
  `,
  props: {
    ...args,
    selectionType: SelectionType.None,
    columnActions: gridColumnActions,
    columns: [
      { displayName: 'Name', field: 'name', pinnable: args.pinnable, width: '200px' },
      { displayName: 'State', field: 'state', pinnable: args.pinnable, width: '200px' },
      { displayName: 'Status', field: 'status', width: '160px' },
      {
        displayName: 'CPUs',
        field: 'cpus',
        width: '160px',
        // Only offered on this column, and appended after the grid-wide ones. No icon on this one,
        // which is allowed - it just does not line up with the items that have one.
        actions: [{ id: 'reset-cpus', label: 'Reset CPU filter', enabled: true }],
      },
    ] as ColumnDefinition<VmItem>[],
    lastPinnedChange: '',
    lastOrderChange: '',
    lastActionClick: '',
    onColumnPinnedChange(event: ColumnPinnedState) {
      this['lastPinnedChange'] = `${event.column.displayName} was ${event.pinned ? 'pinned' : 'unpinned'}`;
    },
    onColumnOrderChange(event: ColumnOrderChanged) {
      this['lastOrderChange'] = `New order: ${event.columns.map(column => column.displayName).join(', ')}`;
    },
    onActionClick(event: ActionClickEvent<ColumnDefinition<VmItem>>) {
      this['lastActionClick'] = `${event.action.label} on ${event.context.displayName}`;
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
