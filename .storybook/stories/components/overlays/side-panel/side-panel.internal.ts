/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSidePanel, ClrSidePanelModule, commonStringsDefault } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { fn } from 'storybook/test';

/**
 * `ClrSidePanel` aliases almost every input (`@Input('clrSidePanelOpen') _open`), so the `clrSidePanel*`
 * names these stories bind are mostly not properties of the class. Only `clrSidePanelBackdrop`,
 * `clrSidePanelPinnable` and the `open`/`close` methods line up, so those come off `ClrSidePanel` and
 * the rest are declared here.
 */
export type SidePanelArgs = Pick<ClrSidePanel, 'clrSidePanelBackdrop' | 'clrSidePanelPinnable' | 'open' | 'close'> & {
  clrSidePanelCloseButtonAriaLabel: string;
  clrSidePanelLabelledById: string;
  clrSidePanelSize: string;
  clrSidePanelPosition: string;
  clrSidePanelOpen: boolean;
  clrSidePanelClosable: boolean;
  clrSidePanelPinned: boolean;
  clrSidePanelPreventClose: boolean;
  clrSidePanelSkipAnimation: boolean;
  clrSidePanelStaticBackdrop: boolean;
  clrSidePanelOpenChange: (open: boolean) => void;
  clrSidePanelAltClose: (open: boolean) => void;
  title: string;
  body: string;
  showLongPageContent: boolean;
};

/** The parts of the meta both side-panel story files share; each file adds its own title and render. */
export const config: Pick<Meta<SidePanelArgs>, 'decorators' | 'component' | 'argTypes' | 'args'> = {
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
    ...hideControls('fadeDone', 'open', 'close'),
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
    clrSidePanelOpenChange: fn(),
    clrSidePanelAltClose: fn(),
    // story helpers
    title: 'Side Panel Title',
    body: 'Hello World!',
  },
};

export const SidePanel: StoryObj<SidePanelArgs> = {};

export const SidePanelSmall: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'sm',
    clrSidePanelStaticBackdrop: true,
    title: 'Small Side Panel',
    body: 'This is a small side panel.',
  },
};

export const SidePanelMedium: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelStaticBackdrop: true,
    title: 'Medium Side Panel',
    body: 'This is a medium side panel.',
  },
};

export const SidePanelLarge: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'lg',
    clrSidePanelStaticBackdrop: true,
    title: 'Large Side Panel',
    body: 'This is a large side panel.',
  },
};

export const SidePanelExtraLarge: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'xl',
    clrSidePanelStaticBackdrop: true,
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelBottomSmall: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'sm',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Small Side Panel',
    body: 'This is a small side panel.',
  },
};

export const SidePanelBottomMedium: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Medium Side Panel',
    body: 'This is a medium side panel.',
  },
};

export const SidePanelBottomLarge: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'lg',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Large Side Panel',
    body: 'This is a large side panel.',
  },
};

export const SidePanelBottomExtraLarge: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'xl',
    clrSidePanelStaticBackdrop: true,
    clrSidePanelPosition: 'bottom',
    title: 'Extra-Large Side Panel',
    body: 'This is a extra-large side panel.',
  },
};

export const SidePanelWithBackdrop: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelBackdrop: true,
    title: 'Side Panel with backdrop',
    body: 'This is a medium side panel with backdrop.',
  },
};

export const SidePanelAlternateClose: StoryObj<SidePanelArgs> = {
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

export const SidePanelPinnable: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPinnable: true,
    title: 'Pinnable Side Panel',
    body: 'This is a medium pinnable side panel.',
  },
};

export const SidePanelPinned: StoryObj<SidePanelArgs> = {
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

export const SidePanelBottomPinnable: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'md',
    clrSidePanelPosition: 'bottom',
    clrSidePanelPinnable: true,
    title: 'Pinnable Side Panel',
    body: 'This is a medium pinnable side panel.',
  },
};

export const SidePanelBottomPinned: StoryObj<SidePanelArgs> = {
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

export const SidePanelFullScreen: StoryObj<SidePanelArgs> = {
  args: {
    clrSidePanelOpen: true,
    clrSidePanelSize: 'full-screen',
    clrSidePanelStaticBackdrop: true,
    title: 'Full-Screen Side Panel',
    body: 'This is a full-screen side panel.',
    showLongPageContent: false,
  },
};

export const SidePanelBottomFullScreen: StoryObj<SidePanelArgs> = {
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
