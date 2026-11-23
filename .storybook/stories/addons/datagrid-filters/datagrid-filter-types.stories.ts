/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { DatagridFilterTypesStoryComponent } from './filter-types.storybook.component';

const meta = {
  title: 'Addons/Filter Types',
  component: DatagridFilterTypesStoryComponent,
  decorators: [moduleMetadata({ imports: [DatagridFilterTypesStoryComponent] })],
  render: () => ({ template: `<clr-datagrid-filter-types-story></clr-datagrid-filter-types-story>` }),
} satisfies Meta<DatagridFilterTypesStoryComponent>;

export default meta;

type Story = StoryObj<DatagridFilterTypesStoryComponent>;

/** Every filter type on one page: a pill per type, then each editor open as in its popover. */
export const EveryFilterType: Story = {};
