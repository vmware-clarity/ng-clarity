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

import { AppLayoutDemo } from './app-layout.demo';
import { LayoutAllDemo } from './layout-all';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    DoDontComponent,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    RouterModule.forChild([{ path: '', component: AppLayoutDemo }]),
    StackblitzExampleComponent,
    AppLayoutDemo,
    LayoutAllDemo,
  ],
  exports: [AppLayoutDemo],
})
export class AppLayoutDemoModule {}
