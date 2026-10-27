/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClrFileInputModule } from '@clr/angular';

import { FilePickerApiAngular } from './api/angular/file-picker-api-angular';
import { FilePickerApi } from './api/file-picker-api';
import { FilePickerCode } from './code/file-picker-code';
import { FilePickerDemo } from './file-picker.demo';
import { FilePickerOverview } from './overview/file-picker-overview';
import { FilePickerOverviewLayouts } from './overview/layouts/file-picker-overview-layouts';
import { FilePickerOverviewStates } from './overview/states/file-picker-overview-states';
import { FilePickerOverviewUsage } from './overview/usage/file-picker-overview-usage';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClrFileInputModule,
    DocTabsModule,
    StyleDocsComponent,
    RouterModule.forChild([{ path: '', component: FilePickerDemo }]),
    NestingTableComponent,
    LinkCardsComponent,
    FilePickerDemo,
    FilePickerOverview,
    FilePickerOverviewUsage,
    FilePickerOverviewStates,
    FilePickerOverviewLayouts,
    FilePickerCode,
    FilePickerApi,
    FilePickerApiAngular,
  ],
})
export class FilePickerDemoModule {}
