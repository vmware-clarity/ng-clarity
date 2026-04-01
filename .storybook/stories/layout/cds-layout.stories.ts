/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const PLACEHOLDER_STYLES = `
  <style>
    .cds-placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--cds-global-color-cool-gray-700);
      color: var(--cds-global-color-gray-0);
      font-size: var(--cds-alias-typography-body-font-size);
      min-width: 50px;
      min-height: 50px;
    }
    .cds-demo {
      background: var(--cds-alias-object-border-color);
    }
    .cds-demo--wide { width: 400px; }
    .cds-demo--tall { height: 200px; }
    .cds-demo--wrap { max-width: 250px; }
  </style>
`;

export default {
  title: 'Layout/cds-layout',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
};

// ─── Horizontal Layout ────────────────────────────────────────────────────────

const HorizontalLayoutTemplate: StoryFn = () => ({
  template: `
    ${PLACEHOLDER_STYLES}
    <div cds-layout="vertical gap:lg">
      <div>
        <p cds-text="section" cds-layout="m-b:xs">Horizontal (wrap by default)</p>
        <div class="cds-demo cds-demo--wrap">
          <div cds-layout="horizontal gap:md">
            <span class="cds-placeholder">1</span>
            <span class="cds-placeholder">2</span>
            <span class="cds-placeholder">3</span>
            <span class="cds-placeholder">4</span>
            <span class="cds-placeholder">5</span>
          </div>
        </div>
      </div>

      <div>
        <p cds-text="section" cds-layout="m-b:xs">No wrap</p>
        <div class="cds-demo cds-demo--wrap" style="overflow: auto">
          <div cds-layout="horizontal gap:md wrap:none">
            <span class="cds-placeholder">1</span>
            <span class="cds-placeholder">2</span>
            <span class="cds-placeholder">3</span>
            <span class="cds-placeholder">4</span>
            <span class="cds-placeholder">5</span>
          </div>
        </div>
      </div>
    </div>
  `,
});

export const HorizontalLayout: StoryObj = { render: HorizontalLayoutTemplate };

// ─── Vertical Layout ──────────────────────────────────────────────────────────

const VerticalLayoutTemplate: StoryFn = () => ({
  template: `
    ${PLACEHOLDER_STYLES}
    <div cds-layout="horizontal gap:xl align:top">
      <div>
        <p cds-text="section" cds-layout="m-b:xs">Vertical</p>
        <div class="cds-demo">
          <div cds-layout="vertical gap:md">
            <span class="cds-placeholder">1</span>
            <span class="cds-placeholder">2</span>
            <span class="cds-placeholder">3</span>
          </div>
        </div>
      </div>

      <div>
        <p cds-text="section" cds-layout="m-b:xs">align:center</p>
        <div class="cds-demo cds-demo--tall cds-demo--wide">
          <div cds-layout="vertical gap:md align:center" style="height: 100%; width: 100%">
            <span class="cds-placeholder">1</span>
            <span class="cds-placeholder">2</span>
            <span class="cds-placeholder">3</span>
          </div>
        </div>
      </div>
    </div>
  `,
});

export const VerticalLayout: StoryObj = { render: VerticalLayoutTemplate };

// ─── Alignment ────────────────────────────────────────────────────────────────

const AlignmentTemplate: StoryFn = () => ({
  template: `
    ${PLACEHOLDER_STYLES}
    <div cds-layout="vertical gap:lg">
      <div cds-layout="horizontal gap:lg align:top">
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:top</p>
          <div class="cds-demo cds-demo--wide cds-demo--tall">
            <div cds-layout="horizontal gap:md align:top" style="width: 100%; height: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:bottom</p>
          <div class="cds-demo cds-demo--wide cds-demo--tall">
            <div cds-layout="horizontal gap:md align:bottom" style="width: 100%; height: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
      </div>

      <div cds-layout="horizontal gap:lg align:top">
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:left</p>
          <div class="cds-demo cds-demo--wide">
            <div cds-layout="horizontal gap:md align:left" style="width: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:right</p>
          <div class="cds-demo cds-demo--wide">
            <div cds-layout="horizontal gap:md align:right" style="width: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
      </div>

      <div cds-layout="horizontal gap:lg align:top">
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:vertical-center</p>
          <div class="cds-demo cds-demo--wide cds-demo--tall">
            <div cds-layout="horizontal gap:md align:vertical-center" style="width: 100%; height: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:horizontal-center</p>
          <div class="cds-demo cds-demo--wide">
            <div cds-layout="horizontal gap:md align:horizontal-center" style="width: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
      </div>

      <div cds-layout="horizontal gap:lg align:top">
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:center</p>
          <div class="cds-demo cds-demo--wide cds-demo--tall">
            <div cds-layout="horizontal gap:md align:center" style="width: 100%; height: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
        <div>
          <p cds-text="section" cds-layout="m-b:xs">align:fill</p>
          <div class="cds-demo cds-demo--wide">
            <div cds-layout="horizontal gap:sm align:fill" style="width: 100%">
              <span class="cds-placeholder">1</span>
              <span class="cds-placeholder">2</span>
              <span class="cds-placeholder">3</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p cds-text="section" cds-layout="m-b:xs">align:vertical-stretch</p>
        <div class="cds-demo cds-demo--wide cds-demo--tall">
          <div cds-layout="horizontal gap:md align:vertical-stretch" style="width: 100%; height: 100%">
            <span class="cds-placeholder">1</span>
            <span class="cds-placeholder">2</span>
            <span class="cds-placeholder">3</span>
          </div>
        </div>
      </div>
    </div>
  `,
});

export const Alignment: StoryObj = { render: AlignmentTemplate };

// ─── Gap Sizes ───────────────────────────────────────────────────────────────

const GapSizesTemplate: StoryFn = () => ({
  template: `
    ${PLACEHOLDER_STYLES}
    <div cds-layout="vertical gap:xs">
      <div class="cds-demo">
        <div cds-layout="horizontal gap:xxs">
          <span class="cds-placeholder" style="min-width: 80px">gap:xxs</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:xs">
          <span class="cds-placeholder" style="min-width: 80px">gap:xs</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:sm">
          <span class="cds-placeholder" style="min-width: 80px">gap:sm</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:md">
          <span class="cds-placeholder" style="min-width: 80px">gap:md</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:lg">
          <span class="cds-placeholder" style="min-width: 80px">gap:lg</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:xl">
          <span class="cds-placeholder" style="min-width: 80px">gap:xl</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
      <div class="cds-demo">
        <div cds-layout="horizontal gap:xxl">
          <span class="cds-placeholder" style="min-width: 80px">gap:xxl</span>
          <span class="cds-placeholder"></span>
          <span class="cds-placeholder"></span>
        </div>
      </div>
    </div>
  `,
});

export const GapSizes: StoryObj = { render: GapSizesTemplate };

// ─── Container Widths ─────────────────────────────────────────────────────────

const ContainerWidthsTemplate: StoryFn = () => ({
  template: `
    <style>
      .container-demo {
        padding: var(--cds-global-space-5);
        border-radius: var(--cds-alias-object-border-radius-100);
        margin-bottom: var(--cds-global-space-3);
      }
      .container-demo--sm {
        background: #c8e6c9;
      }
      .container-demo--md {
        background: #bbdefb;
      }
      .container-demo--lg {
        background: #ffe0b2;
      }
      .container-demo--xl {
        background: #e1bee7;
      }
      .container-demo--centered {
        background: #f8bbd0;
      }
    </style>
    <div cds-layout="vertical gap:sm" style="width: 100%">
      <div>
        <p cds-text="caption" cds-layout="m-b:xxs">container:sm (576px max-width)</p>
        <div cds-layout="container:sm" class="container-demo container-demo--sm">
          <span cds-text="body">sm container</span>
        </div>
      </div>
      <div>
        <p cds-text="caption" cds-layout="m-b:xxs">container:md (768px max-width)</p>
        <div cds-layout="container:md" class="container-demo container-demo--md">
          <span cds-text="body">md container</span>
        </div>
      </div>
      <div>
        <p cds-text="caption" cds-layout="m-b:xxs">container:lg (992px max-width)</p>
        <div cds-layout="container:lg" class="container-demo container-demo--lg">
          <span cds-text="body">lg container</span>
        </div>
      </div>
      <div>
        <p cds-text="caption" cds-layout="m-b:xxs">container:xl (1200px max-width)</p>
        <div cds-layout="container:xl" class="container-demo container-demo--xl">
          <span cds-text="body">xl container</span>
        </div>
      </div>
      <div>
        <p cds-text="caption" cds-layout="m-b:xxs">container:md container:center (centered)</p>
        <div cds-layout="container:md container:center" class="container-demo container-demo--centered">
          <span cds-text="body">centered md container</span>
        </div>
      </div>
    </div>
  `,
});

export const ContainerWidths: StoryObj = { render: ContainerWidthsTemplate };
