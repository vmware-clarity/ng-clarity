/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subject } from 'rxjs';

import { wrapObservable } from './wrap-observable';

interface TestContext {
  original: Subject<string>;
  wrapped: Observable<string>;
  log: string[];
}

describe('Focus management', () => {
  describe('wrapObservable()', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    beforeEach(() => {
      testContext.log = [];
      testContext.original = new Subject<string>();
      testContext.wrapped = wrapObservable(
        testContext.original,
        () => testContext.log.push('Subscribed'),
        () => testContext.log.push('Unsubscribed')
      );
    });

    afterEach(() => {
      testContext.original.complete();
    });

    it('executes the onSubscribe function on subscription', () => {
      expect(testContext.log).toEqual([]);
      testContext.wrapped.subscribe(value => testContext.log.push(value));
      expect(testContext.log).toEqual(['Subscribed']);
    });

    it('executes the onUnsubscribe function on unsubscription', () => {
      expect(testContext.log).toEqual([]);
      const subscription = testContext.wrapped.subscribe(value => testContext.log.push(value));
      testContext.log.length = 0;
      subscription.unsubscribe();
      expect(testContext.log).toEqual(['Unsubscribed']);
    });

    it('emits the same values as the original observable', () => {
      testContext.wrapped.subscribe(value => testContext.log.push(value));
      testContext.log.length = 0;
      testContext.original.next('Hello');
      expect(testContext.log).toEqual(['Hello']);
      testContext.original.next('World');
      expect(testContext.log).toEqual(['Hello', 'World']);
    });
  });
});
