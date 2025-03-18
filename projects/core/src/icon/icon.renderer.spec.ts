/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from './icon.renderer.js';
import { dummyIconShape } from './utils/test-icons.js';

describe('Icon renderer: ', () => {
  describe('renderIcon: ', () => {
    it('should return the shape', () => {
      expect(renderIcon(dummyIconShape)).toEqual(dummyIconShape);
    });
  });
});
