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

import { DateRangePickerDemo } from './date-range-picker.demo';
import { DateRangePickerAPIDemo } from './demos/date-range-picker-api.demo';
import { DateRangePickerDateIODemo } from './demos/date-range-picker-date-io.demo';
import { DateRangePickerENUSDemo } from './demos/date-range-picker-enUS.demo';
import { DateRangePickerFRDemo } from './demos/date-range-picker-fr.demo';
import { DateRangePickerInternationalizationDemo } from './demos/date-range-picker-internationalization.demo';
import { DateRangePickerIODemo } from './demos/date-range-picker-io.demo';
import { DateRangePickerReactiveFormsDemo } from './demos/date-range-picker-reactive-forms';
import { DateRangePickerTemplateDrivenFormsDemo } from './demos/date-range-picker-template-driven-forms';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
    CommonModule,
    ClarityModule,
    FormsModule,
    DocTabsModule,
    FormsModule,
    StyleDocsComponent,
    CodeSnippetComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
    RouterModule.forChild([{ path: '', component: DateRangePickerDemo }]),
    DateRangePickerAPIDemo,
    DateRangePickerDemo,
    DateRangePickerFRDemo,
    DateRangePickerENUSDemo,
    DateRangePickerInternationalizationDemo,
    DateRangePickerIODemo,
    DateRangePickerDateIODemo,
    DateRangePickerTemplateDrivenFormsDemo,
    DateRangePickerReactiveFormsDemo,
  ],
  exports: [DateRangePickerDemo],
})
export class DateRangePickerDemoModule {}
