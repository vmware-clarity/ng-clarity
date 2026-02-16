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

import { AccordionDemo } from './accordion.demo';
import { AngularAccordionDemo } from './angular-accordion.demo';
import { ApiAccordionDemo } from './api-accordion.demo';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    DocTabsModule,
    StyleDocsComponent,
    RouterModule.forChild([{ path: '', component: AccordionDemo }]),
    NestingTableComponent,
    ThemedImageComponent,
    StackblitzExampleComponent,
  ],
  declarations: [AccordionDemo, AngularAccordionDemo, ApiAccordionDemo],
})
export class AccordionDemoModule {}
