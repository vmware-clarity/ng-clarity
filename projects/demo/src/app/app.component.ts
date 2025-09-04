/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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

import { APP_ROUTES } from './app.routing';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
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
