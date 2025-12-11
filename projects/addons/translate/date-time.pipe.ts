/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { DateTimeFormatOptions, DateTimeService } from './date-time.service';

@Pipe({
  name: 'dateTime',
  pure: false,
  standalone: false,
})
export class DateTimePipe implements PipeTransform {
  constructor(private readonly dateTimeService: DateTimeService) {}

  transform(value?: Date, options?: DateTimeFormatOptions): string {
    return this.dateTimeService.format(value, options);
  }
}
