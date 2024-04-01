/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { PopoverCdkService } from './popover-cdk.service';

describe('PopoverCdkService', () => {
  let service: PopoverCdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopoverCdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
