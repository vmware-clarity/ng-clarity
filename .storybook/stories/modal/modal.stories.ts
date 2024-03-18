/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModal, ClrModalModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Modal/Modal',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrModalModule],
    }),
  ],
  component: ClrModal,
  argTypes: {
    // inputs
    clrModalCloseButtonAriaLabel: { type: 'string', defaultValue: commonStringsDefault.close },
    clrModalLabelledById: { defaultValue: '' },
    clrModalSize: { defaultValue: 'md', control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl'] } },
    clrModalSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrModalAlternateClose: { control: { disable: true } },
    clrModalOpenChange: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrModalAlternateClose: action('clrModalAlternateClose'),
    clrModalOpenChange: action('clrModalOpenChange'),
    // story helpers
    createArray: n => new Array(n),
    title: 'Modal Title',
    body: 'Hello World!',
  },
};

const ModalTemplate: Story = args => ({
  template: `
    <button type="button" class="btn btn-primary" (click)="clrModalOpen = true">Open Modal</button>
    <div>
      This list is provided to demonstrate scrolling capability when modal is open.
      <ul>
        <li *ngFor="let _ of createArray(100); let i = index">{{i + 1}}</li>
      </ul>
    </div>
    <clr-modal
      [clrModalClosable]="clrModalClosable"
      [clrModalCloseButtonAriaLabel]="clrModalCloseButtonAriaLabel"
      [clrModalLabelledById]="clrModalLabelledById"
      [clrModalOpen]="clrModalOpen"
      [clrModalPreventClose]="clrModalPreventClose"
      [clrModalSize]="clrModalSize"
      [clrModalSkipAnimation]="clrModalSkipAnimation"
      [clrModalStaticBackdrop]="clrModalStaticBackdrop"
      (clrModalAlternateClose)="clrModalAlternateClose($event)"
      (clrModalOpenChange)="clrModalOpen = $event; clrModalOpenChange($event)"
    >
      <h3 class="modal-title">{{title}}</h3>
      <div class="modal-body">
        {{body}}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="clrModalOpen = false">Cancel</button>
        <button type="button" class="btn btn-primary" (click)="clrModalOpen = false">Ok</button>
      </div>
    </clr-modal>
  `,
  props: args,
});

export const Modal: StoryObj = {
  render: ModalTemplate,
};
