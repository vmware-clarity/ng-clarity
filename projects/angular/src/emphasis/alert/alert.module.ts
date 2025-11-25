/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  errorStandardIcon,
  helpIcon,
  infoStandardIcon,
  noteIcon,
  successStandardIcon,
  warningStandardIcon,
  windowCloseIcon,
} from '@clr/angular/src/icon';
import { ClrDropdownModule } from '@clr/angular/src/popover/dropdown';
import { ClrSpinnerModule } from '@clr/angular/src/progress/spinner';

import { ClrAlert } from './alert';
import { ClrAlertItem } from './alert-item';
import { ClrAlertText } from './alert-text';
import { ClrAlerts } from './alerts';
import { ClrAlertsPager } from './alerts-pager';

export const CLR_ALERT_DIRECTIVES: Type<any>[] = [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrDropdownModule, ClrSpinnerModule],
  declarations: [CLR_ALERT_DIRECTIVES],
  exports: [CLR_ALERT_DIRECTIVES],
})
export class ClrAlertModule {
  constructor() {
    ClarityIcons.addIcons(
      errorStandardIcon,
      helpIcon,
      infoStandardIcon,
      noteIcon,
      successStandardIcon,
      warningStandardIcon,
      windowCloseIcon
    );
  }
}
