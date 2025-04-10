/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSidePanel, ClrSidePanelModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules, removeFocusOutline } from '../../helpers/common';

export default {
  title: 'Modal/Side Panel (inline)',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrSidePanelModule],
    }),
  ],
  component: ClrSidePanel,
  argTypes: {
    // inputs
    clrSidePanelSize: {
      options: [null, 'sm', 'md', 'lg', 'xl', 'full-screen'],
      control: 'radio',
    },
    clrSidePanelPosition: {
      options: ['right', 'bottom'],
      control: 'radio',
    },
    // outputs
    clrSidePanelOpenChange: { control: { disable: true } },
    clrSidePanelAltClose: { control: { disable: true } },
    // methods
    fadeDone: { control: { disable: true }, table: { disable: true } },
    open: { control: { disable: true }, table: { disable: true } },
    close: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrSidePanelCloseButtonAriaLabel: commonStringsDefault.close,
    clrSidePanelLabelledById: '',
    clrSidePanelSize: null,
    clrSidePanelPinnable: false,
    clrSidePanelPosition: 'right',
    clrSidePanelSkipAnimation: false,
    // outputs
    clrSidePanelOpenChange: action('clrSidePanelOpenChange'),
    clrSidePanelAltClose: action('clrSidePanelAltClose'),
    // story helpers
    title: 'Side Panel Title',
    body: 'Hello World!',
  },
};

const InlineSidePanelTemplate: StoryFn = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <div class="content-area">
          <div clrModalHost cds-layout="p:md" style="border: 1px dashed hotpink; width: 800px; height: 400px">
            <button type="button" class="btn btn-primary" (click)="clrSidePanelOpen = true">Open Side Panel</button>
            <clr-side-panel
              [clrSidePanelBackdrop]="clrSidePanelBackdrop"
              [clrSidePanelPinnable]="clrSidePanelPinnable"
              [clrSidePanelStaticBackdrop]="clrSidePanelStaticBackdrop"
              [clrSidePanelCloseButtonAriaLabel]="clrSidePanelCloseButtonAriaLabel"
              [clrSidePanelLabelledById]="clrSidePanelLabelledById"
              [clrSidePanelOpen]="clrSidePanelOpen"
              [clrSidePanelSize]="clrSidePanelSize"
              [clrSidePanelPosition]="clrSidePanelPosition"
              [clrSidePanelSkipAnimation]="clrSidePanelSkipAnimation"
              (clrSidePanelOpenChange)="clrSidePanelOpen = $event; clrSidePanelOpenChange($event)"
              [clrSidePanelPreventClose]="clrSidePanelPreventClose"
              (clrSidePanelAlternateClose)="clrSidePanelAltClose($event)"
              #sidePanel
            >
              <h3 class="side-panel-title">{{ title }}</h3>
              <div class="side-panel-body">
                {{ body }}
              </div>
              <div class="side-panel-footer">
                <button type="button" class="btn btn-outline" (click)="clrSidePanelOpen = false">Force Close</button>
                <button type="button" class="btn btn-primary" (click)="sidePanel.close()">Close</button>
              </div>
            </clr-side-panel>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
              vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum tincidunt
              velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet metus
              finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit diam.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: args,
});

export const SidePanel: StoryObj = {
  render: InlineSidePanelTemplate,
};

export const SidePanelSmall: StoryObj = {
  render: InlineSidePanelTemplate,
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
  render: InlineSidePanelTemplate,
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
  render: InlineSidePanelTemplate,
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
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'xl',
    clrSidePanelStaticBackdrop: true,
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelBottomSmall: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'sm',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Small Side Panel',
    body: 'This is a small side panel.',
  },
};

export const SidePanelBottomMedium: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Medium Side Panel',
    body: 'This is a medium side panel.',
  },
};

export const SidePanelBottomLarge: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'lg',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Large Side Panel',
    body: 'This is a large side panel.',
  },
};

export const SidePanelBottomExtraLarge: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'xl',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelWithoutBackdrop: StoryObj = {
  render: InlineSidePanelTemplate,
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
  render: InlineSidePanelTemplate,
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

export const SidePanelPinnable: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelBackdrop: false,
    clrSidePanelPinnable: true,
    title: 'Pinnable Side Panel',
    body: 'This is a medium pinnable side panel without backdrop.',
  },
};

export const SidePanelFullScreen: StoryObj = {
  render: InlineSidePanelTemplate,
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

export const SidePanelBottomFullScreen: StoryObj = {
  render: InlineSidePanelTemplate,
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'full-screen',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Full-Screen Side Panel',
    body: 'This is a full-screen side panel.',
    showLongPageContent: false,
  },
};
