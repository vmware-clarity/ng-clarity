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
      <div class="item" cds-layout="gap:none">
        <span class="placeholder">none</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:xxs">
        <span class="placeholder">xxs</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:xs">
        <span class="placeholder">xs</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:sm">
        <span class="placeholder">sm</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:md">
        <span class="placeholder">md</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:lg">
        <span class="placeholder">lg</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:xl">
        <span class="placeholder">xl</span>
        <span class="placeholder"></span>
      </div>
      <div class="item" cds-layout="gap:xxl">
        <span class="placeholder">xxl</span>
        <span class="placeholder"></span>
      </div>
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
        display: flex;
        background-color: #a9b7c5;
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
        margin-left: 1px;
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

export const Gaps: StoryObj = {};
