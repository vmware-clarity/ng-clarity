/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSidePanel, ClrSidePanelModule, commonStringsDefault } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { removeFocusOutline } from '../../helpers/common';
import { CommonModules } from '../../helpers/common';

export function render(story: StoryObj, template: StoryFn): StoryObj {
  return {
    ...story,
    render: template,
  };
}

export const config = {
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
    clrSidePanelBackdrop: false,
    clrSidePanelPinnable: false,
    clrSidePanelClosable: true,
    clrSidePanelPinned: false,
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

export const SidePanel: StoryObj = {};

export const SidePanelSmall: StoryObj = {
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

export const SidePanelWithBackdrop: StoryObj = {
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelBackdrop: true,
    title: 'Side Panel with backdrop',
    body: 'This is a medium side panel with backdrop.',
  },
};

export const SidePanelAlternateClose: StoryObj = {
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
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPinnable: true,
    title: 'Pinnable Side Panel',
    body: 'This is a medium pinnable side panel.',
  },
};

export const SidePanelPinned: StoryObj = {
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPinnable: false,
    clrSidePanelPinned: true,
    clrSidePanelClosable: false,
    title: 'Pinned Side Panel',
    body: 'This is a medium pinned side panel.',
  },
};

export const SidePanelBottomPinnable: StoryObj = {
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPosition: 'bottom',
    clrSidePanelPinnable: true,
    title: 'Pinnable Side Panel',
    body: 'This is a medium pinnable side panel.',
  },
};

export const SidePanelBottomPinned: StoryObj = {
  play: removeFocusOutline,
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPosition: 'bottom',
    clrSidePanelPinnable: false,
    clrSidePanelPinned: true,
    clrSidePanelClosable: false,
    title: 'Pinned Side Panel',
    body: 'This is a medium pinned side panel.',
  },
};

export const SidePanelFullScreen: StoryObj = {
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
