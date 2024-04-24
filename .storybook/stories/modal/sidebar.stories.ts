/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModalModule, ClrSidebar, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Modal/Sidebar',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrModalModule],
    }),
  ],
  component: ClrSidebar,
  argTypes: {
    // inputs
    clrSidebarCloseButtonAriaLabel: { type: 'string', defaultValue: commonStringsDefault.close },
    clrSidebarLabelledById: { defaultValue: '' },
    clrSidebarSize: {
      defaultValue: 'md',
      control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl', 'full-screen'] },
    },
    clrSidebarSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    clrSidebarBackdrop: { defaultValue: true, control: { type: 'boolean' } },
    // outputs
    clrSidebarOpenChange: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrSidebarOpenChange: action('clrSidebarOpenChange'),
    // story helpers
    title: 'Sidebar Title',
    body: 'Hello World!',
  },
};

const SidebarTemplate: StoryFn = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <div class="content-area" style="height: 300px">
          <button type="button" class="btn btn-primary" (click)="clrSidebarOpen = true">Open Sidebar</button>
          <clr-sidebar
            [clrSidebarBackdrop]="clrSidebarBackdrop"
            [clrSidebarCloseButtonAriaLabel]="clrSidebarCloseButtonAriaLabel"
            [clrSidebarLabelledById]="clrSidebarLabelledById"
            [clrSidebarOpen]="clrSidebarOpen"
            [clrSidebarSize]="clrSidebarSize"
            [clrSidebarSkipAnimation]="clrSidebarSkipAnimation"
            (clrSidebarOpenChange)="clrSidebarOpen = $event; clrSidebarOpenChange($event)"
          >
            <h3 class="sidebar-title">{{ title }}</h3>
            <div class="sidebar-body">
              {{ body }}
            </div>
            <div class="sidebar-footer">
              <button type="button" class="btn btn-outline" (click)="clrSidebarOpen = false">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="clrSidebarOpen = false">Ok</button>
            </div>
          </clr-sidebar>
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
    clrSidebarOpen: true,
    clrSidebarSize: 'sm',
    title: 'Small Sidebar',
    body: 'This is a small sidebar.',
  },
};

export const SidebarMedium: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrSidebarOpen: true,
    clrSidebarSize: 'md',
    title: 'Medium Sidebar',
    body: 'This is a medium sidebar.',
  },
};

export const SidebarLarge: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrSidebarOpen: true,
    clrSidebarSize: 'lg',
    title: 'Large Sidebar',
    body: 'This is a large sidebar.',
  },
};

export const SidebarExtraLarge: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrSidebarOpen: true,
    clrSidebarSize: 'xl',
    title: 'Extra-Large Sidebar',
    body: 'This is a extra-large sidebar.',
  },
};

export const SidebarNoBackdrop: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrSidebarOpen: true,
    clrSidebarSize: 'md',
    clrSidebarBackdrop: false,
    title: 'No Backdrop Sidebar',
    body: 'This is a medium sidebar without backdrop.',
  },
};

export const SidebarFullScreen: StoryObj = {
  render: SidebarTemplate,
  play: removeFocusOutline,
  args: {
    clrSidebarOpen: true,
    clrSidebarSize: 'full-screen',
    title: 'Full-Screen Sidebar',
    body: 'This is a full-screen sidebar.',
    showLongPageContent: false,
  },
};
