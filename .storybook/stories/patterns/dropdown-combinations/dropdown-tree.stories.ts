/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule, ClrTreeViewModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { type File, filesRoot } from '@storybook-helpers/files.data';

/**
 * No aliased `ClrDropdown` input is an arg here; `files` and `getChildren` are story-only props
 * `*clrRecursiveFor` reads through `props`.
 */
type DropdownWithTreeArgs = ClrDropdown & {
  files: File[];
  getChildren: (file: File) => File[];
};

const meta: Meta<DropdownWithTreeArgs> = {
  title: 'Patterns/Dropdown Combinations/Dropdown Tree',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule, ClrTreeViewModule],
    }),
  ],
  component: ClrDropdown,
  argTypes: {
    // story helpers
    ...hideControls('files', 'getChildren'),
  },
  args: {
    // story helpers
    files: filesRoot,
    getChildren: file => file.files,
  },
  render: args => ({
    template: `
      <div style="margin-bottom: 500px; text-align: center">
        <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu clrFocusOnViewInit="false">
            <clr-tree>
              <clr-tree-node
                *clrRecursiveFor="let file of files; getChildren: getChildren"
                [clrExpanded]="true"
                [clrSelected]="true"
              >
                {{ file.name }}
              </clr-tree-node>
            </clr-tree>
          </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<DropdownWithTreeArgs>;

export const DropdownWithTree: Story = {};
