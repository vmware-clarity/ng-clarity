/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxDatagridModule, ColumnDefinition, DatagridTreeConfig } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { type Meta, moduleMetadata, type StoryContext, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { selectionTypeArgType } from '@storybook-helpers/datagrid.helpers';
import { type FileRow, fileRows } from '@storybook-helpers/files.data';
import { action } from 'storybook/actions';

/** Every arg is a story knob for the `<appfx-datagrid>` template, so the args type is a standalone declaration. */
type TreeArgs = {
  cascadeSelection: boolean;
  selectionType: SelectionType;
  selectedItems: FileRow[];
  treeToggleOnType: boolean;
  treeExpandedChange: (state: unknown) => void;
  selectedItemsChange: (selected: FileRow[]) => void;
  files: FileRow[];
};

const meta = {
  title: 'Addons/Datagrid Tree',
  decorators: [moduleMetadata({ imports: [AppfxDatagridModule] })],
  parameters: {
    docs: {
      description: {
        component:
          'A server-driven `appfx-datagrid` renders a tree from `[treeConfig]`. The toggle and the indentation go in the first column, or in the columns with `treeToggle`.',
      },
    },
  },
  argTypes: {
    selectionType: selectionTypeArgType,
    selectedItems: { control: { disable: true } },
    treeExpandedChange: { control: { disable: true } },
    selectedItemsChange: { control: { disable: true } },
    // story helpers
    ...hideControls('files'),
  },
  args: {
    cascadeSelection: false,
    selectionType: SelectionType.None,
    selectedItems: [],
    treeToggleOnType: false,
    treeExpandedChange: action('treeExpandedChange'),
    selectedItemsChange: action('selectedItemsChange'),
    files: fileRows,
  },
  render: args => {
    const treeConfig: DatagridTreeConfig<FileRow> = {
      getChildren: file => file.children,
      hasChildren: file => file.type === 'Folder',
      cascadeSelection: args.cascadeSelection,
    };
    const columns: ColumnDefinition<FileRow>[] = [
      { displayName: 'Name', field: 'name', width: '240px' },
      { displayName: 'Type', field: 'type', width: '160px', treeToggle: args.treeToggleOnType },
      { displayName: 'Items', field: 'items' },
    ];
    return {
      template: `
        <div class="btn-group btn-sm">
          <button type="button" class="btn btn-outline" (click)="datagrid.expandAllTreeRows()">Expand all</button>
          <button type="button" class="btn btn-outline" (click)="datagrid.collapseAllTreeRows()">Collapse all</button>
        </div>
        <appfx-datagrid
          #datagrid
          [serverDrivenDatagrid]="true"
          [gridItems]="files"
          [totalItems]="files.length"
          [columns]="columns"
          [treeConfig]="treeConfig"
          [selectionType]="selectionType"
          [selectedItems]="selectedItems"
          [layoutModel]="{ stretchToParentHeight: false }"
          [footerModel]="{ showFooter: true }"
          (treeExpandedChange)="treeExpandedChange($event)"
          (selectedItemsChange)="selectedItemsChange($event)"
        ></appfx-datagrid>
      `,
      props: { ...args, treeConfig, columns },
    };
  },
} satisfies Meta<TreeArgs>;

export default meta;

type Story = StoryObj<TreeArgs>;

export const Tree: Story = {};

export const Expanded: Story = {
  play: expandAll,
};

// A file selected in a folder makes the folders above it indeterminate.
export const ExpandedCascadeSelection: Story = {
  play: expandAll,
  args: {
    selectionType: SelectionType.Multi,
    cascadeSelection: true,
    selectedItems: [fileRows[0].children[1].children[0]],
  },
};

// The toggle and the indentation move to the Type column.
export const ExpandedToggleInSecondColumn: Story = {
  play: expandAll,
  args: {
    treeToggleOnType: true,
  },
};

function expandAll({ canvasElement }: StoryContext) {
  canvasElement.querySelector<HTMLButtonElement>('.btn-group .btn')?.click();
}
