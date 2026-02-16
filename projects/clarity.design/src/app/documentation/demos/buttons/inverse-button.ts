/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<button class="btn btn-inverse">Inverse</button>
<button class="btn btn-inverse" disabled>Disabled Inverse</button>
`;

const CSS_EXAMPLE = `
:host {
  background: var(--cds-global-color-construction-900);
  padding: var(--cds-global-space-9);
}
`;

@Component({
  selector: 'clr-buttons-demo-inverse-button',
  templateUrl: './inverse-button.html',
  styleUrl: './buttons.demo.scss',
  standalone: false,
})
export class InverseButtonDemo {
  htmlExample = HTML_EXAMPLE;
  cssExample = CSS_EXAMPLE;
}
