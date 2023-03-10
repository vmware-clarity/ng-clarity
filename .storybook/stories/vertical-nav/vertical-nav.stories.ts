/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bellIcon, calendarIcon, folderIcon, homeIcon, searchIcon, userIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrVerticalNav, ClrVerticalNavModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const navLinks: { iconShapeTuple: IconShapeTuple; text: string }[] = [
  { iconShapeTuple: bellIcon, text: 'Notifications' },
  { iconShapeTuple: homeIcon, text: 'Dashboard' },
  { iconShapeTuple: searchIcon, text: 'Search' },
  { iconShapeTuple: calendarIcon, text: 'Calendar' },
  { iconShapeTuple: folderIcon, text: 'Files' },
  { iconShapeTuple: userIcon, text: 'Profile' },
];

const defaultStory: Story = args => ({
  template: `
    <div class="main-container">
      <clr-vertical-nav
        [clrVerticalNavCollapsible]="clrVerticalNavCollapsible"
        [clrVerticalNavCollapsed]="clrVerticalNavCollapsed"
        (clrVerticalNavCollapsedChange)="clrVerticalNavCollapsedChange($event)"
      >
        <a
          *ngFor="let navLink of navLinks; let index = index"
          clrVerticalNavLink
          [ngClass]="{ 'active': index == activeIndex }"
          href="javascript:void(0)"
          (click)="activeIndex = index"
        >
          <cds-icon *ngIf="includeIcons" [attr.shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
          {{navLink.text}}
        </a>
      </clr-vertical-nav>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Vertical Nav/Vertical Nav',
  component: ClrVerticalNav,
  argTypes: {
    // inputs
    clrVerticalNavCollapsible: { defaultValue: false, control: { type: 'boolean' } },
    clrVerticalNavCollapsed: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrVerticalNavCollapsedChange: { control: { disable: true } },
    // methods
    toggleByButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrVerticalNavCollapsedChange: action('clrVerticalNavCollapsedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
};

const variants: Parameters[] = [
  {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavCollapsible: false,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: true,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: false,
    includeIcons: false,
  },
  {
    clrVerticalNavCollapsible: true,
    clrVerticalNavCollapsed: true,
    includeIcons: true,
  },
];

setupStorybook(ClrVerticalNavModule, defaultStory, defaultParameters, variants);
