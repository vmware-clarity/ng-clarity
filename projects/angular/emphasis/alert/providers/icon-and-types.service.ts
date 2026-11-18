/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { AlertInfoObject } from '../utils/alert-info-object';
import { ALERT_TYPES } from '../utils/alert-types';

@Injectable()
export class AlertIconAndTypesService {
  private defaultIconShape = 'info-standard';
  private readonly iconShape = signal('');
  private readonly type = signal('info');

  constructor(private commonStrings: ClrCommonStringsService) {}

  get alertType(): string {
    return this.type();
  }
  set alertType(val: string) {
    if (ALERT_TYPES.indexOf(val) > -1) {
      this.type.set(val);
    }
  }

  get alertIconShape(): string {
    return this.iconShape() || this.iconInfoFromType(this.alertType).shape;
  }
  set alertIconShape(val: string) {
    this.iconShape.set(val || '');
  }

  get alertIconTitle(): string {
    return this.iconInfoFromType(this.alertType).title;
  }

  iconInfoFromType(type: string): AlertInfoObject {
    const returnObj = { shape: '', cssClass: '', title: '' };

    switch (type) {
      case 'warning':
        returnObj.shape = 'warning-standard';
        returnObj.cssClass = 'alert-warning';
        returnObj.title = this.commonStrings.keys.warning;
        break;
      case 'danger':
        returnObj.shape = 'error-standard';
        returnObj.cssClass = 'alert-danger';
        returnObj.title = this.commonStrings.keys.danger;
        break;
      case 'success':
        returnObj.shape = 'success-standard';
        returnObj.cssClass = 'alert-success';
        returnObj.title = this.commonStrings.keys.success;
        break;
      case 'neutral':
        returnObj.shape = 'note';
        returnObj.cssClass = 'alert-neutral';
        returnObj.title = this.commonStrings.keys.neutral;
        break;
      case 'unknown':
        returnObj.shape = 'help';
        returnObj.cssClass = 'alert-neutral';
        returnObj.title = this.commonStrings.keys.unknown;
        break;
      case 'loading':
        returnObj.shape = 'loading';
        returnObj.cssClass = 'alert-neutral';
        returnObj.title = this.commonStrings.keys.unknown;
        break;
      default:
        returnObj.shape = this.defaultIconShape;
        returnObj.cssClass = 'alert-info';
        returnObj.title = this.commonStrings.keys.info;
        break;
    }

    return returnObj;
  }
}
