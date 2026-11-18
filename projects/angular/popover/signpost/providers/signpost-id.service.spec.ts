/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SignpostIdService } from './signpost-id.service';

interface TestContext {
  idService: SignpostIdService;
}

describe('Signpost', () => {
  describe('Signpost Id Service', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      testContext.idService = new SignpostIdService();
    });

    it('starts without an id', () => {
      expect(testContext.idService.id()).toBeUndefined();
    });

    it('should set an id', () => {
      testContext.idService.id.set('clr-id-1');
      expect(testContext.idService.id()).toBe('clr-id-1');
    });
  });
});
