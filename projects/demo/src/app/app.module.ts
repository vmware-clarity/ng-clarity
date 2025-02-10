/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { ROUTING } from './app.routing';
import { cdsThemePathLocationStrategyProvider } from './cds-theme-path-location-strategy';
import { CdsThemeSelectComponent } from './cds-theme-select.component';
import { AppContentContainerComponent } from './content-container.component';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [AppComponent, LandingComponent, AppContentContainerComponent, CdsThemeSelectComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    ROUTING,
    ScrollingModule,
  ],
  providers: [cdsThemePathLocationStrategyProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
