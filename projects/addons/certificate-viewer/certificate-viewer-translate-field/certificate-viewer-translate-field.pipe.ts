/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { AppfxTranslateService, DateTimeService } from '@clr/addons/translate';

import { CertificateField } from '../models/certificate-field.model';

@Pipe({
  name: 'translateField',
  standalone: false,
  pure: false,
})
export class CertificateViewerTranslateFieldPipe implements PipeTransform {
  constructor(
    private readonly appfxTranslateService: AppfxTranslateService,
    private readonly dateTimeService: DateTimeService
  ) {}

  transform(field: CertificateField | undefined, prop: 'name' | 'value'): string {
    if (!field) {
      return '';
    }

    switch (prop) {
      case 'name': {
        return field.translateName(this.appfxTranslateService);
      }
      case 'value': {
        return field.translateValue(this.appfxTranslateService, this.dateTimeService);
      }
      default: {
        throw new Error('Invalid certificate field property');
      }
    }
  }
}
