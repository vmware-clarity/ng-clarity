/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Routes } from '@angular/router';

import { documentationRoutes } from './documentation/documentation-routes';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  {
    path: 'pages/:slug',
    loadComponent: () => import('./content-page/content-page.component').then(m => m.ContentPageComponent),
  },
  {
    path: '',
    component: HomeComponent,
  },
  ...documentationRoutes,

  // just in case people who may have bookmarked an old url, redirect them to the new url.
  {
    path: 'icons',
    redirectTo: '/documentation/icons',
  },
  {
    path: 'documentation/iconography',
    redirectTo: '/documentation/icons',
  },
  {
    path: 'get-started',
    redirectTo: '/pages/introduction',
  },
  {
    path: 'icons/clarity-icons',
    redirectTo: '/documentation/icons',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
