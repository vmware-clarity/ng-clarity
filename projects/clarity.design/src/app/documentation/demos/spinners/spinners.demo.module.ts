/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { SpinnerComponentDemo } from './spinner-component';
import { SpinnerSizesDemo } from './spinner-sizes';
import { SpinnerTypesDemo } from './spinner-types';
import { SpinnerDemo } from './spinner.demo';
import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: SpinnerDemo }]),
    StyleDocsComponent,
    AnimatedExampleComponent,
    StackblitzExampleComponent,
  ],
  declarations: [SpinnerSizesDemo, SpinnerTypesDemo, SpinnerDemo, SpinnerComponentDemo],
  exports: [SpinnerDemo],
})
export class SpinnersDemoModule {}
