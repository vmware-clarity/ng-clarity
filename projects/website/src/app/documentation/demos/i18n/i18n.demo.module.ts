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

import { I18nDemo } from './i18n.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    CodeSnippetComponent,
    RouterModule.forChild([{ path: '', component: I18nDemo }]),
    I18nDemo,
  ],
  exports: [I18nDemo],
})
export class I18nDemoModule {}
