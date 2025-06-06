/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModalModule, ClrStackView, ClrStackViewModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Stack View/Stack View Editable',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrStackViewModule, ClrModalModule],
    }),
  ],
  component: ClrStackView,
  argTypes: {
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    blockCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    openIndices: [],
    createArray: n => new Array(n),
    blockCount: 4,
    label: 'Block',
    content: 'Block content',
    subLabel: 'Sub-block',
    subContent: 'Sub-block content',
  },
};

const StackViewTemplate: StoryFn = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-header>
        Stack View With Editing in a Modal
        <button class="stack-action btn btn-link" (click)="editModal = true" type="button">Edit</button>
      </clr-stack-header>

      <clr-stack-block *ngFor="let _ of createArray(blockCount); let i = index" [clrSbExpanded]="!!openIndices[i]">
        <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
        <clr-stack-content>{{ content }}</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
          <clr-stack-content>{{ subContent }}</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>

    <clr-modal [(clrModalOpen)]="editModal">
      <h3 class="modal-title">Edit mode</h3>
      <div class="modal-body">
        <clr-stack-view>
          <clr-stack-block *ngFor="let _ of createArray(blockCount); let i = index" [clrSbExpanded]="!!openIndices[i]">
            <clr-stack-label>{{ label }} {{ i + 1 }}</clr-stack-label>
            <clr-stack-content>
              <input type="text" [(ngModel)]="content" class="clr-input" />
            </clr-stack-content>
            <clr-stack-block>
              <clr-stack-label>{{ subLabel }} {{ i + 1 }}</clr-stack-label>
              <clr-stack-content>
                <input type="text" [(ngModel)]="subContent" class="clr-input" />
              </clr-stack-content>
            </clr-stack-block>
          </clr-stack-block>
        </clr-stack-view>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="editModal = false">Done</button>
      </div>
    </clr-modal>
  `,
  props: args,
});

export const StackViewEditable: StoryObj = {
  render: StackViewTemplate,
};
