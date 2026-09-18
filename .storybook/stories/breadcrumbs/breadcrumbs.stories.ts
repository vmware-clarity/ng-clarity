/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { provideRouter } from '@angular/router';
import { BreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule } from '@clr/angular/layout/breadcrumbs';
import { applicationConfig, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { action } from 'storybook/actions';

/**
 * The args bind to `ClrBreadcrumbs`, whose input name equals its alias. Only the output is
 * re-typed: the arg is an `action()` handler, not the component's `EventEmitter`.
 */
type BreadcrumbsArgs = Omit<ClrBreadcrumbs, 'clrBreadcrumbItemClick'> & {
  clrBreadcrumbItemClick: (item: BreadcrumbItem) => void;
};

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

const meta: Meta<BreadcrumbsArgs> = {
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
    ...hideControls('expand', 'handleItemClick'),
    // story helpers
    items: { control: { type: 'object' } },
  },
  args: {
    // story helpers
    items: menuItems,
    clrBreadcrumbItemClick: action('clrBreadcrumItemClick'),
  },
};

export default meta;

type Story = StoryObj<BreadcrumbsArgs>;

export const BreadcrumbWithRouter: Story = {};

export const BreadcrumbWithHref: Story = {
  args: {
    items: menuItemsHref,
  },
};

export const Collapsed: Story = {
  args: {
    items: menuItemsCollapsed,
  },
};
