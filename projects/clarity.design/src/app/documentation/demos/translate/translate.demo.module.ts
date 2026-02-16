/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClarityModule } from '@clr/angular';

import { TranslateAddonDemo } from './translate.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TranslateAddonDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
    AppfxTranslateModule,
  ],
  declarations: [TranslateAddonDemo],
  exports: [TranslateAddonDemo],
})
export class TranslateAddonDemoModule {}
