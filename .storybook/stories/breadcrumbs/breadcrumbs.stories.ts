/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { provideRouter, Routes } from '@angular/router';
import { action } from '@storybook/addon-actions';
import { applicationConfig, moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { ClrBreadcrumbs, ClrBreadcrumbsModule } from '../../../projects/angular/src/layout/breadcrumbs';

const menuItems = [
  { label: 'Home', url: '/home' },
  { label: 'Parent Page', url: '/parent' },
  { label: 'Current Page', url: '/child' },
];

const menuItemsCollapsed = [
  { label: 'Home', url: '/home' },
  { label: 'Parent Page', url: '/parent' },
  { label: 'Current Page', url: '/child' },
  { label: 'Grandchild', url: '/grandchild' },
  { label: 'Last', url: '/last' },
];

const routes: Routes = [
  {
    path: 'home',
    redirectTo: '/home',
  },
  {
    path: 'parent',
    redirectTo: '/parent',
  },
  {
    path: 'child',
    redirectTo: '/child',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

export default {
  title: 'Breadcrumbs/Breadcrumbs',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrBreadcrumbsModule],
    }),
    applicationConfig({
      providers: [provideRouter(routes)],
    }),
  ],
  component: ClrBreadcrumbs,
  argTypes: {
    //outputs
    clrBreadcrumbItemClick: { control: { disable: true } },
    //methods
    expand: { control: { disable: true }, table: { disable: true } },
    handleItemClick: { control: { disable: true }, table: { disable: true } },
    // story helpers
    items: { control: { disable: true } },
    menuItemsCollapsed: { control: { disable: true }, table: { disable: true } },
    menuItems: { control: 'object' },
  },
  args: {
    // story helpers
    menuItems,
    menuItemsCollapsed,
    clrBreadcrumbItemClick: action('clrBreadcrumItemClick'),
  },
};

const BreadcrumbInitialTemplate: StoryFn = args => ({
  template: `
    <clr-breadcrumbs [items]="menuItems"></clr-breadcrumbs>
  `,
  props: args,
});

const BreadcrumbCollapsedTemplate: StoryFn = args => ({
  template: `
    <clr-breadcrumbs [items]="menuItemsCollapsed"></clr-breadcrumbs>
  `,
  props: args,
});

export const Initial: StoryObj = {
  render: BreadcrumbInitialTemplate,
};

export const Collapsed: StoryObj = {
  render: BreadcrumbCollapsedTemplate,
};
