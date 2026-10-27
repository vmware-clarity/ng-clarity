/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AdvancedFilterChangeQueue } from './change-queue';

describe('AdvancedFilterChangeQueue', () => {
  // The singleton is empty again whenever deliver() returns, also after an error, so the specs can share it.
  const queue = AdvancedFilterChangeQueue.instance;

  it('runs the deliveries in order', () => {
    const log: number[] = [];
    queue.deliver([() => log.push(1), () => log.push(2), () => log.push(3)]);
    expect(log).toEqual([1, 2, 3]);
  });

  it('runs deliveries queued during a delivery after the current ones, before returning', () => {
    const log: string[] = [];
    queue.deliver([
      () => {
        log.push('a');
        queue.deliver([() => log.push('nested')]);
        log.push('a done');
      },
      () => log.push('b'),
    ]);
    expect(log).toEqual(['a', 'a done', 'b', 'nested']);
  });

  it('keeps delivering when a delivery throws, then throws the first error', () => {
    const log: string[] = [];
    expect(() =>
      queue.deliver([
        () => {
          throw new Error('first');
        },
        () => log.push('still delivered'),
        () => {
          throw new Error('second');
        },
      ])
    ).toThrowError('first');

    queue.deliver([() => log.push('next call')]);

    expect(log).toEqual(['still delivered', 'next call']);
  });

  it('is one instance', () => {
    expect(AdvancedFilterChangeQueue.instance).toBe(queue);
    expect(queue).toEqual(jasmine.any(AdvancedFilterChangeQueue));
  });
});
