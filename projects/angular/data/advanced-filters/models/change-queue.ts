/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal. Delivers change notifications in the order the changes were made, never one inside another. Without it,
 * a subscriber that changes the tree while a change is being emitted would make every node, the root included, emit
 * the new change before the remaining subscribers got the current one.
 *
 * A singleton: every node uses `instance`. That is safe: delivery is synchronous, and the queue is always emptied
 * before the outermost mutating call returns, so nothing is left pending between tasks or tests.
 *
 * With its default configuration RxJS reports subscriber errors asynchronously, so they never reach this loop. When a
 * delivery does throw (for example with RxJS's synchronous error handling turned on), the remaining deliveries still
 * run, and the first error is thrown once the queue is empty. The tree has already changed then.
 */
export class AdvancedFilterChangeQueue {
  /**
   * The one queue of the page, shared by every node of every tree: a change of one tree made while another tree's
   * change is being delivered must wait for it too.
   */
  static readonly instance = new AdvancedFilterChangeQueue();

  private readonly pending: (() => void)[] = [];
  private delivering = false;

  private constructor() {}

  /**
   * Queues `deliveries`. Unless a delivery is already running further up the stack, runs the queue until it is empty.
   */
  deliver(deliveries: readonly (() => void)[]): void {
    this.pending.push(...deliveries);
    if (this.delivering) {
      return;
    }
    this.delivering = true;
    let failure: { error: unknown } | undefined;
    try {
      for (let delivery = this.pending.shift(); delivery; delivery = this.pending.shift()) {
        try {
          delivery();
        } catch (error) {
          failure ??= { error };
        }
      }
    } finally {
      this.delivering = false;
    }
    if (failure) {
      throw failure.error;
    }
  }
}
