/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule, ClrTreeViewModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { filesRoot } from 'helpers/files.data';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
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
            [clrSelected]="true">
            {{file.name}}
          </clr-tree-node>
        </clr-tree>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Dropdown/Dropdown with Tree',
  component: ClrDropdown,
  argTypes: {
    // story helpers
    files: { control: { disable: true }, table: { disable: true } },
    getChildren: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    files: filesRoot,
    getChildren: file => file.files,
  },
};

setupStorybook([ClrDropdownModule, ClrTreeViewModule], defaultStory, defaultParameters);
