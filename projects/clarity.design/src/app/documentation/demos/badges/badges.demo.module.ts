/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { BadgeColorsDemo } from './badge-colors';
import { BadgeStatusesDemo } from './badge-statuses';
import { BadgesDemo } from './badges.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
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
    ThemedImageComponent,
    NestingTableComponent,
    StackblitzExampleComponent,
    RouterModule.forChild([{ path: '', component: BadgesDemo }]),
  ],
  declarations: [BadgeColorsDemo, BadgeStatusesDemo, BadgesDemo],
  exports: [BadgesDemo],
})
export class BadgesDemoModule {}
