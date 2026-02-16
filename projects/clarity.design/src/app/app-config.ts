/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app-routes';
import { featureFlagPathLocationStrategyProvider } from './feature-flag-path-location-strategy';
import { logPageViewOnNavigationEndProvider } from './log-page-view-on-navigation-end.provider';
import { moveFocusOnContentChangeProvider } from './move-focus-on-content-change.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes),
    logPageViewOnNavigationEndProvider,
    moveFocusOnContentChangeProvider,
    featureFlagPathLocationStrategyProvider,
  ],
};
