/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxCardContainerComponent, AppfxCardContainerModule } from '@clr/addons/card-container';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

@Component({
  selector: 'appfx-demo-summary-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Summary</div>
      <div class="card-block">Summary</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Summary Action</button>
      </div>
    </div>
  `,
})
class SummaryCardComponent {}

@Component({
  selector: 'appfx-demo-note-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Notes</div>
      <div class="card-block">Notes</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Notes Action</button>
      </div>
    </div>
  `,
})
class NotesCardComponent {}

@Component({
  selector: 'appfx-demo-tags-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Tags</div>
      <div class="card-block">Tags Sample</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Tags Action</button>
      </div>
    </div>
  `,
})
class TagsCardComponent {}

@Component({
  selector: 'appfx-demo-dynamic-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Dynamic</div>
      <div class="card-block">Dynamic</div>
    </div>
  `,
})
class DynamicCardComponent {}

const DEFAULT_CARDS: any[] = [
  { id: 'summary', title: 'Summary', unitWidth: 2, unitHeight: 4, componentClass: SummaryCardComponent },
  { id: 'notes', title: 'Notes', unitWidth: 1, unitHeight: 4, componentClass: NotesCardComponent },
  { id: 'tags', title: 'Tags', unitWidth: 1, unitHeight: 4, componentClass: TagsCardComponent },
  { id: 'dynamic', title: 'Dynamic', unitWidth: 1, unitHeight: 4, componentClass: DynamicCardComponent },
];

export default {
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
};

const CardContainerTemplate: StoryFn = args => ({
  props: { ...args, cards: DEFAULT_CARDS },
  template: `
    <appfx-card-container
      [cards]="cards"
      containerId="story-card-container"
      [showCardContainerSettings]="showCardContainerSettings"
      [dragDropEnabled]="dragDropEnabled"
    ></appfx-card-container>
  `,
});

export const Default: StoryObj = {
  render: CardContainerTemplate,
};

export const NoSettings: StoryObj = {
  render: CardContainerTemplate,
  args: { showCardContainerSettings: false },
};

export const NoDragDrop: StoryObj = {
  render: CardContainerTemplate,
  args: { dragDropEnabled: false },
};
