/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrHeader, ClrIcon, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * Both args are story-only -- `color` is the class the demo header wears and `HEADER_VARIANTS` is the
 * list the showcase iterates -- and neither is a `ClrHeader` input, so the args type is standalone.
 * The five hidden `ClrHeader` methods go through the `hideControls()` spread and need no declaration.
 *
 * `HEADER_VARIANTS` carried a third `type: 'array'` property alongside its hidden-control pair. A bare
 * `'array'` is not a valid `InputType['type']` (only the scalar names are), and with both the control
 * and the docs row disabled it is unobservable, so it is folded into `hideControls()` rather than
 * rewritten into a well-formed `{ name: 'array', value: … }` that was never there.
 */
type HeaderColorsArgs = {
  color: string;
  HEADER_VARIANTS: string[];
};

const HEADER_VARIANTS = ['header-1', 'header-2', 'header-3'];

const meta: Meta<HeaderColorsArgs> = {
  title: 'Header/Header Colors',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, ClrIcon],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    color: { control: { type: 'select' }, options: HEADER_VARIANTS },
    // methods
    ...hideControls('closeOpenNav', 'initializeNavTriggers', 'openNav', 'resetNavTriggers', 'toggleNav'),
    // story helpers
    ...hideControls('HEADER_VARIANTS'),
  },
  args: {
    color: 'header-1',
    HEADER_VARIANTS,
  },
  render: args => ({
    template: `
      <header [class]="color">
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
      </header>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<HeaderColorsArgs>;

export const HeaderColors: Story = {};

export const Showcase: Story = {
  // render-override: this story repeats the header once per variant, which the single-header meta template cannot express
  render: args => ({
    template: `
      @for (color of HEADER_VARIANTS; track color) {
        <div style="margin-top: 10px">
          <header [class]="color">
            <div class="branding">
              <a href="javascript://" class="nav-link">
                <cds-icon shape="vm-bug"></cds-icon>
                <span class="title">Clarity Design</span>
              </a>
            </div>
          </header>
        </div>
      }
    `,
    props: args,
  }),
};
