/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridModule, ClrDatagridRow, ClrDatagridVirtualTree, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { selectionTypeArgType } from '@storybook-helpers/datagrid.helpers';
import type { FileRow } from '@storybook-helpers/files.data';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridVirtualTree`. Clarity aliases its
 * inputs (`@Input('clrVirtualTreeOf') roots`), so the directive class cannot be the args type.
 */
type TreeVirtualScrollArgs = {
  clrVirtualTreeCascadeSelection: boolean;
  clrDgExpanded: boolean;
  clrDgSelectionType: SelectionType;
  clrDgSelected: FileRow[];
  clrDgSelectedChange: (selected: FileRow[]) => void;
  folders: FileRow[];
  getChildren: (folder: FileRow) => FileRow[];
  height: number;
};

// Enough rows to scroll, collapsed or expanded.
const folders: FileRow[] = Array.from({ length: 100 }, (_, i) => {
  const children: FileRow[] = Array.from({ length: 10 }, (_, j) => ({
    name: `file-${i + 1}-${j + 1}.ts`,
    type: 'File',
    children: [],
  }));
  return { name: `folder-${i + 1}`, type: 'Folder', items: children.length, children };
});

const meta = {
  title: 'Components/Data/Datagrid/Tree Virtualscroll',
  component: ClrDatagridVirtualTree,
  subcomponents: { ClrDatagridRow },
  decorators: [moduleMetadata({ imports: [ClrDatagridModule] })],
  argTypes: {
    // inputs
    clrDgSelectionType: selectionTypeArgType,
    clrDgSelected: { control: { disable: true } },
    // outputs
    clrDgSelectedChange: { control: { disable: true } },
    // story helpers
    ...hideControls('folders', 'getChildren'),
  },
  args: {
    // inputs
    clrVirtualTreeCascadeSelection: false,
    clrDgExpanded: false,
    clrDgSelectionType: SelectionType.None,
    clrDgSelected: [],
    // outputs
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    folders,
    getChildren: folder => folder.children,
    height: 480,
  },
  render: args => ({
    template: `
      <clr-datagrid
        [style.height.px]="height"
        [clrDgSelectionType]="clrDgSelectionType"
        [(clrDgSelected)]="clrDgSelected"
        (clrDgSelectedChange)="clrDgSelectedChange($event)"
      >
        <clr-dg-column>Name</clr-dg-column>
        <clr-dg-column>Type</clr-dg-column>
        <clr-dg-column>Items</clr-dg-column>

        <ng-template
          ClrVirtualScroll
          let-file
          [clrVirtualTreeOf]="folders"
          [clrVirtualTreeGetChildren]="getChildren"
          [clrVirtualTreeCascadeSelection]="clrVirtualTreeCascadeSelection"
        >
          <clr-dg-row
            [clrDgItem]="file"
            [clrDgTreeExpandable]="file.type === 'Folder'"
            [clrDgExpanded]="clrDgExpanded && file.type === 'Folder'"
          >
            <clr-dg-cell>{{ file.name }}</clr-dg-cell>
            <clr-dg-cell>{{ file.type }}</clr-dg-cell>
            <clr-dg-cell>{{ file.items }}</clr-dg-cell>
          </clr-dg-row>
        </ng-template>

        <clr-dg-footer>{{ folders.length }} folders</clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
} satisfies Meta<TreeVirtualScrollArgs>;

export default meta;

type Story = StoryObj<TreeVirtualScrollArgs>;

export const TreeVirtualScroll: Story = {};

export const Expanded: Story = {
  args: {
    clrDgExpanded: true,
  },
};

export const ExpandedCascadeSelection: Story = {
  args: {
    clrDgExpanded: true,
    clrDgSelectionType: SelectionType.Multi,
    clrVirtualTreeCascadeSelection: true,
    clrDgSelected: [folders[0], folders[1].children[0]],
  },
};
