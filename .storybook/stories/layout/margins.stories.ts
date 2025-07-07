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
      <div class="item"><span cds-layout="m:none" class="placeholder">m:none</span></div>
      <div class="item"><span cds-layout="m:xxs" class="placeholder">m:xxs</span></div>
      <div class="item"><span cds-layout="m:xs" class="placeholder">m:xs</span></div>
      <div class="item"><span cds-layout="m:sm" class="placeholder">m:sm</span></div>
      <div class="item"><span cds-layout="m:md" class="placeholder">m:md</span></div>
      <div class="item"><span cds-layout="m:lg" class="placeholder">m:lg</span></div>
      <div class="item"><span cds-layout="m:xl" class="placeholder">m:xl</span></div>
      <div class="item"><span cds-layout="m:xxl" class="placeholder">m:xxl</span></div>
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
        background-color: #f8cb9b;
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

export const Margins: StoryObj = {};
