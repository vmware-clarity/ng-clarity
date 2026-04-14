/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { arrowIcon, ClarityIcons, ClrIcon, homeIcon, imageIcon, userIcon } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

ClarityIcons.addIcons(userIcon, imageIcon, homeIcon, arrowIcon);

export default {
  title: 'Icon/Icon',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrIcon],
    }),
  ],
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

const SizesTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:lg align:vertical-bottom">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="xs" role="img" aria-label="xs icon"></cds-icon>
        <span cds-text="caption">xs</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="sm" role="img" aria-label="sm icon"></cds-icon>
        <span cds-text="caption">sm</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="md" role="img" aria-label="md icon"></cds-icon>
        <span cds-text="caption">md</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="lg" role="img" aria-label="lg icon"></cds-icon>
        <span cds-text="caption">lg</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="xl" role="img" aria-label="xl icon"></cds-icon>
        <span cds-text="caption">xl</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="xxl" role="img" aria-label="xxl icon"></cds-icon>
        <span cds-text="caption">xxl</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="3xl" role="img" aria-label="3xl icon"></cds-icon>
        <span cds-text="caption">3xl</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="4xl" role="img" aria-label="4xl icon"></cds-icon>
        <span cds-text="caption">4xl</span>
      </div>
    </div>
    <div cds-layout="m-y:lg"></div>
    <p cds-text="body" cds-layout="m-b:sm">Custom pixel sizes:</p>
    <div cds-layout="horizontal gap:lg align:vertical-bottom">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="16" role="img" aria-label="16px icon"></cds-icon>
        <span cds-text="caption">16px</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="36" role="img" aria-label="36px icon"></cds-icon>
        <span cds-text="caption">36px</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="home" size="64" role="img" aria-label="64px icon"></cds-icon>
        <span cds-text="caption">64px</span>
      </div>
    </div>
  `,
});

export const Sizes: StoryObj = { render: SizesTemplate };

// ─── Status ───────────────────────────────────────────────────────────────────

const StatusTemplate: StoryFn = () => ({
  template: `
    <p cds-text="section" cds-layout="m-b:sm">Outline (default)</p>
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" role="img" aria-label="default icon"></cds-icon>
        <span cds-text="caption">default</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="info" size="lg" role="img" aria-label="info icon"></cds-icon>
        <span cds-text="caption">info</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="success" size="lg" role="img" aria-label="success icon"></cds-icon>
        <span cds-text="caption">success</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="warning" size="lg" role="img" aria-label="warning icon"></cds-icon>
        <span cds-text="caption">warning</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="danger" size="lg" role="img" aria-label="danger icon"></cds-icon>
        <span cds-text="caption">danger</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="neutral" size="lg" role="img" aria-label="neutral icon"></cds-icon>
        <span cds-text="caption">neutral</span>
      </div>
    </div>
    <div cds-layout="m-y:md"></div>
    <p cds-text="section" cds-layout="m-b:sm">Solid</p>
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" solid role="img" aria-label="default solid icon"></cds-icon>
        <span cds-text="caption">default</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="info" size="lg" solid role="img" aria-label="info solid icon"></cds-icon>
        <span cds-text="caption">info</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="success" size="lg" solid role="img" aria-label="success solid icon"></cds-icon>
        <span cds-text="caption">success</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="warning" size="lg" solid role="img" aria-label="warning solid icon"></cds-icon>
        <span cds-text="caption">warning</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="danger" size="lg" solid role="img" aria-label="danger solid icon"></cds-icon>
        <span cds-text="caption">danger</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" status="neutral" size="lg" solid role="img" aria-label="neutral solid icon"></cds-icon>
        <span cds-text="caption">neutral</span>
      </div>
    </div>
  `,
});

export const Status: StoryObj = { render: StatusTemplate };

// ─── Badges ───────────────────────────────────────────────────────────────────

const BadgesTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" badge="info" role="img" aria-label="info badge icon"></cds-icon>
        <span cds-text="caption">info</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" badge="success" role="img" aria-label="success badge icon"></cds-icon>
        <span cds-text="caption">success</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" badge="danger" role="img" aria-label="danger badge icon"></cds-icon>
        <span cds-text="caption">danger</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" badge="warning" role="img" aria-label="warning badge icon"></cds-icon>
        <span cds-text="caption">warning</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" badge="neutral" role="img" aria-label="neutral badge icon"></cds-icon>
        <span cds-text="caption">neutral</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon
          shape="user"
          size="lg"
          badge="warning-triangle"
          role="img"
          aria-label="warning triangle badge icon"
        ></cds-icon>
        <span cds-text="caption">warning-triangle</span>
      </div>
      <div cds-layout="vertical gap:xs align:center" cds-theme="dark" cds-layout="p:sm">
        <cds-icon
          shape="user"
          size="lg"
          badge="inherit-triangle"
          inverse
          role="img"
          aria-label="inherit triangle badge icon"
        ></cds-icon>
        <span cds-text="caption">inherit-triangle</span>
      </div>
    </div>
  `,
});

export const Badges: StoryObj = { render: BadgesTemplate };

// ─── Solid ────────────────────────────────────────────────────────────────────

const SolidTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:xl align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="xl" role="img" aria-label="outline icon"></cds-icon>
        <span cds-text="caption">outline (default)</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="xl" solid role="img" aria-label="solid icon"></cds-icon>
        <span cds-text="caption">solid</span>
      </div>
    </div>
  `,
});

export const Solid: StoryObj = { render: SolidTemplate };

// ─── Direction ────────────────────────────────────────────────────────────────

const DirectionTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="arrow" size="lg" role="img" aria-label="up direction (default)"></cds-icon>
        <span cds-text="caption">up (default)</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="arrow" size="lg" direction="right" role="img" aria-label="right direction"></cds-icon>
        <span cds-text="caption">right</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="arrow" size="lg" direction="down" role="img" aria-label="down direction"></cds-icon>
        <span cds-text="caption">down</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="arrow" size="lg" direction="left" role="img" aria-label="left direction"></cds-icon>
        <span cds-text="caption">left</span>
      </div>
    </div>
  `,
});

export const Direction: StoryObj = { render: DirectionTemplate };

// ─── Flip ─────────────────────────────────────────────────────────────────────

const FlipTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon size="lg" shape="image" role="img" aria-label="no flip (default)"></cds-icon>
        <span cds-text="caption">default</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon size="lg" flip="vertical" shape="image" role="img" aria-label="vertical flip"></cds-icon>
        <span cds-text="caption">vertical</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon size="lg" flip="horizontal" shape="image" role="img" aria-label="horizontal flip"></cds-icon>
        <span cds-text="caption">horizontal</span>
      </div>
    </div>
  `,
});

export const Flip: StoryObj = { render: FlipTemplate };

// ─── Inverse ──────────────────────────────────────────────────────────────────

const InverseTemplate: StoryFn = () => ({
  template: `
    <div cds-layout="horizontal gap:md align:vertical-center" cds-theme="dark" cds-layout="p:md">
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" inverse role="img" aria-label="inverse icon"></cds-icon>
        <span cds-text="caption">inverse</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" status="info" inverse role="img" aria-label="info inverse"></cds-icon>
        <span cds-text="caption">info</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" status="success" inverse role="img" aria-label="success inverse"></cds-icon>
        <span cds-text="caption">success</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" status="warning" inverse role="img" aria-label="warning inverse"></cds-icon>
        <span cds-text="caption">warning</span>
      </div>
      <div cds-layout="vertical gap:xs align:center">
        <cds-icon shape="user" size="lg" status="danger" inverse role="img" aria-label="danger inverse"></cds-icon>
        <span cds-text="caption">danger</span>
      </div>
    </div>
  `,
});

export const Inverse: StoryObj = { render: InverseTemplate };

// ─── Custom Styles ────────────────────────────────────────────────────────────

const CustomStylesTemplate: StoryFn = () => ({
  template: `
    <style>
      .icon-custom-a {
        --color: limegreen;
        --badge-color: yellow;
      }
      .icon-custom-b {
        --color: fuchsia;
        --badge-color: fuchsia;
      }
      .icon-custom-c {
        --badge-color: fuchsia;
      }
      .icon-swatch {
        background: #1b1b1b;
      }
      .icon-swatch--light {
        background: #dcdcdc;
      }
    </style>
    <div cds-layout="horizontal gap:lg align:vertical-center">
      <div cds-layout="p:md" class="icon-swatch">
        <cds-icon
          shape="user"
          size="xl"
          badge="neutral"
          class="icon-custom-a"
          role="img"
          aria-label="green icon with yellow badge"
        ></cds-icon>
      </div>
      <div cds-layout="p:md" class="icon-swatch">
        <cds-icon
          shape="user"
          size="xl"
          badge="warning-triangle"
          class="icon-custom-b"
          role="img"
          aria-label="pink icon with pink badge"
        ></cds-icon>
      </div>
      <div cds-layout="p:md" class="icon-swatch--light">
        <cds-icon
          shape="user"
          size="xl"
          badge="neutral"
          class="icon-custom-c"
          role="img"
          aria-label="default icon with custom pink badge"
        ></cds-icon>
      </div>
    </div>
    <p cds-text="secondary" cds-layout="m-t:sm">
      Use
      <code cds-text="code">--color</code>
      to customize the icon color and
      <code cds-text="code">--badge-color</code>
      to customize the badge color.
    </p>
  `,
});

export const CustomStyles: StoryObj = { render: CustomStylesTemplate };
