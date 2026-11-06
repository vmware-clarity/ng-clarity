/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ApplicationRef, enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { enableDebugTools, platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowser()
  .bootstrapModule(AppModule, { applicationProviders: [provideZonelessChangeDetection()] })
  .then(moduleRef =>
    // allows to run `ng.profiler.timeChangeDetection();`
    enableDebugTools(moduleRef.injector.get(ApplicationRef).components[0])
  )
  .catch(err => console.error(err));
