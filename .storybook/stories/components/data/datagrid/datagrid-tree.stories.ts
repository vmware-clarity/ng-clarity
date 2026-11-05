/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrDatagridModule,
  ClrDatagridRow,
  ClrDatagridTreeChildrenFunction,
  ClrDatagridTreeItems,
  SelectionType,
} from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { selectionTypeArgType } from '@storybook-helpers/datagrid.helpers';
import { type FileRow, fileRows } from '@storybook-helpers/files.data';
import { NEVER } from 'rxjs';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridTreeItems`. Clarity aliases its
 * inputs (`@Input('clrDgTreeItemsCascadeSelection') cascadeSelection`), so the directive class cannot
 * be the args type.
 */
type TreeArgs = {
  clrDgTreeItemsCascadeSelection: boolean;
  clrDgExpanded: boolean;
  clrDgSelectionType: SelectionType;
  clrDgSelected: FileRow[];
  clrDgExpandedChange: (expanded: boolean) => void;
  clrDgSelectedChange: (selected: FileRow[]) => void;
  files: FileRow[];
  getChildren: ClrDatagridTreeChildrenFunction<FileRow>;
  overflowEllipsis: boolean;
  nameColumnWidth: number;
};

const meta = {
  title: 'Components/Data/Datagrid/Tree',
  component: ClrDatagridTreeItems,
  subcomponents: { ClrDatagridRow },
  decorators: [moduleMetadata({ imports: [ClrDatagridModule] })],
  argTypes: {
    // inputs
    clrDgSelectionType: selectionTypeArgType,
    clrDgSelected: { control: { disable: true } },
    // outputs
    clrDgExpandedChange: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    // story helpers
    ...hideControls('files', 'getChildren'),
  },
  args: {
    // inputs
    clrDgTreeItemsCascadeSelection: false,
    clrDgExpanded: false,
    clrDgSelectionType: SelectionType.None,
    clrDgSelected: [],
    // outputs
    clrDgExpandedChange: action('clrDgExpandedChange'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    files: fileRows,
    getChildren: file => file.children,
    overflowEllipsis: false,
    nameColumnWidth: 0,
  },
  render: args => ({
    template: `
      <div class="btn-group btn-sm">
        <button type="button" class="btn btn-outline" (click)="datagrid.expandAllTreeRows()">Expand all</button>
        <button type="button" class="btn btn-outline" (click)="datagrid.collapseAllTreeRows()">Collapse all</button>
      </div>
      <clr-datagrid
        #datagrid
        [clrDgSelectionType]="clrDgSelectionType"
        [(clrDgSelected)]="clrDgSelected"
        [class.datagrid-overflow-ellipsis]="overflowEllipsis"
        (clrDgSelectedChange)="clrDgSelectedChange($event)"
      >
        <clr-dg-column ${args.nameColumnWidth ? '[style.width.px]="nameColumnWidth"' : ''}>Name</clr-dg-column>
        <clr-dg-column>Type</clr-dg-column>
        <clr-dg-column>Items</clr-dg-column>

        <clr-dg-row
          *clrDgTreeItems="let file of files; getChildren: getChildren; cascadeSelection: clrDgTreeItemsCascadeSelection"
          [clrDgItem]="file"
          [clrDgTreeExpandable]="file.type === 'Folder'"
          [clrDgExpanded]="clrDgExpanded && file.type === 'Folder'"
          (clrDgExpandedChange)="clrDgExpandedChange($event)"
        >
          <clr-dg-cell>{{ file.name }}</clr-dg-cell>
          <clr-dg-cell>{{ file.type }}</clr-dg-cell>
          <clr-dg-cell>{{ file.items }}</clr-dg-cell>
        </clr-dg-row>

        <clr-dg-footer>{{ files.length }} top-level files</clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
} satisfies Meta<TreeArgs>;

export default meta;

type Story = StoryObj<TreeArgs>;

export const Tree: Story = {};

export const Expanded: Story = {
  args: {
    clrDgExpanded: true,
  },
};

// A file selected in a folder makes the folders above it indeterminate.
export const ExpandedCascadeSelection: Story = {
  args: {
    clrDgExpanded: true,
    clrDgSelectionType: SelectionType.Multi,
    clrDgTreeItemsCascadeSelection: true,
    clrDgSelected: [fileRows[0].children[1].children[0]],
  },
};

// The indentation gives way before the text when the column is narrow.
export const ExpandedNarrowColumnOverflowEllipsis: Story = {
  args: {
    clrDgExpanded: true,
    overflowEllipsis: true,
    nameColumnWidth: 160,
  },
};

// A spinner replaces the toggle of an expanded row while its children load.
export const LoadingChildren: Story = {
  args: {
    clrDgExpanded: true,
    getChildren: () => NEVER,
  },
};
