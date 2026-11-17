/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

type FakeTimer = 'setTimeout' | 'clearTimeout' | 'setInterval' | 'clearInterval' | 'Date';

/**
 * Fake only application timers (all of them, or the given ones); leave Angular's rAF and microtask scheduler native.
 * Use it instead of `vi.useFakeTimers()`, so that the fake timers can't outlive the test that installed them.
 *
 * The real timers come back when the test finishes. This is registered here, not as an `afterEach` in
 * `test-setup.ts`: with coverage on, hooks registered there only apply to the first spec file.
 */
export function useTestTimers(
  toFake: FakeTimer[] = ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date']
): void {
  vi.useFakeTimers({ toFake });
  onTestFinished(() => {
    vi.useRealTimers();
  });
}
