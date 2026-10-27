/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrProgressBarModule } from '@clr/angular';
import { PROGRESS_BAR_EXAMPLES } from '@clr/examples/progress-bar';

import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const LOOP_EXAMPLE = `<clr-progress-bar clrValue="75" clrLoop></clr-progress-bar>`;

@Component({
  selector: 'clr-progress-bar-component-demos',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-component.demo.html',
  imports: [ClrProgressBarModule, StackblitzExampleComponent, AnimatedExampleComponent, DocExampleComponent],
})
export class ProgressBarComponentDemo {
  readonly examples = PROGRESS_BAR_EXAMPLES;
  loopExample = LOOP_EXAMPLE;
}
