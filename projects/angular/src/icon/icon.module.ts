/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIcon } from './icon.component';
import { IconHtmlPipe } from './utils/icon-html.pipe';

export const CLR_ICON_DIRECTIVES: Type<any>[] = [ClrIcon];

@NgModule({
  imports: [CommonModule, IconHtmlPipe],
  declarations: [CLR_ICON_DIRECTIVES],
  exports: [CLR_ICON_DIRECTIVES, IconHtmlPipe],
})
export class ClrIconModule {}
