/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryFn } from '@storybook/angular';

import * as stories from './side-panel.internal';

const SidePanelTemplate: StoryFn = args => ({
  template: `
    <div class="main-container">
      <div class="content-container">
        <div class="content-area">
          <div clrModalHost cds-layout="p:md" style="border: 1px dashed hotpink; width: 800px; height: 400px">
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

export default {
  title: 'Modal/Side Panel (inline)',
  decorators: stories.config.decorators,
  component: stories.config.component,
  argTypes: stories.config.argTypes,
  args: stories.config.args,
};

export const SidePanel = stories.render(stories.SidePanel, SidePanelTemplate);
export const SidePanelSmall = stories.render(stories.SidePanelSmall, SidePanelTemplate);
export const SidePanelMedium = stories.render(stories.SidePanelMedium, SidePanelTemplate);
export const SidePanelLarge = stories.render(stories.SidePanelLarge, SidePanelTemplate);
export const SidePanelExtraLarge = stories.render(stories.SidePanelExtraLarge, SidePanelTemplate);
export const SidePanelBottomSmall = stories.render(stories.SidePanelBottomSmall, SidePanelTemplate);
export const SidePanelBottomMedium = stories.render(stories.SidePanelBottomMedium, SidePanelTemplate);
export const SidePanelBottomLarge = stories.render(stories.SidePanelBottomLarge, SidePanelTemplate);
export const SidePanelBottomExtraLarge = stories.render(stories.SidePanelBottomExtraLarge, SidePanelTemplate);
export const SidePanelWithBackdrop = stories.render(stories.SidePanelWithBackdrop, SidePanelTemplate);
export const SidePanelAlternateClose = stories.render(stories.SidePanelAlternateClose, SidePanelTemplate);
export const SidePanelPinnable = stories.render(stories.SidePanelPinnable, SidePanelTemplate);
export const SidePanelPinned = stories.render(stories.SidePanelPinned, SidePanelTemplate);
export const SidePanelBottomPinnable = stories.render(stories.SidePanelBottomPinnable, SidePanelTemplate);
export const SidePanelBottomPinned = stories.render(stories.SidePanelBottomPinned, SidePanelTemplate);
export const SidePanelFullScreen = stories.render(stories.SidePanelFullScreen, SidePanelTemplate);
export const SidePanelBottomFullScreen = stories.render(stories.SidePanelBottomFullScreen, SidePanelTemplate);
