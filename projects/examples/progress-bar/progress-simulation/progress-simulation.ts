/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Simulates a task that reports its progress in random steps, so that the examples can show how a progress bar
 * fills up. Use the real progress of your task instead.
 */
export class ProgressSimulation {
  value = 0;

  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor(
    readonly title: string,
    readonly classNames = '',
    readonly isLabeled = false
  ) {}

  get cssClassnames(): string {
    return ['progress', this.classNames].join(' ').trim();
  }

  start(): void {
    this.stop();
    this.value = 0;
    this.intervalId = setInterval(() => this.run(), 450);
  }

  stop(): void {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  private run(): void {
    const minIncrement = 4;
    const maxIncrement = 15;
    const progress = this.value + Math.random() * (maxIncrement - minIncrement) + minIncrement;

    if (progress > 99) {
      this.value = 100;
      this.stop();
    } else {
      this.value = Math.floor(progress);
    }
  }
}
