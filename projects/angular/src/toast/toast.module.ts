/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import {
  ClarityIcons,
  errorStandardIcon,
  infoStandardIcon,
  successStandardIcon,
  warningStandardIcon,
  windowCloseIcon,
} from '@cds/core/icon';

import { ClrIconModule } from '../icon/icon.module';
import { ClrToastComponent } from './toast';
import { ClrToastContainerComponent } from './toast-container';

export const CLR_TOAST_DIRECTIVES: Type<any>[] = [ClrToastComponent, ClrToastContainerComponent];

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [CLR_TOAST_DIRECTIVES],
  exports: [CLR_TOAST_DIRECTIVES, ClrIconModule],
})
export class ClrToastModule {
  constructor() {
    ClarityIcons.addIcons(
      windowCloseIcon,
      successStandardIcon,
      infoStandardIcon,
      errorStandardIcon,
      warningStandardIcon
    );
  }
}
