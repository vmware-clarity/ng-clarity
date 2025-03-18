/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isBrowser } from './environment.js';

describe('Environment Helper: ', () => {
  describe('isBrowser():', () => {
    it('returns true when expected', () => {
      expect(isBrowser()).toBe(true);
    });
  });
});
