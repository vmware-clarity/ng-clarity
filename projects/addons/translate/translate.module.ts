/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DateTimePipe } from './date-time.pipe';
import { DateTimeService } from './date-time.service';
import { TranslatePipe } from './translate.pipe';
import { AppfxTranslateService } from './translate.service';

@NgModule({
  declarations: [DateTimePipe, TranslatePipe],
  imports: [CommonModule],
  exports: [DateTimePipe, TranslatePipe],
  providers: [AppfxTranslateService, DateTimeService],
})
export class AppfxTranslateModule {}
