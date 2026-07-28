/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { resettableShareReplay } from './resettable-share-replay';

describe('resettable-share-replay.spec', () => {
  describe('reset', () => {
    it("when 'reset' is called, new subscribers will not get cached values", () => {
      const subj = new Subject<number>();
      const reset = new Subject<void>();
      let invocationCount = 0;

      const observable = subj.pipe(
        tap(() => invocationCount++),
        resettableShareReplay({
          bufferSize: 1,
          refCount: true,
          reset: reset,
        })
      );

      let s1Result: number | undefined;
      const s1 = observable.subscribe(value => (s1Result = value));

      expect(invocationCount).toEqual(0);
      subj.next(1);
      expect(invocationCount).toEqual(1);

      expect(s1Result).toEqual(1);

      // Second subscription will get cached value from the ReplaySubject.
      let s2Result: number | undefined;
      const s2 = observable.subscribe(value => (s2Result = value));
      expect(s2Result).toEqual(1);
      // invocationCount remains 1, because the result is returned from the ReplaySubject.
      expect(invocationCount).toEqual(1);

      // Reset the inner ReplaySubject inside the "resettableShareReplay" operator.
      reset.next();

      // New subscription after the reset
      let s3Result: number | undefined;
      const s3 = observable.subscribe(value => (s3Result = value));
      // The new subscriber will not get cached value.
      expect(s3Result).toBeUndefined();

      subj.next(2);

      // After reset all existing subscriber will continue to receive emitted values.
      expect(s1Result).toEqual(2);
      expect(s2Result).toEqual(2);
      expect(s3Result).toEqual(2);
      expect(invocationCount).toEqual(2);

      s1.unsubscribe();
      s2.unsubscribe();
      s3.unsubscribe();
    });
  });
});
