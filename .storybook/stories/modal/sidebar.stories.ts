/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModal, ClrModalModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, StoryContext, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Modal/Sidebar',
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
    clrModalStaticBackdrop: { defaultValue: false, control: { type: 'boolean' } },
    clrModalSize: { defaultValue: 'md', control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl'] } },
    clrModalSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    clrNoBackdrop: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrModalAlternateClose: { control: { disable: true } },
    clrModalOpenChange: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrModalAlternateClose: action('clrModalAlternateClose'),
    clrModalOpenChange: action('clrModalOpenChange'),
    // story helpers
    title: 'Sidebar Title',
    body: 'Hello World!',
  },
};

const SidebarTemplate: Story = args => ({
  template: `
    <div style="height: 300px;">
      <button type="button" class="btn btn-primary" (click)="clrModalOpen = true">Open Sidebar</button>
      <clr-modal
        clrSidebar
        [clrNoBackdrop]="clrNoBackdrop"
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
    </div>
  `,
  props: args,
});

export const Sidebar: StoryObj = {
  render: SidebarTemplate,
};

export const SidebarSmall: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'sm',
    title: 'Small Sidebar',
    body: 'This is a small sidebar.',
  },
};

export const SidebarMedium: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'md',
    title: 'Medium Sidebar',
    body: 'This is a medium sidebar.',
  },
};

export const SidebarLarge: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'lg',
    title: 'Large Sidebar',
    body: 'This is a large sidebar.',
  },
};

export const SidebarExtraLarge: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'xl',
    title: 'Extra-Large Sidebar',
    body: 'This is a extra-large sidebar.',
  },
};

export const SidebarNoBackdrop: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'md',
    clrNoBackdrop: true,
    title: 'No Backdrop Sidebar',
    body: 'This is a medium sidebar without backdrop.',
  },
};

function removeFocusOutline({ canvasElement }: StoryContext) {
  // remove keyboard focus outline from modal title
  canvasElement.querySelector<HTMLElement>(':focus').blur();
}
