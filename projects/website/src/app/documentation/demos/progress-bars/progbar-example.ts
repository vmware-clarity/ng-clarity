/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

export class ProgBarExample {
  intervalId: any;
  intervalTimeInMs = 450;
  private readonly valueState = signal(0);
  private readonly completeState = signal(false);

  constructor(
    public label: string = 'demo',
    public title: string = 'Progress Bar',
    public isLabeled: boolean = false
  ) {}

  get value(): number {
    return this.valueState();
  }
  set value(value: number) {
    this.valueState.set(value);
  }

  get complete(): boolean {
    return this.completeState();
  }
  set complete(value: boolean) {
    this.completeState.set(value);
  }

  cssClassnames(): string {
    return ['progress', this.label].join(' ');
  }

  stop(): void {
    this.complete = true;
    clearInterval(this.intervalId);
  }

  reset(): void {
    this.stop();
    this.value = 0;
    this.intervalId = -1;
  }

  start(): void {
    if (this.intervalId > -1) {
      this.reset();
    }

    this.intervalId = setInterval(() => {
      this.run();
    }, this.intervalTimeInMs);
  }

  isFinished(): boolean {
    return this.complete;
  }

  run(): void {
    let myProgress: number = this.value;
    const maxProgressIncrement = 15;
    const minProgressIncrement = 4;
    this.complete = false;

    myProgress += Math.random() * (maxProgressIncrement - minProgressIncrement) + minProgressIncrement;

    if (myProgress > 99) {
      this.value = 100;
      this.stop();
    } else if (myProgress < 1 || isNaN(myProgress)) {
      this.value = 1;
    } else {
      // typescript decides to be fun and complains if the first parameter here is not a string.
      // many good things about TS. but this one is pretty lame...
      this.value = parseInt(myProgress + '', 10);
    }
  }
}
