/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, TestBed } from '@angular/core/testing';

import { DateTimePipe } from './date-time.pipe';
import { DateTimeKind, DateTimeService } from './date-time.service';
import { AppfxTranslateService } from './translate.service';

describe('Pipe: DateTime', () => {
  const testDate = new Date('01 June 2023 UTC');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppfxTranslateService, DateTimeService, DateTimePipe],
    });
  });

  it('exists', inject([DateTimePipe], (pipe: DateTimePipe) => {
    expect(pipe).toBeTruthy();
  }));

  it('calls the dateTimeService', inject(
    [DateTimePipe, DateTimeService],
    (pipe: DateTimePipe, service: DateTimeService) => {
      const spy = spyOn(service, 'format');
      const options = {
        dateTimeKind: DateTimeKind.LongDateTime,
      };

      pipe.transform(testDate, options);

      expect(spy).toHaveBeenCalledWith(testDate, options);
    }
  ));
});
