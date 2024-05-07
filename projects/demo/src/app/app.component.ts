/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';

import { Component } from '@angular/core';
import { Route } from '@angular/router';
import {
  loadChartIconSet,
  loadCommerceIconSet,
  loadCoreIconSet,
  loadEssentialIconSet,
  loadMediaIconSet,
  loadMiniIconSet,
  loadSocialIconSet,
  loadTechnologyIconSet,
  loadTextEditIconSet,
  loadTravelIconSet,
} from '@cds/core/icon';

import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  routes: Route[] = APP_ROUTES;
  clrUiDarkThemeApplied = environment.dark;

  constructor() {
    loadChartIconSet();
    loadCommerceIconSet();
    loadCoreIconSet();
    loadEssentialIconSet();
    loadMediaIconSet();
    loadMiniIconSet();
    loadSocialIconSet();
    loadTechnologyIconSet();
    loadTextEditIconSet();
    loadTravelIconSet();
  }
}
