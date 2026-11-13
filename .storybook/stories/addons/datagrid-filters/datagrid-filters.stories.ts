/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AppfxDatagridFiltersModule, DataGridFiltersComponent, FilterMode } from '@clr/addons/datagrid-filters';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import {
  createdOnly,
  customRangePresetFilters,
  DatagridFiltersStoryWrapperComponent,
  equalsDayPresetFilters,
  lastWeekPresetFilters,
  modifiedOnly,
  predefinedFilters,
  presetFilters,
  savedView,
  semiPredefinedFilters,
  toggleFilters,
} from './datagrid-filters.storybook.component';

/** The render targets `<clr-datagrid-filters-story-wrapper>`, so the wrapper's inputs are the args. */
type DatagridFiltersArgs = DatagridFiltersStoryWrapperComponent;

const meta = {
  title: 'Addons/Filters',
  component: DataGridFiltersComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxDatagridFiltersModule, CommonModule, DatagridFiltersStoryWrapperComponent],
    }),
  ],
  argTypes: {
    filterMode: {
      control: {
        type: 'select',
        labels: {
          [FilterMode.Quick]: 'Quick',
          [FilterMode.Advanced]: 'Advanced',
          [FilterMode.AdvancedOnly]: 'AdvancedOnly',
          [FilterMode.Combined]: 'Combined',
        },
      },
      options: [FilterMode.Quick, FilterMode.Advanced, FilterMode.AdvancedOnly, FilterMode.Combined],
    },
    presetFilters: { control: false },
    predefinedFilters: { control: false },
    semiPredefinedFilters: { control: false },
    toggleFilters: { control: false },
    savedView: { control: false },
  },
  args: {
    filterMode: FilterMode.Advanced,
    presetFilters: [],
    predefinedFilters: [],
    semiPredefinedFilters: [],
    toggleFilters: [],
    savedView: [],
  },
  render: args => ({
    props: args,
    template: `
      <clr-datagrid-filters-story-wrapper
        [filterMode]="filterMode"
        [presetFilters]="presetFilters"
        [predefinedFilters]="predefinedFilters"
        [semiPredefinedFilters]="semiPredefinedFilters"
        [toggleFilters]="toggleFilters"
        [savedView]="savedView"
      ></clr-datagrid-filters-story-wrapper>
    `,
  }),
} satisfies Meta<DatagridFiltersArgs>;

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

export const PredefinedFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    predefinedFilters,
  },
};

export const PredefinedFiltersWithDefaults: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    predefinedFilters,
    presetFilters,
  },
};

export const Combined: Story = {
  args: {
    filterMode: FilterMode.Combined,
    predefinedFilters,
  },
};

export const SemiPredefinedFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    semiPredefinedFilters,
  },
};

export const ToggleFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    toggleFilters,
  },
};

export const PredefinedSemiPredefinedAndToggleFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    // Status is left out of the predefined pills, so its toggle can claim the field.
    predefinedFilters: predefinedFilters.filter(property => property.property !== 'status'),
    semiPredefinedFilters,
    toggleFilters,
  },
};

export const TwoWayPropertyFilters: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    toggleFilters,
    savedView,
  },
};

export const DateTimeEquals: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    presetFilters: equalsDayPresetFilters,
  },
};

export const DateTimeCustomRange: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    presetFilters: customRangePresetFilters,
  },
};

export const DateTimeLastWeek: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    // The pill shows "Last week" from the editor state, whatever date the criteria start at.
    presetFilters: lastWeekPresetFilters(),
  },
};

export const DateTimePresetRanges: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    // Open Created, choose Custom range: the ranges are in the date picker, or buttons once a time is added.
    predefinedFilters: createdOnly,
  },
};

export const DateTimeWithSeconds: Story = {
  args: {
    filterMode: FilterMode.AdvancedOnly,
    // Open Last modified and add a time: the time inputs take seconds (includeSeconds).
    predefinedFilters: modifiedOnly,
  },
};
