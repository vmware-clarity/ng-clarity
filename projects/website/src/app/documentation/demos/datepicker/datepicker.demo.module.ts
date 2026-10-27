/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { DatepickerDemo } from './datepicker.demo';
import { DatepickerAPIDemo } from './demos/datepicker-api.demo';
import { DatepickerENUSDemo } from './demos/datepicker-enUS.demo';
import { DatepickerFRDemo } from './demos/datepicker-fr.demo';
import { DatepickerInternationalizationDemo } from './demos/datepicker-internationalization.demo';
import { DatepickerIODemo } from './demos/datepicker-io.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    DocTabsModule,
    FormsModule,
    ReactiveFormsModule,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    RouterModule.forChild([{ path: '', component: DatepickerDemo }]),
    NestingTableComponent,
    LinkCardsComponent,
    DatepickerAPIDemo,
    DatepickerDemo,
    DatepickerFRDemo,
    DatepickerENUSDemo,
    DatepickerInternationalizationDemo,
    DatepickerIODemo,
  ],
  exports: [DatepickerDemo],
})
export class DatepickerDemoModule {}
