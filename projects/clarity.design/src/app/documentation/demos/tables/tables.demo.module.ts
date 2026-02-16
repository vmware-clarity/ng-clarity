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

import { TablesBasicDemo } from './tables-basic';
import { TablesCompactDemo } from './tables-compact';
import { TablesCompactNoborderDemo } from './tables-compact-noborder';
import { TablesLeftcellDemo } from './tables-leftcell';
import { TablesMultilineDemo } from './tables-multiline';
import { TablesNoborderDemo } from './tables-noborder';
import { TablesVerticalDemo } from './tables-vertical';
import { TablesVerticalNoborderCompactDemo } from './tables-vertical-noborder-compact';
import { TablesWidthDemo } from './tables-width';
import { TablesDemo } from './tables.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: TablesDemo }]),
    StyleDocsComponent,
    StackblitzExampleComponent,
  ],
  declarations: [
    TablesBasicDemo,
    TablesLeftcellDemo,
    TablesMultilineDemo,
    TablesNoborderDemo,
    TablesCompactDemo,
    TablesCompactNoborderDemo,
    TablesVerticalDemo,
    TablesVerticalNoborderCompactDemo,
    TablesWidthDemo,
    TablesDemo,
  ],
  exports: [TablesDemo],
})
export class TablesDemoModule {}
