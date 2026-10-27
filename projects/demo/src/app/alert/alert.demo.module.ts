/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { AlertsDemo } from './alert.demo';
import { ROUTING } from './alert.demo.routing';
import { AlertAngularDemo } from './angular/alert-angular';
import { AlertAngularAppLevelAlertsDemo } from './angular/alert-angular-app-level-alerts';
import { AlertAngularNotClosableDemo } from './angular/alert-angular-not-closable';
import { AlertAngularSmallDemo } from './angular/alert-angular-small';
import { AlertAppLevelDemo } from './static/alert-app-level';
import { AlertCardsDemo } from './static/alert-cards';
import { AlertStaticDemo } from './static/alert-static';
import { AlertStylesDemo } from './static/alert-styles';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [
    AlertsDemo,
    AlertStaticDemo,
    AlertStylesDemo,
    AlertCardsDemo,
    AlertAppLevelDemo,

    AlertAngularDemo,
    AlertAngularAppLevelAlertsDemo,
    AlertAngularNotClosableDemo,
    AlertAngularSmallDemo,
  ],
  exports: [
    AlertsDemo,
    AlertStaticDemo,
    AlertStylesDemo,
    AlertCardsDemo,
    AlertAppLevelDemo,

    AlertAngularDemo,
    AlertAngularAppLevelAlertsDemo,
    AlertAngularNotClosableDemo,
    AlertAngularSmallDemo,
  ],
})
export class AlertDemoModule {}
