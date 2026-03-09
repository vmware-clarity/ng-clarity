/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AlertsDemo } from './alerts.demo';
import { AlertAngularAppLevelDemo } from './angular/alert-angular-app-level';
import { AlertAngularAppLevelAlertsDemo } from './angular/alert-angular-app-level-alerts';
import { AlertAngularCloseEventDemo } from './angular/alert-angular-close-event';
import { AlertAngularLightweightDemo } from './angular/alert-angular-lightweight';
import { AlertAngularNotClosableDemo } from './angular/alert-angular-not-closable';
import { AlertAngularSmallDemo } from './angular/alert-angular-small';
import { AlertAngularSuccessDemo } from './angular/alert-angular-success';
import { AlertAppLevelDemo } from './static/alert-app-level';
import { AlertCardsDemo } from './static/alert-cards';
import { AlertContentAreaDemo } from './static/alert-content-area';
import { AlertModalsDemo } from './static/alert-modals';
import { AlertSizesDemo } from './static/alert-sizes';
import { AlertStylesDemo } from './static/alert-styles';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    StyleDocsComponent,
    NestingTableComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    RouterModule.forChild([{ path: '', component: AlertsDemo }]),
    LinkCardsComponent,
    AlertStylesDemo,
    AlertContentAreaDemo,
    AlertCardsDemo,
    AlertModalsDemo,
    AlertSizesDemo,
    AlertAppLevelDemo,
    AlertAngularAppLevelDemo,
    AlertAngularAppLevelAlertsDemo,
    AlertAngularNotClosableDemo,
    AlertAngularSuccessDemo,
    AlertAngularSmallDemo,
    AlertAngularLightweightDemo,
    AlertAngularCloseEventDemo,
    AlertsDemo,
  ],
  exports: [AlertsDemo],
})
export class AlertsDemoModule {}
