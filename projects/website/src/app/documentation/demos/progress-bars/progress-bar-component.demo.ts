/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrCommonFormsModule, ClrProgressBarModule } from '@clr/angular';

import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `<clr-progress-bar clrValue="40" clrMax="100"></clr-progress-bar>`;
const EXAMPLE1 = `<clr-progress-bar clrValue="65" clrColor="success" clrLabeled></clr-progress-bar>`;
const EXAMPLE2 = `
<div class="progress-block">
  <label for="demoProgressBar">Text on the left</label>
  <clr-progress-bar id="demoProgressBar" clrValue="85"></clr-progress-bar>
  <span>Text on the right</span>
</div>
`;
const EXAMPLE3 = `<clr-progress-bar clrValue="75" clrLoop></clr-progress-bar>`;
const EXAMPLE4 = `<clr-progress-bar clrValue="65" clrLabeled clrDisplayval="65$"></clr-progress-bar>`;

@Component({
  selector: 'clr-progress-bar-component-demos',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-component.demo.html',
  imports: [ClrProgressBarModule, StackblitzExampleComponent, AnimatedExampleComponent, ClrCommonFormsModule],
})
export class ProgressBarComponentDemo {
  example = EXAMPLE;
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  example3 = EXAMPLE3;
  example4 = EXAMPLE4;
}
