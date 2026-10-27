/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app-config';
import { AppComponent } from './app/app.component';

// The datagrid demos size their columns from the rendered text once. Chromium lays text out in a fallback font until
// a web font face has loaded, even the inline base64 ones, so a grid that renders before the badges' Metropolis
// weight-500 face has loaded keeps columns sized for the fallback font (the flaky website visual snapshots, #2797).
// Load the faces declared by the inline critical CSS before bootstrapping to avoid that.
Promise.allSettled([...document.fonts].map(fontFace => fontFace.load())).then(() =>
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err))
);
