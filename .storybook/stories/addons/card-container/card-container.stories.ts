/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxCardContainerComponent, AppfxCardContainerModule } from '@clr/addons/card-container';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import {
  DynamicCardComponent,
  NotesCardComponent,
  SummaryCardComponent,
  TagsCardComponent,
} from './card-container.storybook.component';

/**
 * The render binds `<appfx-card-container>` directly and `AppfxCardContainerComponent` declares its
 * inputs without aliases, so the component itself is the args type.
 */
type CardContainerArgs = AppfxCardContainerComponent;

const DEFAULT_CARDS: any[] = [
  { id: 'summary', title: 'Summary', unitWidth: 2, unitHeight: 4, componentClass: SummaryCardComponent },
  { id: 'notes', title: 'Notes', unitWidth: 1, unitHeight: 4, componentClass: NotesCardComponent },
  { id: 'tags', title: 'Tags', unitWidth: 1, unitHeight: 4, componentClass: TagsCardComponent },
  { id: 'dynamic', title: 'Dynamic', unitWidth: 1, unitHeight: 4, componentClass: DynamicCardComponent },
];

const meta: Meta<CardContainerArgs> = {
  title: 'Addons/Card Container',
  component: AppfxCardContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        AppfxCardContainerModule,
        SummaryCardComponent,
        NotesCardComponent,
        TagsCardComponent,
        DynamicCardComponent,
      ],
    }),
  ],
  argTypes: {
    showCardContainerSettings: { control: { type: 'boolean' } },
    dragDropEnabled: { control: { type: 'boolean' } },
  },
  args: {
    showCardContainerSettings: true,
    dragDropEnabled: true,
  },
  render: args => ({
    props: { ...args, cards: DEFAULT_CARDS },
    template: `
      <appfx-card-container
        [cards]="cards"
        containerId="story-card-container"
        [showCardContainerSettings]="showCardContainerSettings"
        [dragDropEnabled]="dragDropEnabled"
      ></appfx-card-container>
    `,
  }),
};

export default meta;

type Story = StoryObj<CardContainerArgs>;

export const Default: Story = {};

export const NoSettings: Story = {
  args: { showCardContainerSettings: false },
};

export const NoDragDrop: Story = {
  args: { dragDropEnabled: false },
};
