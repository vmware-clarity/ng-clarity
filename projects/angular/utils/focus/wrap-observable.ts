/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Observer } from 'rxjs';

export function wrapObservable<T>(
  observable: Observable<T>,
  onSubscribe?: (observer: Observer<T>) => void,
  onUnsubscribe?: (observer: Observer<T>) => void
): Observable<T> {
  return Observable.create((observer: Observer<T>) => {
    onSubscribe(observer);
    const subscription = observable.subscribe(observer);
    return () => {
      subscription.unsubscribe();
      if (onUnsubscribe) {
        onUnsubscribe(observer);
      }
    };
  });
}
