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

import { ClrVerticalNavGroup, ClrVerticalNavModule } from '../../../projects/angular/src';
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
      <clr-vertical-nav [clrVerticalNavCollapsible]="true">
        <clr-vertical-nav-group
          [clrVerticalNavGroupExpanded]="clrVerticalNavGroupExpanded"
          (clrVerticalNavGroupExpandedChange)="clrVerticalNavGroupExpandedChange($event)"
        >
          <cds-icon *ngIf="includeIcons" shape="bars" clrVerticalNavIcon></cds-icon>
          Menu
          <clr-vertical-nav-group-children>
            <a *ngFor="let navLink of navLinks; let index = index"
              clrVerticalNavLink
              [ngClass]="{ 'active': index == activeIndex }"
              href="javascript:void(0)"
              (click)="activeIndex = index"
            >
              <cds-icon *ngIf="includeIcons" [attr.shape]="navLink.iconShapeTuple[0]" clrVerticalNavIcon></cds-icon>
              {{navLink.text}}
            </a>
          </clr-vertical-nav-group-children>
        </clr-vertical-nav-group>
      </clr-vertical-nav>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Vertical Nav/Vertical Nav Group',
  component: ClrVerticalNavGroup,
  argTypes: {
    // inputs
    clrVerticalNavGroupExpanded: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    clrVerticalNavGroupExpandedChange: { control: { disable: true } },
    // methods
    collapseGroup: { control: { disable: true }, table: { disable: true } },
    expandAnimationDone: { control: { disable: true }, table: { disable: true } },
    expandGroup: { control: { disable: true }, table: { disable: true } },
    toggleExpand: { control: { disable: true }, table: { disable: true } },
    // story helpers
    navLinks: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrVerticalNavGroupExpandedChange: action('clrVerticalNavGroupExpandedChange'),
    // story helpers
    navLinks,
    activeIndex: 0,
    includeIcons: true,
  },
};

const variants: Parameters[] = [
  {
    clrVerticalNavGroupExpanded: false,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: true,
    includeIcons: true,
  },
  {
    clrVerticalNavGroupExpanded: false,
    includeIcons: false,
  },
  {
    clrVerticalNavGroupExpanded: true,
    includeIcons: false,
  },
];

setupStorybook(ClrVerticalNavModule, defaultStory, defaultParameters, variants);
