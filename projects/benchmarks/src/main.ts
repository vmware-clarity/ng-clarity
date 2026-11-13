/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

// Zoneless, like new Angular applications: the scenarios measure the components, not zone.js.
bootstrapApplication(AppComponent, { providers: [provideRouter(routes, withHashLocation())] }).catch(err =>
  console.error(err)
);
