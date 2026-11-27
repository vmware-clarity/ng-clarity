/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'clr-progress-bar-component',
  styleUrls: ['progress-bars.demo.scss'],
  templateUrl: './progress-bar-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProgressBarComponentDemo {
  examples: {
    name: string;
    label: string;
    state: boolean;
    value: number;
    interval: any;
    setup: { fade: boolean };
  }[] = [
    {
      name: 'demo',
      label: 'Fade',
      state: false,
      value: 20,
      interval: null,
      setup: { fade: true },
    },
  ];
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  toggle(name: string) {
    const example = this.examples.find(expl => expl.name === name);

    if (example === undefined) {
      return;
    }
    example.state = !example.state;

    if (example.state) {
      example.interval = setInterval(() => {
        example.value = example.value + 20;
        if (example.value >= 100) {
          clearInterval(example.interval);
        }
        this.changeDetectorRef.markForCheck();
      }, 1000);
    }

    if (!example.state) {
      example.value = 20;
      clearInterval(example.interval);
    }
  }
}
