/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { provideRouter, Routes } from '@angular/router';
import { applicationConfig, moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { ClrBreadcrumbs, ClrBreadcrumbsModule } from '../../../projects/angular/src/layout/breadcrumbs';

const menuItems = [
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
    // story helpers
    menuItems: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    menuItems,
  },
};

// const BreadcrumbCustomTemplate: StoryFn = args => ({
//   template: `
//     <clr-breadcrumbs>
//       <clr-breadcrumb-item>
//         <a routerLink="./home" routerLinkActive="active">Home</a>
//       </clr-breadcrumb-item>
//       <clr-breadcrumb-item>
//         <a routerLink="./parent" routerLinkActive="active">Parent Page</a>
//       </clr-breadcrumb-item>
//       <clr-breadcrumb-item>
//         <span aria-current="page">Current Page</span>
//       </clr-breadcrumb-item>
//     </clr-breadcrumbs>
//   `,
//   props: args,
// });

const BreadcrumbRouterTemplate: StoryFn = args => ({
  template: `
    <clr-breadcrumbs [items]="menuItems"></clr-breadcrumbs>
  `,
  props: args,
});

export const BreadcrumbWithRouting: StoryObj = {
  render: BreadcrumbRouterTemplate,
};

// export const BreadcrumCustomTemplate: StoryObj = {
//   render: BreadcrumbCustomTemplate,
// };
