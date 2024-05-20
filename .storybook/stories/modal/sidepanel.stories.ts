/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrModalModule, ClrSidepanel, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Modal/Side Panel',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrModalModule],
    }),
  ],
  component: ClrSidepanel,
  argTypes: {
    // inputs
    clrSidepanelCloseButtonAriaLabel: { type: 'string', defaultValue: commonStringsDefault.close },
    clrSidepanelLabelledById: { defaultValue: '' },
    clrSidepanelSize: {
      defaultValue: 'md',
      control: { type: 'radio', options: ['sm', 'md', 'lg', 'xl', 'full-screen'] },
    },
    clrSidepanelSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrSidepanelOpenChange: { control: { disable: true } },
    clrSidepanelAltClose: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrSidepanelOpenChange: action('clrSidepanelOpenChange'),
    clrSidepanelAltClose: action('clrSidepanelAltClose'),
    // story helpers
    title: 'Side Panel Title',
    body: 'Hello World!',
  },
};

const SidepanelTemplate: StoryFn = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <div class="content-area" style="height: 300px">
          <button type="button" class="btn btn-primary" (click)="clrSidepanelOpen = true">Open Side Panel</button>
          <clr-sidepanel
            [clrSidepanelBackdrop]="clrSidepanelBackdrop"
            [clrSidepanelStaticBackdrop]="clrSidepanelStaticBackdrop"
            [clrSidepanelCloseButtonAriaLabel]="clrSidepanelCloseButtonAriaLabel"
            [clrSidepanelLabelledById]="clrSidepanelLabelledById"
            [clrSidepanelOpen]="clrSidepanelOpen"
            [clrSidepanelSize]="clrSidepanelSize"
            [clrSidepanelSkipAnimation]="clrSidepanelSkipAnimation"
            (clrSidepanelOpenChange)="clrSidepanelOpen = $event; clrSidepanelOpenChange($event)"
            [clrSidepanelPreventClose]="clrSidepanelPreventClose"
            (clrSidepanelAlternateClose)="clrSidepanelAltClose($event)"
            #sidepanel
          >
            <h3 class="sidepanel-title">{{ title }}</h3>
            <div class="sidepanel-body">
              {{ body }}
            </div>
            <div class="sidepanel-footer">
              <button type="button" class="btn btn-outline" (click)="clrSidepanelOpen = false">Force Close</button>
              <button type="button" class="btn btn-primary" (click)="sidepanel.close()">Close</button>
            </div>
          </clr-sidepanel>
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

export const SidePanel: StoryObj = {
  render: SidepanelTemplate,
};

export const SidePanelSmall: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'sm',
    clrSidepanelStaticBackdrop: true,
    title: 'Small Side Panel',
    body: 'This is a small side panel.',
  },
};

export const SidePanelMedium: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'md',
    clrSidepanelStaticBackdrop: true,
    title: 'Medium Side Panel',
    body: 'This is a medium side panel.',
  },
};

export const SidePanelLarge: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'lg',
    clrSidepanelStaticBackdrop: true,
    title: 'Large Side Panel',
    body: 'This is a large side panel.',
  },
};

export const SidePanelExtraLarge: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'xl',
    clrSidepanelStaticBackdrop: true,
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelWithoutBackdrop: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'md',
    clrSidepanelBackdrop: false,
    title: 'Side Panel without backdrop',
    body: 'This is a medium side panel without backdrop.',
  },
};

export const SidePanelAlternateClose: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'md',
    clrSidepanelPreventClose: true,
    clrSidepanelAltClose: function () {
      if (confirm('Do you really want to close the side panel?')) {
        this.clrSidepanelOpen = false;
      }
    },
    title: 'Side Panel with alternate close',
    body: 'This is a medium side panel without backdrop.',
  },
};

export const SidepanelFullScreen: StoryObj = {
  render: SidepanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidepanelOpen: true,
    clrSidepanelSize: 'full-screen',
    clrSidepanelStaticBackdrop: true,
    title: 'Full-Screen Side Panel',
    body: 'This is a full-screen side panel.',
    showLongPageContent: false,
  },
};
