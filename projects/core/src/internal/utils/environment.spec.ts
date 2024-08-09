/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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
