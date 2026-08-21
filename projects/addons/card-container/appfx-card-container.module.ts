/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppfxTranslateModule } from '@clr/addons/translate';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { AppfxCardComponent } from './card/appfx-card.component';
import { AppfxCardContainerComponent } from './container/appfx-card-container.component';
import { AppfxCardContainerSettingsComponent } from './settings/appfx-card-container-settings.component';

/**
 * AppFx Card Container module
 * declaration and exports of needed components
 */
@NgModule({
  imports: [AppfxTranslateModule, ClrCheckboxModule, ClrDropdownModule, CommonModule, DragDropModule],
  declarations: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent],
  exports: [AppfxCardComponent, AppfxCardContainerComponent, AppfxCardContainerSettingsComponent],
})
export class AppfxCardContainerModule {}
