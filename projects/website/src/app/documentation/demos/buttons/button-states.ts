/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE_1 = `
<button class="btn btn-info-outline">Info</button>
<button class="btn btn-success-outline">Success</button>
<button class="btn btn-danger-outline">Danger</button>
`;

const HTML_EXAMPLE_2 = `
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
`;

@Component({
  selector: 'clr-buttons-demo-button-states',
  templateUrl: './button-states.html',
  styleUrl: './buttons.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class ButtonStatesDemo {
  htmlExample1 = HTML_EXAMPLE_1;
  htmlExample2 = HTML_EXAMPLE_2;
}
