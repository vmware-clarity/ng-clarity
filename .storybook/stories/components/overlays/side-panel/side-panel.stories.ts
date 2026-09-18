/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';

import * as stories from './side-panel.internal';

/** Both side-panel story files share one args type, declared next to the args themselves. */
type SidePanelArgs = stories.SidePanelArgs;

const meta: Meta<SidePanelArgs> = {
  title: 'Components/Overlays/Side Panel',
  decorators: stories.config.decorators,
  component: stories.config.component,
  argTypes: stories.config.argTypes,
  args: stories.config.args,
  render: args => ({
    template: `
      <div class="main-container">
        <div class="content-container">
          <div class="content-area" clrModalHost>
            <button type="button" class="btn btn-primary" (click)="clrSidePanelOpen = true">Open Side Panel</button>
            <clr-side-panel
              [clrSidePanelPinnable]="clrSidePanelPinnable"
              [clrSidePanelPinned]="clrSidePanelPinned"
              [clrSidePanelBackdrop]="clrSidePanelBackdrop"
              [clrSidePanelStaticBackdrop]="clrSidePanelStaticBackdrop"
              [clrSidePanelCloseButtonAriaLabel]="clrSidePanelCloseButtonAriaLabel"
              [clrSidePanelLabelledById]="clrSidePanelLabelledById"
              [clrSidePanelOpen]="clrSidePanelOpen"
              [clrSidePanelSize]="clrSidePanelSize"
              [clrSidePanelPosition]="clrSidePanelPosition"
              [clrSidePanelSkipAnimation]="clrSidePanelSkipAnimation"
              (clrSidePanelOpenChange)="clrSidePanelOpen = $event; clrSidePanelOpenChange($event)"
              [clrSidePanelClosable]="clrSidePanelClosable"
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
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<SidePanelArgs>;

export const SidePanel: Story = stories.SidePanel;

export const SidePanelSmall: Story = stories.SidePanelSmall;

export const SidePanelMedium: Story = stories.SidePanelMedium;

export const SidePanelLarge: Story = stories.SidePanelLarge;

export const SidePanelExtraLarge: Story = stories.SidePanelExtraLarge;

export const SidePanelBottomSmall: Story = stories.SidePanelBottomSmall;

export const SidePanelBottomMedium: Story = stories.SidePanelBottomMedium;

export const SidePanelBottomLarge: Story = stories.SidePanelBottomLarge;

export const SidePanelBottomExtraLarge: Story = stories.SidePanelBottomExtraLarge;

export const SidePanelWithBackdrop: Story = stories.SidePanelWithBackdrop;

export const SidePanelAlternateClose: Story = stories.SidePanelAlternateClose;

export const SidePanelPinnable: Story = stories.SidePanelPinnable;

export const SidePanelPinned: Story = stories.SidePanelPinned;

export const SidePanelBottomPinnable: Story = stories.SidePanelBottomPinnable;

export const SidePanelBottomPinned: Story = stories.SidePanelBottomPinned;

export const SidePanelFullScreen: Story = stories.SidePanelFullScreen;

export const SidePanelBottomFullScreen: Story = stories.SidePanelBottomFullScreen;
