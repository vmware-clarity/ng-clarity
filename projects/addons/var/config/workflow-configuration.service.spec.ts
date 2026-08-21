/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { WorkflowConfigurationService } from './workflow-configuration.service';

describe('WorkflowConfigurationService', () => {
  let service: WorkflowConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowConfigurationService],
    });

    service = TestBed.inject(WorkflowConfigurationService);
  });

  it('should initialize debugValue to false by default', () => {
    expect(service).toBeTruthy();
    expect(service.debug).toBeFalse();
  });

  it('should set and get debugValue correctly', () => {
    service.debug = true;
    expect(service.debug).toBeTrue();
  });
});
