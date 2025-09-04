/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdownModule, ClrHeader, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../../.storybook/helpers/common';

export default {
  title: 'Header/Headers Static',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrMainContainerModule, ClrNavigationModule, ClrDropdownModule],
    }),
  ],
  component: ClrHeader,
  argTypes: {
    // methods
    closeOpenNav: { control: { disable: true }, table: { disable: true } },
    initializeNavTriggers: { control: { disable: true }, table: { disable: true } },
    openNav: { control: { disable: true }, table: { disable: true } },
    resetNavTriggers: { control: { disable: true }, table: { disable: true } },
    toggleNav: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const HeaderStaticTemplate: StoryFn = args => ({
  template: `
    <header class="header-6">
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
    <header class="header-6">
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
    <header class="header-6">
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
    <header class="header-6">
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
    <header class="header-6">
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
    <header class="header-6">
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
});

export const HeaderStatic: StoryObj = {
  render: HeaderStaticTemplate,
};
