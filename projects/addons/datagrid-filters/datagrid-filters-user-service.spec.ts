/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { DatagridFiltersUserService } from './datagrid-filters-user-service';

describe('DatagridFiltersUserService', () => {
  let service: DatagridFiltersUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatagridFiltersUserService],
    });
    service = TestBed.inject(DatagridFiltersUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDomains()', () => {
    it('should return an empty array by default', async () => {
      const domains = await firstValueFrom(service.getDomains());

      expect(Array.isArray(domains)).toBeTrue();
      expect(domains.length).toBe(0);
    });
  });

  describe('searchUsers()', () => {
    it('should return an empty array by default regardless of input', async () => {
      const users = await firstValueFrom(service.searchUsers('test-user', 'test-domain'));

      expect(Array.isArray(users)).toBeTrue();
      expect(users.length).toBe(0);
    });

    it('should handle null or undefined inputs gracefully', async () => {
      // Testing boundary conditions for the base class
      const users = await firstValueFrom(service.searchUsers(null as any, undefined as any));

      expect(users).toEqual([]);
    });
  });
});
