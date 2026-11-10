/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Fake only application timers; leave Angular's rAF and microtask scheduler native.
 *
 * The real timers come back when the test finishes. This is registered here, not as an `afterEach` in
 * `test-setup.ts`: with coverage on, hooks registered there only apply to the first spec file.
 */
export function useTestTimers(): void {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'] });
  onTestFinished(() => {
    vi.useRealTimers();
  });
}
