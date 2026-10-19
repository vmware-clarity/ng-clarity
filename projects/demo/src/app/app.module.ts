/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { provideClrMutationPolicy } from '@clr/angular/ai';

import { AppComponent } from './app.component';
import { ROUTING } from './app.routing';
import { cdsThemePathLocationStrategyProvider } from './cds-theme-path-location-strategy';
import { CdsThemeSelectComponent } from './cds-theme-select.component';
import { AppContentContainerComponent } from './content-container.component';
import { ContextInspectorComponent } from './context-inspector/context-inspector.component';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    AppContentContainerComponent,
    CdsThemeSelectComponent,
    ContextInspectorComponent,
  ],
  imports: [BrowserAnimationsModule, CommonModule, FormsModule, ReactiveFormsModule, ClarityModule, ROUTING],
  providers: [
    cdsThemePathLocationStrategyProvider,
    // Demo mutation policy: fields inside `data-agent-fill` are reversible, leaving the page without
    // query parameters needs confirmation, and everything else is forbidden.
    provideClrMutationPolicy({
      classify: target => {
        if (target.operation === 'navigate') {
          return Object.keys(target.queryParams ?? {}).length ? 'forbidden' : 'consequential';
        }
        return target.element?.closest('[data-agent-fill]') ? 'reversible' : 'forbidden';
      },
      confirm: target => window.confirm(`Let the agent go to ${target.url}?`),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
