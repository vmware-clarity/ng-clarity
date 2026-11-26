/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { TooltipIdService } from './tooltip-id.service';

interface TestContext {
  idService: TooltipIdService;
}

describe('Tooltip', () => {
  describe('Tooltip Id Service', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      testContext.idService = new TooltipIdService();
    });

    it('should set an id', () => {
      let currentId;
      testContext.idService.id.subscribe(newId => {
        currentId = newId;
      });
      testContext.idService.updateId('clr-id-1');
      expect(currentId).toBe('clr-id-1');
    });

    it('exposes and observable for latest id', () => {
      const idObservable = testContext.idService.id;
      expect(idObservable).toBeDefined();
      expect(idObservable instanceof Observable).toBe(true);
    });
  });
});
