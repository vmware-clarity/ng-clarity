/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BreadcrumbsHrefDemo } from './breadcrumbs-href.demo';
import { BreadcrumbsRoutingDemo } from './breadcrumbs-routing.demo';
import { BreadcrumbsDemo } from './breadcrumbs.demo';
import { WNCotmanDemo } from './pages/coltman';
import { DanielSmithDemo } from './pages/daniel-smith';
import { OilsDemo } from './pages/oils';
import { PaintsDemo } from './pages/paints';
import { PaintsListDemo } from './pages/paintsList';
import { WNProfessionalDemo } from './pages/professional';
import { ToolsDemo } from './pages/tools';
import { WatercolorDemo } from './pages/watercolor';
import { WatercolorListDemo } from './pages/watercolorList';
import { WinsorNewtonDemo } from './pages/winsor-newton';

const ROUTES: Routes = [
  {
    path: '',
    component: BreadcrumbsDemo,
    children: [
      {
        path: 'routing',
        component: BreadcrumbsRoutingDemo,
        children: [
          {
            path: '',
            redirectTo: 'paints',
            pathMatch: 'full',
          },
          {
            path: 'paints',
            component: PaintsDemo,
            data: {
              breadcrumb: 'Paints',
            },
            children: [
              {
                path: '',
                component: PaintsListDemo,
              },
              {
                path: 'watercolor',
                component: WatercolorDemo,
                data: {
                  breadcrumb: 'Watercolor',
                },
                children: [
                  {
                    path: '',
                    component: WatercolorListDemo,
                  },
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
                    children: [
                      {
                        path: 'cotman',
                        component: WNCotmanDemo,
                        data: {
                          breadcrumb: 'Cotman',
                        },
                      },
                      {
                        path: 'professional',
                        component: WNProfessionalDemo,
                        data: {
                          breadcrumb: 'Professional',
                        },
                      },
                    ],
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
      {
        path: 'href',
        component: BreadcrumbsHrefDemo,
      },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
