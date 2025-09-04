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
  errorStandardIcon,
  helpIcon,
  infoStandardIcon,
  noteIcon,
  successStandardIcon,
  warningStandardIcon,
  windowCloseIcon,
} from '@cds/core/icon';

import { ClrAlert } from './alert';
import { ClrAlertItem } from './alert-item';
import { ClrAlertText } from './alert-text';
import { ClrAlerts } from './alerts';
import { ClrAlertsPager } from './alerts-pager';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrDropdownModule } from '../../popover/dropdown/dropdown.module';
import { ClrSpinnerModule } from '../../progress/spinner';

export const CLR_ALERT_DIRECTIVES: Type<any>[] = [ClrAlert, ClrAlertItem, ClrAlerts, ClrAlertsPager, ClrAlertText];

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrDropdownModule, ClrSpinnerModule],
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
