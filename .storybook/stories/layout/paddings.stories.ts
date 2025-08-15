/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

@Component({
  selector: 'layout-test-component',
  template: `
    <div class="demo">
      <div class="item" cds-layout="p:none"><span class="placeholder">p:none</span></div>
      <div class="item" cds-layout="p:xxs"><span class="placeholder" class="placeholder">p:xxs</span></div>
      <div class="item" cds-layout="p:xs"><span class="placeholder">p:xs</span></div>
      <div class="item" cds-layout="p:sm"><span class="placeholder">p:sm</span></div>
      <div class="item" cds-layout="p:md"><span class="placeholder">p:md</span></div>
      <div class="item" cds-layout="p:lg"><span class="placeholder">p:lg</span></div>
      <div class="item" cds-layout="p:xl"><span class="placeholder">p:xl</span></div>
      <div class="item" cds-layout="p:xxl"><span class="placeholder">p:xxl</span></div>
    </div>
  `,
  styles: [
    `
      .demo {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 8px;
      }
      .item {
        background-color: #bbdb9e;
      }
      .placeholder {
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--cds-global-color-cool-gray-700);
        color: var(--cds-global-color-gray-0);
        font-size: var(--cds-global-typography-body-font-size);
        min-width: 50px;
        min-height: 50px;
      }
    `,
  ],
})
export class LayoutTestComponent {}

export default {
  title: 'Layout/Spacing',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  component: LayoutTestComponent,
  argTypes: {},
  args: {},
};

export const Paddings: StoryObj = {};
