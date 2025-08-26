/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { provideRouter } from '@angular/router';
import { applicationConfig, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';
import { action } from 'storybook/actions';

import { ClrBreadcrumbs, ClrBreadcrumbsModule } from '../../../projects/angular/src/layout/breadcrumbs';

const menuItems = [
  { label: 'Home', routerLink: '/home' },
  { label: 'Parent Page', routerLink: '/parent' },
  { label: 'Child Page', routerLink: '/child' },
];

const menuItemsCollapsed = [
  { label: 'Home', routerLink: '/home' },
  { label: 'Parent Page', routerLink: '/parent' },
  { label: 'Child Page', routerLink: '/child' },
  { label: 'Grandchild Page', routerLink: '/grandchild' },
  { label: 'Current Page', routerLink: '/current' },
];

const menuItemsHref = [
  { label: 'Home', href: '#' },
  { label: 'Parent Page', href: '#' },
  { label: 'Child Page', href: '#' },
];

class MockComponent {}

export default {
  title: 'Breadcrumbs/Breadcrumbs',
  component: ClrBreadcrumbs,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrBreadcrumbsModule],
    }),
    applicationConfig({
      providers: [
        provideRouter([
          { path: 'home', component: MockComponent },
          { path: 'parent', component: MockComponent },
          { path: 'child', component: MockComponent },
          { path: 'grandchild', component: MockComponent },
          { path: 'current', component: MockComponent },
          {
            path: '**',
            redirectTo: 'home',
            pathMatch: 'full',
          },
        ]),
      ],
    }),
  ],
  argTypes: {
    //outputs
    clrBreadcrumbItemClick: { control: { disable: true } },
    //methods
    expand: { control: { disable: true }, table: { disable: true } },
    handleItemClick: { control: { disable: true }, table: { disable: true } },
    // story helpers
    items: { control: 'object' },
  },
  args: {
    // story helpers
    items: menuItems,
    clrBreadcrumbItemClick: action('clrBreadcrumItemClick'),
  },
};

export const BreadcrumbWithRouter: StoryObj = {};

export const BreadcrumbWithHref: StoryObj = {
  args: {
    items: menuItemsHref,
  },
};

export const Collapsed: StoryObj = {
  args: {
    items: menuItemsCollapsed,
  },
};
