/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSidePanel, ClrSidePanelModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Modal/Side Panel',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSidePanelModule],
    }),
  ],
  component: ClrSidePanel,
  argTypes: {
    // inputs
    clrSidePanelCloseButtonAriaLabel: { type: 'string', defaultValue: commonStringsDefault.close },
    clrSidePanelLabelledById: { defaultValue: '' },
    clrSidePanelSize: {
      defaultValue: 'md',
      options: ['sm', 'md', 'lg', 'xl', 'full-screen'],
      control: { type: 'radio' },
    },
    clrSidePanelSkipAnimation: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrSidePanelOpenChange: { control: { disable: true } },
    clrSidePanelAltClose: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrSidePanelOpenChange: action('clrSidePanelOpenChange'),
    clrSidePanelAltClose: action('clrSidePanelAltClose'),
    // story helpers
    title: 'Side Panel Title',
    body: 'Hello World!',
  },
};

const SidePanelTemplate: StoryFn = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <div class="content-area" style="height: 300px">
          <button type="button" class="btn btn-primary" (click)="clrSidePanelOpen = true">Open Side Panel</button>
          <clr-sidepanel
            [clrSidePanelBackdrop]="clrSidePanelBackdrop"
            [clrSidePanelStaticBackdrop]="clrSidePanelStaticBackdrop"
            [clrSidePanelCloseButtonAriaLabel]="clrSidePanelCloseButtonAriaLabel"
            [clrSidePanelLabelledById]="clrSidePanelLabelledById"
            [clrSidePanelOpen]="clrSidePanelOpen"
            [clrSidePanelSize]="clrSidePanelSize"
            [clrSidePanelSkipAnimation]="clrSidePanelSkipAnimation"
            (clrSidePanelOpenChange)="clrSidePanelOpen = $event; clrSidePanelOpenChange($event)"
            [clrSidePanelPreventClose]="clrSidePanelPreventClose"
            (clrSidePanelAlternateClose)="clrSidePanelAltClose($event)"
            #sidepanel
          >
            <h3 class="sidepanel-title">{{ title }}</h3>
            <div class="sidepanel-body">
              {{ body }}
            </div>
            <div class="sidepanel-footer">
              <button type="button" class="btn btn-outline" (click)="clrSidePanelOpen = false">Force Close</button>
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
  render: SidePanelTemplate,
};

export const SidePanelSmall: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'sm',
    clrSidePanelStaticBackdrop: true,
    title: 'Small Side Panel',
    body: 'This is a small side panel.',
  },
};

export const SidePanelMedium: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelStaticBackdrop: true,
    title: 'Medium Side Panel',
    body: 'This is a medium side panel.',
  },
};

export const SidePanelLarge: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'lg',
    clrSidePanelStaticBackdrop: true,
    title: 'Large Side Panel',
    body: 'This is a large side panel.',
  },
};

export const SidePanelExtraLarge: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'xl',
    clrSidePanelStaticBackdrop: true,
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelWithoutBackdrop: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelBackdrop: false,
    title: 'Side Panel without backdrop',
    body: 'This is a medium side panel without backdrop.',
  },
};

export const SidePanelAlternateClose: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPreventClose: true,
    clrSidePanelAltClose: function () {
      if (confirm('Do you really want to close the side panel?')) {
        this.clrSidePanelOpen = false;
      }
    },
    title: 'Side Panel with alternate close',
    body: 'This is a medium side panel without backdrop.',
  },
};

export const SidePanelFullScreen: StoryObj = {
  render: SidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'full-screen',
    clrSidePanelStaticBackdrop: true,
    title: 'Full-Screen Side Panel',
    body: 'This is a full-screen side panel.',
    showLongPageContent: false,
  },
};
