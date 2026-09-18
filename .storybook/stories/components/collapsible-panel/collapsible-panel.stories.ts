/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { StorybookPanelGroup } from './collapsible-panel.storybook.component';

/** The args drive `<storybook-panel-group>`, so the args type is that wrapper. */
type CollapsiblePanelArgs = StorybookPanelGroup;

const meta: Meta<CollapsiblePanelArgs> = {
  title: 'Components/Collapsible Panel',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, StorybookPanelGroup],
    }),
  ],
  argTypes: {
    panelCount: { control: { type: 'number', min: 1, max: 10 } },
    panelDisabled: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    ...hideControls('openIndices'),
  },
  args: {
    panelCount: 3,
    panelDisabled: false,
    title: 'Panel',
    content: 'Content for panel',
    openIndices: [],
  },
  render: args => ({
    props: args,
    template: `
      <storybook-panel-group
        [panelCount]="panelCount"
        [panelDisabled]="panelDisabled"
        [title]="title"
        [content]="content"
        [openIndices]="openIndices"
      ></storybook-panel-group>
    `,
  }),
};

export default meta;

type Story = StoryObj<CollapsiblePanelArgs>;

export const DefaultCollapsed: Story = {};

export const SinglePanelExpanded: Story = {
  args: { openIndices: [true] },
};

export const AllPanelsDisabled: Story = {
  args: { panelDisabled: true },
};

export const ExpandedAndDisabled: Story = {
  args: { openIndices: [true], panelDisabled: true },
};

export const MultiplePanelsExpanded: Story = {
  args: { openIndices: [true, false, true] },
};

export const SinglePanel: Story = {
  args: { panelCount: 1, openIndices: [true] },
};

export const ManyPanels: Story = {
  args: { panelCount: 8, openIndices: [false, false, true] },
};
