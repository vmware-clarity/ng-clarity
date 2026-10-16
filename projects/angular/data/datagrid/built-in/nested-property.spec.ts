/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NestedProperty } from './nested-property';

export default function (): void {
  describe('NestedProperty (internal)', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    it('accesses root properties', () => {
      testContext.property = new NestedProperty('a');
      expect(testContext.property.getPropValue({ a: 42 })).toBe(42);
    });

    it('accesses deep properties', () => {
      testContext.property = new NestedProperty('my.deep.prop');
      expect(testContext.property.getPropValue({ my: { deep: { prop: 42 } } })).toBe(42);
    });

    it('returns gracefully undefined when any of the intermediate properties is missing', () => {
      testContext.property = new NestedProperty('my.deep.prop');
      expect(testContext.property.getPropValue({})).toBeUndefined();
      expect(testContext.property.getPropValue({ my: {} })).toBeUndefined();
      expect(testContext.property.getPropValue({ my: { deep: {} } })).toBeUndefined();
    });
  });
}
