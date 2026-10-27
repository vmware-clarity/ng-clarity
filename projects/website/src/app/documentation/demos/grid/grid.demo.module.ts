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

import { GridDemo } from './grid.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: GridDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    GridDemo,
  ],
  exports: [GridDemo],
})
export class GridDemoModule {}
