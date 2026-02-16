/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
import { DatepickerDateIODemo } from './demos/datepicker-date-io.demo';
import { DatepickerENUSDemo } from './demos/datepicker-enUS.demo';
import { DatepickerFRDemo } from './demos/datepicker-fr.demo';
import { DatepickerInternationalizationDemo } from './demos/datepicker-internationalization.demo';
import { DatepickerIODemo } from './demos/datepicker-io.demo';
import { DatepickerReactiveFormsDemo } from './demos/datepicker-reactive-forms';
import { DatepickerTemplateDrivenFormsDemo } from './demos/datepicker-template-driven-forms';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { LinkCardsComponent } from '../../../shared/link-cards/link-cards.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
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
    StackblitzExampleComponent,
    RouterModule.forChild([{ path: '', component: DatepickerDemo }]),
    NestingTableComponent,
    LinkCardsComponent,
  ],
  declarations: [
    DatepickerAPIDemo,
    DatepickerDemo,
    DatepickerFRDemo,
    DatepickerENUSDemo,
    DatepickerInternationalizationDemo,
    DatepickerIODemo,
    DatepickerDateIODemo,
    DatepickerTemplateDrivenFormsDemo,
    DatepickerReactiveFormsDemo,
  ],
  exports: [DatepickerDemo],
})
export class DatepickerDemoModule {}
