/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ArrowKeyDirection } from '../arrow-key-direction.enum';
import { FocusableItem } from './focusable-item';
import { MockFocusableItem } from './focusable-item.mock';
import { Linkers } from './linkers';

export default function (): void {
  describe('linkParent()', () => {
    it('links the list of items to the parent according to the given direction', () => {
      const parent = new MockFocusableItem('parent');
      const children: FocusableItem[] = new Array(5).fill(0).map((_, i) => new MockFocusableItem(`${i}`));
      Linkers.linkParent(children, parent, ArrowKeyDirection.RIGHT);
      for (const child of children) {
        expect(child.right).toBe(parent);
      }
    });
  });

  describe('linkVertical()', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    type TestContext = {
      first: FocusableItem;
      second: FocusableItem;
      third: FocusableItem;
    };

    beforeEach(() => {
      testContext.first = new MockFocusableItem('0');
      testContext.second = new MockFocusableItem('1');
      testContext.third = new MockFocusableItem('2');
    });

    it('links the items vertically both ways', () => {
      Linkers.linkVertical([testContext.first, testContext.second, testContext.third]);
      expect(testContext.second.up).toBe(testContext.first);
      expect(testContext.second.down).toBe(testContext.third);
    });

    it('loops by default', () => {
      Linkers.linkVertical([testContext.first, testContext.second, testContext.third]);
      expect(testContext.first.up).toBe(testContext.third);
      expect(testContext.third.down).toBe(testContext.first);
    });

    it('offer the option to not loop', () => {
      Linkers.linkVertical([testContext.first, testContext.second, testContext.third], false);
      expect(testContext.first.up).toBeUndefined();
      expect(testContext.third.down).toBeUndefined();
    });
  });
}
