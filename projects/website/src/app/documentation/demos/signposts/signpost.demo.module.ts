/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { SignpostOpenAtPointDemo } from './signpost-open-at-point.demo';
import { SignpostParagraphDemo } from './signpost-paragraph.demo';
import { SignpostPositionsDemo } from './signpost-positions.demo';
import { SignpostTriggersDemo } from './signpost-triggers.demo';
import { SignpostDemo } from './signpost.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: SignpostDemo }]),
    DocTabsModule,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    LinkCardsComponent,
    SignpostDemo,
    SignpostOpenAtPointDemo,
    SignpostParagraphDemo,
    SignpostPositionsDemo,
    SignpostTriggersDemo,
  ],
})
export class SignpostDemoModule {}
