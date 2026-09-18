/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxDatagridFiltersModule, DataGridFiltersComponent, FilterMode } from '@clr/addons/datagrid-filters';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { DatagridFiltersStoryWrapperComponent, presetFilters } from './datagrid-filters.storybook.component';

/** The render targets `<clr-datagrid-filters-story-wrapper>`, so the wrapper's inputs are the args. */
type DatagridFiltersArgs = DatagridFiltersStoryWrapperComponent;

const meta: Meta<DatagridFiltersArgs> = {
  title: 'Addons/Datagrid Filters',
  component: DataGridFiltersComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxDatagridFiltersModule, CommonModule, DatagridFiltersStoryWrapperComponent],
    }),
  ],
  argTypes: {
    filterMode: {
      control: { type: 'select' },
      options: [FilterMode.Quick, FilterMode.Advanced, FilterMode.AdvancedOnly],
      labels: {
        [FilterMode.Quick]: 'Quick',
        [FilterMode.Advanced]: 'Advanced',
        [FilterMode.AdvancedOnly]: 'AdvancedOnly',
      },
    },
    presetFilters: { control: false },
  },
  args: {
    filterMode: FilterMode.Advanced,
    presetFilters: [],
  },
  render: args => ({
    props: args,
    template: `
      <clr-datagrid-filters-story-wrapper
        [filterMode]="filterMode"
        [presetFilters]="presetFilters"
      ></clr-datagrid-filters-story-wrapper>
    `,
  }),
};

export default meta;

type Story = StoryObj<DatagridFiltersArgs>;

export const Advanced: Story = {};

export const Quick: Story = {
  args: {
    filterMode: FilterMode.Quick,
  },
};

export const AdvancedOnly: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
  },
};

export const AdvancedWithPresetFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    presetFilters,
  },
};
