/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { DanielSmithDemo } from './pages/daniel-smith';
import { OilsDemo } from './pages/oils';
import { PaintsDemo } from './pages/paints';
import { ToolsDemo } from './pages/tools';
import { WatercolorDemo } from './pages/watercolor';
import { WinsorNewtonDemo } from './pages/winsor-newton';

const ROUTES: Routes = [
  {
    path: '',
    component: BreadcrumbsDemo,
    data: {
      breadcrumb: 'Home',
    },
    children: [
      { path: '', redirectTo: 'paints', pathMatch: 'full' },
      {
        path: 'paints',
        component: PaintsDemo,
        data: {
          breadcrumb: 'Paints',
        },
        children: [
          {
            path: 'watercolor',
            component: WatercolorDemo,
            data: {
              breadcrumb: 'Watercolor',
            },
            children: [
              {
                path: 'daniel-smith',
                component: DanielSmithDemo,
                data: {
                  breadcrumb: 'Daniel Smith',
                },
              },
              {
                path: 'winsor-newton',
                component: WinsorNewtonDemo,
                data: {
                  breadcrumb: 'Winsor & Newton',
                },
              },
            ],
          },
          {
            path: 'oils',
            component: OilsDemo,
            data: {
              breadcrumb: 'Oils',
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
