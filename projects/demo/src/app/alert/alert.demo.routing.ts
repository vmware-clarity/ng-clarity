/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ALERT_EXAMPLES } from '@clr/examples/alert';

import { AlertsDemo } from './alert.demo';
import { AlertAngularDemo } from './angular/alert-angular';
import { AlertAngularAppLevelAlertsDemo } from './angular/alert-angular-app-level-alerts';
import { AlertAngularNotClosableDemo } from './angular/alert-angular-not-closable';
import { AlertAngularSmallDemo } from './angular/alert-angular-small';
import { AlertAppLevelDemo } from './static/alert-app-level';
import { AlertCardsDemo } from './static/alert-cards';
import { AlertStaticDemo } from './static/alert-static';
import { AlertStylesDemo } from './static/alert-styles';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: AlertsDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: ALERT_EXAMPLES } },
      {
        path: 'static',
        component: AlertStaticDemo,
        children: [
          { path: '', redirectTo: 'styles', pathMatch: 'full' },
          { path: 'styles', component: AlertStylesDemo },
          { path: 'cards', component: AlertCardsDemo },
          { path: 'app-level', component: AlertAppLevelDemo },
        ],
      },
      {
        path: 'angular',
        component: AlertAngularDemo,
        children: [
          { path: '', redirectTo: 'not-closable', pathMatch: 'full' },
          { path: 'not-closable', component: AlertAngularNotClosableDemo },
          { path: 'app-level-alerts', component: AlertAngularAppLevelAlertsDemo },
          { path: 'small', component: AlertAngularSmallDemo },
        ],
      },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
