/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Routes } from '@angular/router';

import { AngularExample } from './project-technology/angular-example';
import { ClarityExample } from './project-technology/clarity-example';
import { DashboardExample } from './project-technology/dashboard-example';
import { FrameworkExample } from './project-technology/framework-example';
import { ReactExample } from './project-technology/react-example';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'framework',
    pathMatch: 'full',
  },
  {
    path: 'framework',
    component: FrameworkExample,
    data: {
      breadcrumb: 'Framework',
    },
    children: [
      {
        path: '',
        component: DashboardExample,
      },
      {
        path: 'angular',
        component: AngularExample,
        data: {
          breadcrumb: 'Angular',
        },
        children: [
          {
            path: 'clarity',
            component: ClarityExample,
            data: {
              breadcrumb: 'Clarity',
            },
          },
        ],
      },
      {
        path: 'react',
        component: ReactExample,
        data: {
          breadcrumb: 'React',
        },
      },
    ],
  },
];
