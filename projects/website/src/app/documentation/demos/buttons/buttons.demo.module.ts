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

import { ButtonLoadingDemo } from './button-loading';
import { ButtonSizesDemo } from './button-sizes';
import { ButtonStatesDemo } from './button-states';
import { ButtonsDemo } from './buttons.demo';
import { IconButtonsDemo } from './icon-buttons';
import { InverseButtonDemo } from './inverse-button';
import { RealButtonDemo } from './real-button';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabsModule } from '../../../shared/doc-tabs/doc-tabs.module';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    DocTabsModule,
    RouterModule.forChild([{ path: '', component: ButtonsDemo }]),
    DoDontComponent,
    StyleDocsComponent,
    ThemedImageComponent,
    NestingTableComponent,
    StackblitzExampleComponent,
    RealButtonDemo,
    InverseButtonDemo,
    ButtonStatesDemo,
    ButtonSizesDemo,
    ButtonLoadingDemo,
    IconButtonsDemo,
    ButtonsDemo,
  ],
  exports: [ButtonsDemo],
})
export class ButtonsDemoModule {}
