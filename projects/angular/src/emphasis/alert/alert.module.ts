/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { CdsAlertModule } from '@cds/angular/alert';
import { CdsPaginationModule } from '@cds/angular/pagination';
import {
  infoCircleIcon,
  checkCircleIcon,
  ClarityIcons,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  windowCloseIcon,
} from '@cds/core/icon';

import { ClrAlert } from './alert';
import { ClrAlertItem } from './alert-item';
import { ClrAlerts } from './alerts';

export const CLR_ALERT_DIRECTIVES: Type<any>[] = [ClrAlert, ClrAlertItem, ClrAlerts];

@NgModule({
  imports: [CommonModule, CdsAlertModule, CdsPaginationModule],
  declarations: [CLR_ALERT_DIRECTIVES],
  exports: [CLR_ALERT_DIRECTIVES],
})
export class ClrAlertModule {
  constructor() {
    ClarityIcons.addIcons(
      checkCircleIcon,
      infoCircleIcon,
      exclamationCircleIcon,
      exclamationTriangleIcon,
      windowCloseIcon
    );
  }
}
