/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatalistIdService } from './datalist-id.service';

describe('ClrDatalist', () => {
  describe('DatalistIdService', function () {
    it('generates a unique id by default', function () {
      const first = new DatalistIdService();
      const second = new DatalistIdService();
      expect(first.id, "The service doesn't generate an id").toBeTruthy();
      expect(second.id, "The service doesn't generate an id").toBeTruthy();
      expect(first.id === second.id, "The id generated isn't unique").toBe(false);
    });

    it('exposes an Observable for id changes', function () {
      const service = new DatalistIdService();
      service.id = 'hello';
      let emittedId: string;
      service.idChange.subscribe(id => (emittedId = id));
      expect(emittedId).toBe('hello');
      service.id = 'world';
      expect(emittedId).toBe('world');
    });
  });
});
