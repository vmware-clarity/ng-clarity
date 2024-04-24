/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModal, ClrModalModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

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
    clrModalSize: { defaultValue: 'md', control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl', 'full-screen'] } },
    clrModalSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    clrSidebarBackdrop: { defaultValue: true, control: { type: 'boolean' } },
    clrSidebarPinnable: { defaultValue: false, control: { type: 'boolean' } },
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
    <div class="main-container">
      <header class="header header-6">TEST</header>
      <div class="content-container">
        <div class="content-area" style="height: 300px">
          <button type="button" class="btn btn-primary" (click)="clrModalOpen = true">Open Sidebar</button>
          <clr-modal
            clrSidebar
            [clrSidebarBackdrop]="clrSidebarBackdrop"
            [clrSidebarPinnable]="clrSidebarPinnable"
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
            <h3 class="modal-title">{{ title }}</h3>
            <div class="modal-body">
              {{ body }}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="clrModalOpen = false">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="clrModalOpen = false">Ok</button>
            </div>
          </clr-modal>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
            Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
            sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh lacus,
            in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum vulputate
            sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum tincidunt velit
            pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet metus finibus
            hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit diam.
          </div>
        </div>
      </div>
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
    clrSidebarBackdrop: false,
    title: 'No Backdrop Sidebar',
    body: 'This is a medium sidebar without backdrop.',
  },
};

export const SidebarPinnable: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'md',
    clrSidebarBackdrop: false,
    clrSidebarPinnable: true,
    title: 'Pinnable Sidebar',
    body: 'This is a medium pinnable sidebar without backdrop.',
  },
};

export const SidebarFullScreen: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrModalOpen: true,
    clrModalSize: 'full-screen',
    title: 'Full-Screen Sidebar',
    body: 'This is a full-screen sidebar.',
    showLongPageContent: false,
  },
};
