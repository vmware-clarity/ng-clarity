/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<button type="button" class="btn btn-icon" aria-label="home">
  <cds-icon shape="home"></cds-icon>
</button>
<button type="button" class="btn btn-icon btn-primary" aria-label="settings">
  <cds-icon shape="cog"></cds-icon>
</button>
<button type="button" class="btn btn-icon btn-warning" aria-label="warning">
  <cds-icon shape="warning-standard"></cds-icon>
</button>
<button type="button" class="btn btn-icon btn-danger" aria-label="error">
  <cds-icon shape="error-standard"></cds-icon>
</button>
<button type="button" class="btn btn-icon btn-success" aria-label="done">
  <cds-icon shape="check"></cds-icon>
</button>
<button type="button" class="btn btn-icon" disabled aria-label="home">
  <cds-icon shape="home"></cds-icon>
</button>
`;

@Component({
  selector: 'cds-icon-buttons-demo',
  templateUrl: './icon-buttons.html',
  styleUrl: './buttons.demo.scss',
  standalone: false,
})
export class IconButtonsDemo {
  htmlExample = HTML_EXAMPLE;
}
