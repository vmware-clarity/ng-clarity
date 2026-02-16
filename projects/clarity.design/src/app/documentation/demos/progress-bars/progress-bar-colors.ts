/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ProgBarExample } from './progbar-example';

const EXAMPLE = `
<h4>Normal</h4>
<div class="progress">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Warning</h4>
<div class="progress warning">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Success</h4>
<div class="progress success">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>

<h4>Danger</h4>
<div class="progress danger">
  <progress max="100" value="0" data-displayval="0%"></progress>
</div>
`;

@Component({
  selector: 'clr-progress-bar-colors-demo',
  styleUrl: 'progress-bars.demo.scss',
  templateUrl: './progress-bar-colors.html',
  standalone: false,
})
export class ProgressBarColorsDemo {
  example = EXAMPLE;
  colorTypes: ProgBarExample[];
  showDangerMessage = false;

  constructor() {
    this.colorTypes = [
      new ProgBarExample('', 'Normal'),
      new ProgBarExample('warning', 'Warning'),
      new ProgBarExample('success', 'Success'),
      new ProgBarExample('danger', 'Danger'),
    ];
  }
}
