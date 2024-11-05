/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { AngularDemo } from './pages/angular';
import { Angular17Demo } from './pages/angular17';
import { Angular18Demo } from './pages/angular18';
import { FrameworkDemo } from './pages/framework';
import { ReactDemo } from './pages/react';
import { ToolsDemo } from './pages/tools';

const ROUTES: Routes = [
  {
    path: '',
    component: BreadcrumbsDemo,
    data: {
      breadcrumb: 'Home',
    },
    children: [
      { path: '', redirectTo: 'tools', pathMatch: 'full' },
      {
        path: 'framework',
        component: FrameworkDemo,
        data: {
          breadcrumb: 'Framework',
        },
        children: [
          {
            path: 'angular',
            component: AngularDemo,
            data: {
              breadcrumb: 'Angular',
            },
            children: [
              // { path: '', redirectTo: 'angular17', pathMatch: 'full' },
              {
                path: 'angular17',
                component: Angular17Demo,
                data: {
                  breadcrumb: 'Angular 17',
                },
              },
              {
                path: 'angular18',
                component: Angular18Demo,
                data: {
                  breadcrumb: 'Angular 18',
                },
              },
            ],
          },
          {
            path: 'react',
            component: ReactDemo,
            data: {
              breadcrumb: 'React',
            },
          },
        ],
      },
      {
        path: 'tools',
        component: ToolsDemo,
        data: {
          breadcrumb: 'Tools',
        },
      },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
