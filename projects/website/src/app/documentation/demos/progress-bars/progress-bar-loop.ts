/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `<div class="progress loop"><progress></progress></div>`;

@Component({
  selector: 'clr-progress-bar-loop-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-loop.html',
  imports: [AnimatedExampleComponent, StackblitzExampleComponent],
})
export class ProgressBarLoopDemo {
  example = EXAMPLE;
}
