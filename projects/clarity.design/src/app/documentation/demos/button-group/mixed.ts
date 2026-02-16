/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="btn-group btn-primary">
  <button class="btn">Favorite</button>
  <button class="btn btn-success">Add</button>
  <button class="btn btn-danger">Delete</button>
</div>
`;

@Component({
  selector: 'clr-button-group-mixed-demo',
  templateUrl: './mixed.html',
  standalone: false,
})
export class MixedButtonGroupDemo {
  htmlExample = HTML_EXAMPLE;
}
