/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { AppfxTranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly appfxTranslateService: AppfxTranslateService) {}

  transform(key: string, args?: Record<string, unknown>): string {
    return this.appfxTranslateService.translate(key, args);
  }
}
