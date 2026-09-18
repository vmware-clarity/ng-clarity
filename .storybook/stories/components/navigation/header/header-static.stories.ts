/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdownModule, ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

/**
 * The story is a gallery of static header markup and binds no args, so the args type is `ClrHeader`
 * itself -- the component the docs table is generated from, and the class the five hidden `argTypes`
 * entries name. `ClrHeader` declares its one input under its own name (`@Input() role`), so no alias
 * translation is needed.
 */
type HeaderStaticArgs = ClrHeader;

const meta: Meta<HeaderStaticArgs> = {
  title: 'Header/Headers Static',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, ClrDropdownModule],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    // methods
    ...hideControls('closeOpenNav', 'initializeNavTriggers', 'openNav', 'resetNavTriggers', 'toggleNav'),
  },
  args: {},
  render: args => ({
    template: `
      <header>
        <div class="branding">
          <a href="#" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <div class="header-nav">
          <a href="#" class="active nav-link" aria-current="page"><span class="nav-text">Dashboard</span></a>
          <a href="#" class="nav-link"><span class="nav-text">Interactive Analytics</span></a>
        </div>
        <div class="header-actions">
          <a href="#" class="nav-link nav-icon" aria-label="settings">
            <cds-icon shape="cog"></cds-icon>
          </a>
        </div>
      </header>
      <br />
      <header>
        <div class="branding">
          <a href="#" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <form class="search">
          <label for="search_input">
            <input id="search_input" type="text" placeholder="Search for keywords..." />
          </label>
        </form>
        <div class="header-actions">
          <a href="javascript://" class="nav-link nav-icon-text">
            <cds-icon shape="user" inverse></cds-icon>
            <span class="nav-text">username</span>
          </a>
          <a href="#" class="nav-link nav-icon" aria-label="settings">
            <cds-icon shape="cog"></cds-icon>
          </a>
          <a href="javascript://" class="nav-link nav-text">Log Out</a>
        </div>
      </header>
      <br />
      <header>
        <div class="branding">
          <a href="#" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <div class="header-actions">
          <clr-dropdown>
            <button class="nav-icon" clrDropdownTrigger aria-label="toggle settings menu">
              <cds-icon shape="cog"></cds-icon>
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
              <a href="#" clrDropdownItem>About</a>
              <a href="#" clrDropdownItem>Preferences</a>
              <a href="#" clrDropdownItem>Log out</a>
            </clr-dropdown-menu>
          </clr-dropdown>
        </div>
      </header>
      <br />
      <header>
        <div class="branding">
          <a href="#" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <div class="header-actions">
          <a href="#" class="nav-link nav-text">Log Out</a>
        </div>
      </header>
      <br />
      <header>
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <div class="header-actions">
          <a href="javascript://" class="nav-link nav-icon-text">
            <cds-icon shape="user"></cds-icon>
            <span class="nav-text">username</span>
          </a>
        </div>
      </header>
      <br />
      <header>
        <div class="branding">
          <a href="#" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Clarity Design</span>
          </a>
        </div>
        <div class="header-actions">
          <clr-dropdown>
            <button class="nav-text" clrDropdownTrigger aria-label="open user profile">
              john.doe&#64;vmware.com
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu *clrIfOpen="true" clrPosition="bottom-right">
              <a href="#" clrDropdownItem>Preferences</a>
              <a href="#" clrDropdownItem>Log out</a>
            </clr-dropdown-menu>
          </clr-dropdown>
        </div>
      </header>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<HeaderStaticArgs>;

export const HeaderStatic: Story = {};
