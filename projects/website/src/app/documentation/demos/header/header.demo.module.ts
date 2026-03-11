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

import { HeaderColorsDemo } from './header-colors';
import { HeaderLinksDemo } from './header-links';
import { HeaderTypesDemo } from './header-types';
import { HeaderDemo } from './header.demo';
import { SubNavDemo } from './sub-nav';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: HeaderDemo }]),
    DoDontComponent,
    StyleDocsComponent,
    NestingTableComponent,
    StackblitzExampleComponent,
    HeaderColorsDemo,
    HeaderLinksDemo,
    HeaderTypesDemo,
    SubNavDemo,
    HeaderDemo,
  ],
  exports: [HeaderDemo],
})
export class HeaderDemoModule {}
