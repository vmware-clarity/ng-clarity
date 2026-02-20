/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, StoryObj } from '@storybook/angular';

import { StorybookPanelGroup } from './collapsible-panel.storybook.component';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Collapsible Panel/Collapsible Panel',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, StorybookPanelGroup],
    }),
  ],
  argTypes: {
    panelCount: { control: { type: 'number', min: 1, max: 10 } },
    multiPanel: { control: 'boolean' },
    panelDisabled: { control: 'boolean' },
    showDescriptions: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    openIndices: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    panelCount: 3,
    multiPanel: false,
    panelDisabled: false,
    showDescriptions: false,
    title: 'Panel',
    content: 'Content for panel',
    openIndices: [],
  },
  render: (args: StorybookPanelGroup) => ({
    props: args,
    template: `
      <storybook-panel-group
        [multiPanel]="multiPanel"
        [panelCount]="panelCount"
        [panelDisabled]="panelDisabled"
        [title]="title"
        [content]="content"
        [showDescriptions]="showDescriptions"
        [openIndices]="openIndices"
      ></storybook-panel-group>
    `,
  }),
};

export const DefaultCollapsed: StoryObj = {};

export const SinglePanelExpanded: StoryObj = {
  args: {
    openIndices: [true],
  },
};

export const AllPanelsDisabled: StoryObj = {
  args: {
    panelDisabled: true,
  },
};

export const ExpandedAndDisabled: StoryObj = {
  args: {
    openIndices: [true],
    panelDisabled: true,
  },
};

export const MultiPanelMode: StoryObj = {
  args: {
    multiPanel: true,
    openIndices: [true, false, true],
  },
};

export const WithDescriptions: StoryObj = {
  args: {
    showDescriptions: true,
    openIndices: [true],
  },
};

export const SinglePanel: StoryObj = {
  args: {
    panelCount: 1,
    openIndices: [true],
  },
};

export const ManyPanels: StoryObj = {
  args: {
    panelCount: 8,
    openIndices: [false, false, true],
  },
};
