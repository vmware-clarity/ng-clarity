/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { MonoTypeOperatorFunction, Observable, ReplaySubject, ShareReplayConfig, Subscriber, Subscription } from 'rxjs';

export interface ResettableShareReplayConfig extends ShareReplayConfig {
  reset: Observable<void>;
}

/**
 * Custom {@link shareReplay} operator that allows the internal {@link ReplaySubject} to be reset.
 * The {@link shareReplay} operator works the following way:
 *
 *    Source Observable <-- ReplaySubject <-- Observer(s)
 *
 * The operator subscribes to the source observable and forwards its next/complete/error to a
 * ReplaySubject. All observers subscribe to the ReplaySubject. This way there is only
 * subscription to the source and all observers receive the emitted values.
 * If refCount = true, when all observers unsubscribe from the ReplaySubject, the operator
 * unsubscribes from the source observable.
 *
 * This operator is enhanced version of the {@link shareReplay} operator. It adds capability
 * to "reset" the internal ReplaySubject. As a result of this any new subscribers will not
 * get the cached values from the internal ReplaySubject, but will wait for the source to emit.
 * There is no effect on the existing subscribers. Once the source emits, all observers will
 * get the new values.
 *
 * <b>Usage:</b>
 * @example
 *
 * const source$ = new Subject<number>();
 * const reset$ = new Subject<void>();
 *
 * const value$ = source$.pipe(
 *    resettableShareReplay({
 *       bufferSize: 1,
 *       refCount: true,
 *       reset: reset$
 *    })
 * );
 *
 * // First subscription will wait for the source to emit.
 * const sub1 = value$.subscribe(value => console.log("sub1: " + value));
 *
 * // Source emits
 * source$.next(1);
 *
 * // Console: sub1: 1
 *
 * // The new subscription will get the cached value
 * const sub2 = value$.subscribe(value => console.log("sub2: " + value));
 * // Console: sub2: 1
 *
 * // Clear the cache
 * reset$.next();
 *
 * // The new subscription will NOT receive cached value
 * const sub3 = value$.subscribe(value => console.log("sub3: " + value));
 *
 * // Source emits again. All the 3 subscriptions will receive the emitted value.
 * source$.next(2);
 *
 * // Console:
 * // sub1: 2
 * // sub2: 2
 * // sub3: 2
 */
export function resettableShareReplay<T>(config: ResettableShareReplayConfig): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(shareReplayOperator(config));
}

function shareReplayOperator<T>({
  bufferSize = Infinity,
  windowTime = Infinity,
  refCount: useRefCount,
  scheduler,
  reset: onReset,
}: ResettableShareReplayConfig) {
  let subject: ReplaySubject<T> | undefined;
  let refCount = 0;
  let subscription: Subscription | undefined;
  let resetSubscription: Subscription | undefined;
  let hasError = false;

  return function shareReplayOperation(this: Subscriber<T>, source: Observable<T>) {
    refCount++;
    if (!subject || hasError) {
      resetSubscription = onReset.subscribe(() => {
        if (subject) {
          // Remove existing observers, if any.
          subject.unsubscribe();
        }
        subject = new ReplaySubject<T>(bufferSize, windowTime, scheduler);
      });

      hasError = false;
      subject = new ReplaySubject<T>(bufferSize, windowTime, scheduler);
      subscription = source.subscribe({
        next(value) {
          subject?.next(value);
        },
        error(err: unknown) {
          hasError = true;
          subject?.error(err);
        },
        complete() {
          subscription = undefined;
          subject?.complete();
        },
      });
    }

    let innerSub: Subscription | undefined = subject.subscribe(this);
    const resetSub = onReset.subscribe(() => {
      // Subscribe to the new 'subject'. 'subject' is always defined at this point
      innerSub = subject?.subscribe(this);
    });

    this.add(() => {
      refCount--;
      innerSub?.unsubscribe();
      resetSub.unsubscribe();

      if (subscription && useRefCount && refCount === 0) {
        subscription.unsubscribe();
        subscription = undefined;
        subject = undefined;
        resetSubscription?.unsubscribe();
        resetSubscription = undefined;
      }
    });
  };
}
