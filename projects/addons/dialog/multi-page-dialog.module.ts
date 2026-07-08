/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { AppfxWorkflowCoreModule } from '@clr/addons/var';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrModalModule } from '@clr/angular/modal';

import { DialogHeaderComponent } from './multi-page-dialog-header.component';
import { DialogComponent } from './multi-page-dialog.component';
import { ToggleComponent } from './toggle-component/toggle.component';

const components = [DialogComponent, DialogHeaderComponent, ToggleComponent];

@NgModule({
  imports: [
    AppfxTabsModule,
    AppfxWorkflowCoreModule,
    ClrCheckboxModule,
    ClrModalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [...components],
  exports: [...components],
})
export class AppfxMultiPageDialogModule {}
